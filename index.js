const robot = require("robotjs");

function main() {
  console.log("Starting...");

  // Coordinates for the Tinderbox and the first Maple Log
  const tinderboxCoordinates = { x: 1000, y: 800 }; // adjust based on your client location
  const inventoryOrigin = { x: 990, y: 800 }; // Top-left corner of the inventory

  // Distance between each Maple Log (adjust based on your game)
  const baseLogDistanceX = 42;
  const baseLogDistanceY = 37;

  const variationRange = 2;

  // Number of Maple Logs in each row and the number of rows
  const logsInRow = 4;
  const numberOfRows = 7;

  // Set the mouse speed (0 is slowest, 10 is fastest)
  robot.setMouseDelay(3);


  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col < logsInRow; col++) {
      // Skip the first log on the first row
      if (row === 0 && col === 0) {
        continue;
      }
      // Calculate coordinates for the current Maple Log relative to the inventory origin
      const randomOffsetX = getRandomOffset(variationRange);
      const randomOffsetY = getRandomOffset(variationRange);

      const currentLogCoordinates = {
        x: inventoryOrigin.x + col * (baseLogDistanceX + randomOffsetX),
        y: inventoryOrigin.y + row * (baseLogDistanceY + randomOffsetY),
      };

      // Click Tinderbox
      robot.moveMouseSmooth(tinderboxCoordinates.x, tinderboxCoordinates.y);
      robot.mouseClick();
     
      // Sleep for a longer duration for iterations 1-8
      if (row * logsInRow + col < 8) {
        sleepRandom(1800, 2200);
      } else if (row * logsInRow + col < 18) {
        // Sleep for a normal duration for iterations 9-18
        sleepRandom(450, 650);
      } else {
        // Sleep for a very small duration for iterations 19-27
        sleepRandom(50, 150);
      }

      // Click the current Maple Log
      robot.moveMouseSmooth(currentLogCoordinates.x, currentLogCoordinates.y);
      robot.mouseClick();

      // Sleep for a random short duration before the next iteration
      sleepRandom(100, 300);
    }
  }

  console.log("Script completed.");
}

function getRandomOffset(range) {
  return Math.floor(Math.random() * (2 * range + 1)) - range;
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function sleepRandom(min, max) {
  const randomDuration = Math.random() * (max - min) + min;
  sleep(randomDuration);
}

main();
