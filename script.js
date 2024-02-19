const rectangleData = [];
const pointer = document.querySelector(".slider__pointer");
const pregame = document.querySelector(".pregame");
let gameStarted = false;
let animation;
let playerHealth = 3;
let playerShield = 9;
let enemyHealth = 3;


// Use DOMContentLoaded event to ensure the DOM is fully loaded immediately followed by creating the blocks 
document.addEventListener('DOMContentLoaded', createBlocks());

document.body.onkeydown = function(e) {
  if ((e.key == " " || e.code == "Space" || e.keyCode == 32) && !gameStarted) {
    e.preventDefault();
    startGame();
    
  } else if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    e.preventDefault();
    console.log("spacebar is clicked")
    calculateAnimation();
  }
};









// Utility functions

function startGame () {
  gameStarted = true;
  movePointer();
  pregame.style.display = 'none';
}

/**
 * Create and append random-sized rectangles within a specified container.
 * Random widths are generated between 5 and 15 units.
 * Rectangle positions are determined using a getRandomPosition function.
 * Rectangle data, including ID, left position, and width, is stored in the rectangleData array.
 * @function
 */

function createBlocks() {
  const container = document.getElementById('slider');

  for (let i = 0; i < 3; i++) {
    const width = Math.floor(Math.random() * (15 - 5 + 1)) + 5; // Random width between 10 and 40

    if (container) {
      const xPosition = getRandomPosition(container.offsetWidth, width);
      const rectangle = document.createElement('div');

      rectangle.className = 'rectangle';
      rectangle.style.width = `${width}px`;
      rectangle.style.left = `${xPosition}px`;

      const id = `rectangle_${i}`;
      rectangle.setAttribute('data-id', id);

      container.appendChild(rectangle);

      // Store rectangle data
      rectangleData.push({
        id: id,
        left: xPosition,
        width: width
      });
      console.log(rectangleData)
    }
  }
}



/**
 * Generate a random position within a container, ensuring no overlap with existing rectangles.
 * Used by createBlocks function
 * @param {number} containerWidth - The width of the container.
 * @param {number} rectangleWidth - The width of the rectangle to be positioned.
 * @returns {number} - A random x-position without overlap.
 */

function getRandomPosition(containerWidth, rectangleWidth) {
  const minDistance = 25;
  let xPosition;

  do {
    xPosition = Math.floor(Math.random() * (containerWidth - rectangleWidth + 1));
  } while (isOverlap(xPosition, minDistance));

  return xPosition;
}





/**
 * Check if there is an overlap between a given position (x) and rectangles in the rectangleData array.
 * @param {number} x - The position to check for overlap.
 * @param {number} minDistance - The minimum distance allowed to consider an overlap.
 * @returns {boolean} - True if there is an overlap, false otherwise.
 */

function isOverlap(x, minDistance) {
  for (const rectData of rectangleData) {
    if (Math.abs(x - rectData.left) < minDistance ||
        Math.abs(x - (rectData.left + rectData.width)) < minDistance) {
      return true; // Overlapping
    }
  }
  return false; // Not overlapping
}

/**
 * Move the pointer animation from left to right and then back from right to left.
 * Uses the Web Animations API to animate the 'left' property of the pointer element.
 * Note: The animation duration is set to 2000 milliseconds with a linear easing function.
 */

function movePointer() {

  // Move right
  animation = pointer.animate(
    [{ left: '0px' }, { left: '315px' }],
    { duration: 2000, easing: 'linear', fill: 'forwards' }
  );

  // Set a timeout for the left movement after the right movement completes
  setTimeout(function () {
    // Move left
    animation = pointer.animate(
      [{ left: '315px' }, { left: '0px' }],
      { duration: 2000, easing: 'linear', fill: 'forwards' }
    );
  }, 2000);
}



/**
 * Calculate and handle animations based on the position of a pointer relative to rectangles.
 * If the pointer intersects with a rectangle, perform specified actions and remove the rectangle.
 * Note: Ensure 'animation' is truthy before calling this function.
 */

function calculateAnimation() {
  if (animation) {
    var computedStyle = getComputedStyle(pointer);
    var pointerLeft = parseFloat(computedStyle.left);
    var pointerRight = pointerLeft + pointer.offsetWidth;

    for (let i = 0; i < rectangleData.length; i++) {
      const rectData = rectangleData[i];
      var rectLeft = rectData.left;
      var rectRight = rectData.left + rectData.width;

      if ((pointerLeft >= rectLeft && pointerLeft <= rectRight) ||
          (pointerRight >= rectLeft && pointerRight <= rectRight)) {
        console.log(`Pointer is within the rectangle with ID: ${rectData.id}`);

        // Perform further actions here if needed

        // Remove the rectangle from the DOM
        const container = document.getElementById('slider');
        const rectangleElement = document.querySelector(`[data-id="${rectData.id}"]`);
        container.removeChild(rectangleElement);

        // Remove the corresponding data from rectangleData array
        rectangleData.splice(i, 1);

        break; // Break out of the loop since the rectangle is found and removed
      }
    }
  }
}



