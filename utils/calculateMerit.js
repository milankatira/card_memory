/**
 * Function to calculate marit
 * @param {boardStats} brodcast stats
 */

export const CalculateMerit = (boardStats) => {

  const time = Math.floor(boardStats?.elapsedTime);
  if (time <= 40) {

    return "Execelent";

  } else if (time > 40 && time <= 60) {

    return "Good";

  }
  return "Average";

};
