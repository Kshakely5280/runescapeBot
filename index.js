const robot = require("robotjs");

function main() {
  console.log("Starting...");

  // Coordinates for the Tinderbox and the first Maple Log
  const tinderboxCoordinates = { x: 1000, y: 800 };
  const inventoryOrigin = { x: 990, y: 800 }; // Top-left corner of the inventory

  // Distance between each Maple Log (adjust based on your game)
  const logDistanceX = 42; // Example distance
  const logDistanceY = 38; // Example distance

  // Number of Maple Logs in each row and the number of rows
  const logsInRow = 4; // Adjust based on your game
  const numberOfRows = 7; // Adjust based on your game

  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < logsInRow; col++) {
      // Calculate coordinates for the current Maple Log relative to the inventory origin
      const currentLogCoordinates = {
        x: inventoryOrigin.x + col * logDistanceX,
        y: inventoryOrigin.y + row * logDistanceY,
      };

      // Click Tinderbox
      robot.moveMouseSmooth(tinderboxCoordinates.x, tinderboxCoordinates.y);
      robot.mouseClick();

      // Sleep for a random short duration
      sleepRandom(500, 1000);

      // Click the current Maple Log
      robot.moveMouseSmooth(currentLogCoordinates.x, currentLogCoordinates.y);
      robot.mouseClick();

      // Sleep for a random short duration before the next iteration
      sleepRandom(1000, 2000);
    }
  }

  console.log("Script completed.");
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sleepRandom(min, max) {
  const randomDuration = Math.random() * (max - min) + min;
  sleep(randomDuration);
}

main();
