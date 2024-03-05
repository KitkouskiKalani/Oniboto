const pregame = document.querySelector(".pregame");
let gameStarted = false;
let animation;
let playerHealth = 3;
let playerShield = 9;
let enemyHealth = 3;


// Use DOMContentLoaded event to ensure the DOM is fully loaded immediately followed by creating the blocks 
// document.addEventListener('DOMContentLoaded', createBlocks());
// startGame();

// document.body.onkeydown = function(e) {
//   if ((e.key == " " || e.code == "Space" || e.keyCode == 32) && !gameStarted) {
//     e.preventDefault();
//     // Start game here after user clicks space
//     // startGame();
    
//   } else if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
//     e.preventDefault();
//     console.log("spacebar is clicked")
//     calculateAnimation();
//   }
// };

// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Get the canvas element and its drawing context
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Set initial canvas dimensions
  let canvasWidth = 320;
  let canvasHeight = 70;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  // Set the background color of the canvas
  canvas.style.backgroundColor = 'black';

  // Initialize slider dimensions and position
  let sliderWidth = 10;
  let sliderHeight = canvasHeight;
  let sliderX = 0; // Starting X position of the slider


  let movingLeft = false;
  let isAnimating = false; // Flag to control the animation loop
  let currentRound = 0;
  const totalRoundsInSet = 4; // How many rounds in a set

  // Array to store hitboxes
  let hitboxes = [];

  // Function to draw the slider on the canvas
  function drawSlider() {
    ctx.fillStyle = 'white'; // Set slider color
    ctx.fillRect(sliderX, 0, sliderWidth, sliderHeight); // Draw the slider
  }

  // Function to clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  
  function animateSlider() {
    if (!isAnimating) return; // Stop the animation if the flag is false

    clearCanvas();
    drawHitboxes();
    drawSlider();

    // Update the slider's position
    if (!movingLeft) {
        if (sliderX < canvasWidth - sliderWidth) {
            sliderX += 1; // Adjust for smoother movement
        } else {
            movingLeft = true; // Change direction
        }
    } else {
        if (sliderX > 0) {
            sliderX -= 1;
        } else {
            movingLeft = false;
            currentRound++;
            if (currentRound >= totalRoundsInSet) {
                isAnimating = false; // Stop the animation after the last round
                return; // Optionally start a new set or end the game here
            }
            // Reset slider for the next round without stopping the animation
            sliderX = 0;
            movingLeft = false;
        }
    }

    requestAnimationFrame(animateSlider);
}
  

  // Function to create hitboxes with updated constraints
  function createHitboxes() {
    hitboxes = []; // Reset hitboxes array
    let minGapBetweenHitboxes = 25; // Minimum gap between hitboxes
    let safeZoneStart = 50; // No hitbox can start within this distance from the canvas start
    let attempts = 0; // Track attempts to avoid infinite loops
    let maxAttempts = 100; // Maximum attempts to place hitboxes

    while (hitboxes.length < 3 && attempts < maxAttempts) {
      let width = Math.floor(Math.random() * (16 - 8 + 1)) + 8; // Random width between 8 and 16px
      // Ensure random x position respects the safe zone and potential maximum width of hitboxes
      let x = Math.floor(Math.random() * (canvasWidth - width - safeZoneStart)) + safeZoneStart;

      let validPlacement = true; // Assume this placement is valid initially

      // Check against all previously placed hitboxes for valid placement
      for (let hitbox of hitboxes) {
        let distance = Math.abs(x - hitbox.x);
        // If new hitbox is too close to an existing one, invalidate this placement
        if (distance < width + minGapBetweenHitboxes || x < safeZoneStart) {
          validPlacement = false;
          break;
        }
      }

      // If valid, add the new hitbox to the array
      if (validPlacement) {
        hitboxes.push({ x, width });
      } else {
        attempts++; // Increment attempts if placement was not valid
      }
    }

    // Ensure hitboxes are sorted by their x position for consistent rendering
    hitboxes.sort((a, b) => a.x - b.x);
  }

  

  // Function to draw hitboxes on the canvas
  function drawHitboxes() {
    hitboxes.forEach(hitbox => {
      ctx.fillStyle = '#fb7300'; // Set hitbox color
      ctx.fillRect(hitbox.x, 0, hitbox.width, canvasHeight); // Draw the hitbox
    });
  }

  // Function to check if the slider hits any hitboxes
  function checkHit() {
    let hit = hitboxes.some(hitbox => sliderX + sliderWidth >= hitbox.x && sliderX <= hitbox.x + hitbox.width);
    if (hit) {
      console.log('Hit!'); // Log hit to the console
      // Remove hit hitbox from the array
      hitboxes = hitboxes.filter(hitbox => !(sliderX + sliderWidth >= hitbox.x && sliderX <= hitbox.x + hitbox.width));
      clearCanvas();
      drawSlider(); // Redraw the slider without the hit hitbox
      drawHitboxes(); // Redraw remaining hitboxes
    } else {
      console.log('No hit'); // Log miss to the console
    }
  }



  // Event listener for keydown events
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      checkHit();
    }
  });

  


  function startSet() {
    createHitboxes(); // Create hitboxes once per set
    drawHitboxes(); // Draw hitboxes for the entire set
    sliderX = 0; // Reset slider position to the left
    currentRound = 0; // Reset the round counter at the start of a set
    movingLeft = false; // Start moving right
    isAnimating = true; // Start the animation
    startRound(); // Start the first round
  }
  function startRound() {
    // clearCanvas(); // Clear canvas at the start of each round
    
    // drawSlider(); // Draw the slider at the starting position
    // drawHitboxes(); // Ensure hitboxes are drawn, but not recreated
    isAnimating = true; // Ensure the animation loop continues
    animateSlider();
  }



  //Start game
  startSet();
});