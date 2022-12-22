import React, { useState, useEffect, useRef } from "react";

import Modal from "./modal";

import q1 from "./icons/css.png";
import q2 from "./icons/scss.png";
import q3 from "./icons/tailwindcss.png";
import q4 from "./icons/react.png";
import q5 from "./icons/solidity.png";
import q6 from "./icons/node.png";
import q7 from "./icons/js.png";
import q8 from "./icons/html.png";
import { shufflingArray } from "../utils/shuffleArray";
import { CalculateMerit } from "../utils/calculateMerit";

const imgArr = [q1, q2, q3, q4, q5, q6, q7, q8];

const initialState = {
  moves: 0,
  time: 0,
  elapsedTime: 0,
};

function NetlifyCardGame() {

  // TODO 16 images with 2 duplicate image (8*2)
  const imgArray = imgArr.concat(imgArr);

  // TODO suffeled array of images
  const [newImgArray, setNewImgArray] = useState([]);

  // TODO board staticstics
  const [boardStats, setBoardStats] = useState({ ...initialState });

  // TODO duplicate array for hiding image
  const duplicateImgArray = useRef([]);

  // TODO disabled click while updating state if taking time
  const disableClick = useRef(false);

  // TODO Show guide modal
  const [showModal, setShowModal] = useState(false);

  const toggle = () => {

    setShowModal(!showModal);

  };

  // TODO timer ref
  const timer = useRef(null);

  // TODO matched image array
  const [matchedItems, setMatchedItems] = useState([]);

  const shuffle = () => {

    const shuffledArray = shufflingArray(imgArray);
    duplicateImgArray.current = shuffledArray;
    setNewImgArray(shuffledArray);

  };

  useEffect(() => {

    shuffle();

  }, []);

  useEffect(() => {

    if (boardStats.time !== 0 && matchedItems.length < 8) {

      // TODO starts timer when user clicks
      const secondCalculations = setInterval(() => {

        const calcSeconds = new Date().getTime() - boardStats.time.getTime();
        setBoardStats((pre) => ({ ...pre, elapsedTime: calcSeconds / 1000 }));

      }, 1000);

      // TODO after upateing every second we have to clean the event listener
      return () => clearInterval(secondCalculations);

    }

  }, [boardStats.time, matchedItems.length]);

  const boxClickHandler = ({ id, img }) => {

    const currentlyShownItem = duplicateImgArray.current.find(
      (i) => i.show === true,
    ); // TODO if false means no active item

    // TODO if same item clicked again
    if (currentlyShownItem?.id === id) return;

    // TODO if matched image click again
    if (matchedItems.some((i) => i.img === img)) return;

    // TODO count the moves and set current time of the first move is done
    setBoardStats({
      ...boardStats,
      time: boardStats?.moves === 0 ? new Date() : boardStats.time,
      moves: boardStats.moves + 1,
    });

    // TODO clicked item image pair
    const imageItems = newImgArray.filter((i) => i.img === img);
    if (currentlyShownItem) {

      // TODO checking if clicked item img is same as active item img
      const findPair = imageItems.find((i) => i.img === currentlyShownItem.img);
      if (!findPair) {

        // TODO if not same, then find the item from the main array
        const findClickedItem = imageItems.find((i) => i.id === id);
        findClickedItem.show = true; // need to display it for sometime
        const updatedItemList = newImgArray.map((i) =>
          i.id === findClickedItem.id ? findClickedItem : i,
        );

        // TODO updating the main array
        setNewImgArray(updatedItemList);
        disableClick.current = true;

        // TODO timeout will hide the item after 1 second
        return timeOutCall(findClickedItem, currentlyShownItem);

      }
      disableClick.current = true;

      // TODO searching for same image other object
      const otherPair = imageItems.find((i) => i.id !== currentlyShownItem.id);
      otherPair.show = true;
      const updatedItemList = newImgArray.map((i) =>
        i.id === otherPair.id ? otherPair : i,
      );

      // TODO updated array maintaining the index
      duplicateImgArray.current = updatedItemList.filter(
        (i) => i.show === false,
      );

      // TODO updating the duplicate array
      setNewImgArray(updatedItemList);

      // TODO updating the main object
      setMatchedItems([...matchedItems, findPair]);
      disableClick.current = false;

    } else {

      const findClickedItem = newImgArray.find((i) => i.id === id);
      findClickedItem.show = true;

      const updatedArray = newImgArray.map((i) =>
        i.id === findClickedItem.id ? findClickedItem : i,
      );
      setNewImgArray(updatedArray);

    }

  };
  const timeOutCall = (clickedItem, activeItem) => {

    return (timer.current = setTimeout(() => {

      clickedItem.show = false;
      if (activeItem) {

        activeItem.show = false;

      }
      const updatedArray = newImgArray.map((i) => {

        if (i.id === clickedItem.id) {

          return clickedItem;

        } else if (activeItem && i.id === activeItem?.id) {

          return activeItem;

        }
        return i;

      });
      disableClick.current = false;
      setNewImgArray(updatedArray);
      clearTimeout(timer.current);

    }, 1500));

  };

  const resetHandler = () => {

    setBoardStats({ ...initialState });
    setMatchedItems([]);
    shuffle();

  };

  return (
    <React.Fragment>
      <div className="main">
        <h2 className="main__guide" onClick={toggle}>
          How to Play?
        </h2>
        <div className="main__container">
          <div className="main__container__game-body">
            {newImgArray.map((item, idx) => {

              return (
                <div
                  className="main__container__game-body__item"
                  key={item?.img + idx}
                  onClick={() => {

                    !disableClick.current
                      ? boxClickHandler({ ...item, id: idx })
                      : null;

                  }}
                >
                  <div
                    className={`main__container__game-body__item__img-container ${
                      item?.show
                        ? "main__container__game-body__item__shown"
                        : "main__container__game-body__item__hidden"
                    }`}
                  >
                    {item?.show && (
                      <img alt="img" className="item-img" src={item?.img.src} />
                    )}
                  </div>
                </div>
              );

            })}
            <div className="main__container__game-body__footer">
              <p>Moves: {boardStats.moves}</p>
              <p>Elapsed Time: {Math.floor(boardStats.elapsedTime)} Seconds</p>
              {matchedItems.length === 8 && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  Congrats! {CalculateMerit(boardStats)} Performance
                </p>
              )}
              <button
                className="main__container__game-body__footer__reset"
                onClick={resetHandler}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal showModal={showModal} toggle={toggle} />
    </React.Fragment>
  );

}

export default NetlifyCardGame;
