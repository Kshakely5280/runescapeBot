const robot = require("robotjs");
const keypress = require("keypress");

keypress(process.stdin);

let isRunning = true;

process.stdin.on("keypress", function (ch, key) {
  if (key && key.ctrl && key.name === "c") {
    isRunning = false;
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

function findMapleLogs() {
  const inventoryX = 950; // Adjust these coordinates based on your game window
  const inventoryY = 800;
  const inventoryWidth = 200; // Adjust this based on your inventory size
  const inventoryHeight = 300;

  for (let x = inventoryX; x < inventoryX + inventoryWidth; x += 10) {
    for (let y = inventoryY; y < inventoryY + inventoryHeight; y += 10) {
      robot.moveMouse(x, y);

      const screen = robot.screen.capture(
        inventoryX,
        inventoryY,
        inventoryWidth,
        inventoryHeight
      );

      const mapleLogsColor = [255, 180, 40];
      const currentPixelColor = screen.colorAt(x - inventoryX, y - inventoryY);

      const colorThreshold = 10;
      if (
        Math.abs(currentPixelColor.r - mapleLogsColor[0]) < colorThreshold &&
        Math.abs(currentPixelColor.g - mapleLogsColor[1]) < colorThreshold &&
        Math.abs(currentPixelColor.b - mapleLogsColor[2]) < colorThreshold
      ) {
        return { x: x, y: y };
      }
    }
  }

  return null;
}

function checkActionAvailable() {
  // You need to capture the screen content and check for the "Use Tinderbox on Maple logs" text or image
  // Implement this part based on your game's UI and appearance
  // You might need to use a library like Tesseract.js or another OCR (Optical Character Recognition) tool
  // Here's a simplified example (doesn't actually perform OCR):

  const screen = robot.screen.capture();
  const actionTextCoordinates = screen.findBitmap("use_tinderbox_on_maple_logs.png");

  return actionTextCoordinates !== null;
}

function main() {
  console.log("Starting...");
  sleepRandom(4000, 5000);

  const tinderboxSlot = { x: 1000, y: 800 };

  while (isRunning) {
    // Click Tinderbox
    robot.moveMouse(tinderboxSlot.x, tinderboxSlot.y);
    sleepRandom(100, 300);
    robot.mouseClick();

    sleepRandom(1500, 2500);

    // Hover over inventory until "Use Tinderbox on Maple logs" is available
    while (!checkActionAvailable() && isRunning) {
      sleep(500);
    }

    if (isRunning) {
      // Click Maple Logs
      const logsSlot = findMapleLogs();
      if (logsSlot) {
        robot.moveMouse(logsSlot.x, logsSlot.y);
        sleepRandom(100, 200);
        robot.mouseClick();
      } else {
        console.log("Maple Logs not found");
      }

      // Click Tinderbox again
      robot.moveMouse(tinderboxSlot.x, tinderboxSlot.y);
      sleepRandom(100, 300);
      robot.mouseClick();

      sleepRandom(8000, 10000);
    }
  }

  console.log("Script stopped.");
}

function sleepRandom(min, max) {
  const randomDuration = Math.random() * (max - min) + min;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, randomDuration);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

main();
