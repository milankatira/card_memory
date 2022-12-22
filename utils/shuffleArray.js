/**
 * Function to shuffle array
 * @param {imageArray} imgArray
 */

export const shufflingArray = (imgArray) => {

  const shuffledArray = imgArray.sort(() => Math.random() - 0.5);

  return shuffledArray.map((item, index) => ({
    img: item,
    id: index,
    show: false,
  }));

};
