const rectangleData = [];

function createRectangles() {
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

function getRandomPosition(containerWidth, rectangleWidth) {
  const minDistance = 25;
  let xPosition;

  do {
    xPosition = Math.floor(Math.random() * (containerWidth - rectangleWidth + 1));
  } while (isOverlap(xPosition, minDistance));

  return xPosition;
}

function isOverlap(x, minDistance) {
  for (const rectData of rectangleData) {
    if (Math.abs(x - rectData.left) < minDistance ||
        Math.abs(x - (rectData.left + rectData.width)) < minDistance) {
      return true; // Overlapping
    }
  }
  return false; // Not overlapping
}

// Use DOMContentLoaded event to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', createRectangles());




var pointer = document.querySelector(".slider__pointer");
  var gameStarted = false;
  var animation;

  document.body.onkeydown = function(e) {
    if ((e.key == " " || e.code == "Space" || e.keyCode == 32) && !gameStarted) {
      e.preventDefault();
      gameStarted = true;
      movePointer();
    } else if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      e.preventDefault();
      console.log("spacebar is clicked")
      calculateAnimation();
    }
  };

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



