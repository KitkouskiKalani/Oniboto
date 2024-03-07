const pregame = document.querySelector(".pregame");
let gameStarted = false;
let gameOver = false;
let animation;
let currentSet = 1;
let playerHealth = 3;
let playerShieldOne = 3;
let playerShieldTwo = 3;
let playerShieldThree = 3;
let enemyHealth = 3;


// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.querySelector('.shareBtn');
  // Unified event handler for both click and touchstart
  function handleShareEvent(event) {
  // Prevent the default action to avoid handling both touchstart and click on touch devices
  event.preventDefault();
  shareWithFriends();
  }

  if (shareButton) {
  // Listen for click events for non-touch devices
  shareButton.addEventListener('click', handleShareEvent);

  // Listen for touchstart events for touch devices
  shareButton.addEventListener('touchstart', handleShareEvent);
  }
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

  
  let lastTime = 0; // Tracks the last frame time
  const sliderSpeed = 100; // Slider speed in pixels per second

  let touchRightCounter = 0;
  let isPausing = false;
  function pauseSlider(characterHit) {
    const playerImage = document.querySelector('.player__img');
    const enemyImage = document.querySelector('.enemy__img');
    isPausing = true; // Indicate that the slider should pause

    if(characterHit=="player"){
      playerImage.src = './player_damage.png';
    }
    else if(characterHit=="enemy"){
      enemyImage.src = './oni_damage.png';
    }
  
    setTimeout(() => {
      // After 800ms, allow the slider to move again
      playerImage.src = './player_crop.png';
      enemyImage.src = './oni.jpg';
      isPausing = false;
    }, 800);
  }
  function animateSlider(time) {
    if (!isAnimating) return;

    if (!lastTime) {
        lastTime = time;
    }


    const deltaTime = (time - lastTime) / 1000; // Time elapsed in seconds
    lastTime = time;

    clearCanvas();
    drawHitboxes();
    drawSlider();

    if(!isPausing){
      // Determine movement based on elapsed time and speed
      if (!movingLeft) {
          if (sliderX < canvasWidth - sliderWidth) {
              sliderX += sliderSpeed * deltaTime ; // Move right + (currentSet *0.04)
          } else {
              movingLeft = true; // Change direction
              if(touchRightCounter>=1){
                if (hitboxesDestroyed()) {
                  console.log('all hitboxes destroyed')
                }
                switch (currentSet) {
                  case 1:
                      if (playerShieldOne > 0 && hitboxes.length>0) playerShieldOne--;
                      break;
                  case 2:
                      if (playerShieldTwo > 0 && hitboxes.length>0) playerShieldTwo--;
                      break;
                  case 3:
                      if (playerShieldThree > 0 && hitboxes.length>0) playerShieldThree--;
                      break;
                }
                updateVisuals();
              }
              touchRightCounter++;
          }
      } else {
          if (sliderX > 0) {
              sliderX -= sliderSpeed * deltaTime; // Move left
          } else {
            movingLeft = false;
            currentRound++;
            endOfRound();
            
            // Reset slider for the next round without stopping the animation
            sliderX = 0;
          }
      }
    }
    

    
    requestAnimationFrame(animateSlider);
  }

  function endOfRound() {
    // Assume hitboxesDestroyed is a condition that checks if all hitboxes are destroyed
    if (hitboxesDestroyed()) {
      if (enemyHealth == 0) {
            gameWon();
      }
      startNextSet(); // Proceed to the next set
      
    } else if(currentSet==1 && currentRound==1){updateVisuals();}
      else {
        // Subtract from the current set's shield or health if not all hitboxes are destroyed
        switch (currentSet) {
            case 1:
                if (playerShieldOne > 0) playerShieldOne--;
                else if (playerHealth > 0){
                  playerHealth--;
                  pauseSlider("player");
                  playerHitAnimation();
                } 
                break;
            case 2:
                if (playerShieldTwo > 0) playerShieldTwo--;
                else if (playerHealth > 0){
                  playerHealth--;
                  pauseSlider("player");
                  playerHitAnimation();
                } 
                break;
            case 3:
                if (playerShieldThree > 0) playerShieldThree--;
                else if (playerHealth > 0){
                  playerHealth--;
                  pauseSlider("player");
                  playerHitAnimation();
                } 
                break;
        }
        updateVisuals();
    }

    if (playerHealth <= 0) {
        gameOver(); // Handle game over scenario
    }
  }
  function updateVisuals() {
    // Update shields and health visuals based on current values
    updateShieldVisuals();
    updateHeartVisuals();
    updateEnemyHealthVisuals();
    updateMiniShieldColors();
  }
  function updateShieldVisuals() {
    // Update shield visuals for Shield One (Blue)
    for (let i = 1; i <= 3; i++) {
        if (i > playerShieldOne) {
            document.querySelector(`.shield${i}.blue`).style.backgroundColor = 'gray';
        }
    }
    
    // Update shield visuals for Shield Two (Teal)
    for (let i = 4; i <= 6; i++) {
        if (i - 3 > playerShieldTwo) {
            document.querySelector(`.shield${i}.teal`).style.backgroundColor = 'gray';
        }
    }
    
    // Update shield visuals for Shield Three (Yellow)
    for (let i = 7; i <= 9; i++) {
        if (i - 6 > playerShieldThree) {
            document.querySelector(`.shield${i}.yellow`).style.backgroundColor = 'gray';
        }
    }
  }

  function updateMiniShieldColors() {
    // Determine which set is currently being played to decide which shields to represent
    switch (currentSet) {
        case 1:
            // For set 1, we're updating minishield1 based on playerShieldOne
            document.querySelector('.minishield1').style.backgroundColor = playerShieldOne > 2 ? '#3588de' : 'gray';
            document.querySelector('.minishield2').style.backgroundColor = playerShieldOne > 1 ? '#3588de' : 'gray';
            document.querySelector('.minishield3').style.backgroundColor = playerShieldOne > 0 ? '#3588de' : 'gray';
            break;
        case 2:
            // For set 2, assuming minishield2 represents the status of playerShieldTwo
            document.querySelector('.minishield1').style.backgroundColor = playerShieldTwo > 2 ? '#04ad9d' : 'gray';
            document.querySelector('.minishield2').style.backgroundColor = playerShieldTwo > 1 ? '#04ad9d' : 'gray';
            document.querySelector('.minishield3').style.backgroundColor = playerShieldTwo > 0 ? '#04ad9d' : 'gray';
            break;
        case 3:
            // For set 3, minishield3 represents the status of playerShieldThree
            document.querySelector('.minishield1').style.backgroundColor = playerShieldThree > 2 ? '#e9dd3b' : 'gray';
            document.querySelector('.minishield2').style.backgroundColor = playerShieldThree > 1 ? '#e9dd3b' : 'gray';
            document.querySelector('.minishield3').style.backgroundColor = playerShieldThree > 0 ? '#e9dd3b' : 'gray';
            break;
    }
  }
  function updateHeartVisuals() {
    for (let i = 1; i <= 3; i++) {
        if (i > playerHealth) {
            document.querySelector(`.player__heart.heart${i}`).style.backgroundColor = 'black';
        }
    }
  }

  function updateEnemyHealthVisuals() {
    // Directly set hearts that exceed current enemyHealth to black
    for (let i = 1; i <= 3; i++) {
        const heart = document.querySelector(`.enemy__heart.heart${i}`);
        if (heart) { // Ensure the heart element exists to avoid errors
            heart.style.backgroundColor = i <= enemyHealth ? "" : "black"; // Set exceeded hearts to black
        }
    }
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
      if(hitboxesDestroyed()){
        if (enemyHealth > 0) {
          enemyHitAnimation();
          pauseSlider("enemy");
          enemyHealth--; // Decrement enemy health
          updateEnemyHealthVisuals(); // Update the visual representation of enemy health
          if(enemyHealth==0){
            gameWon();
          }
        }
      }
      
      clearCanvas();
      drawSlider(); // Redraw the slider without the hit hitbox
      drawHitboxes(); // Redraw remaining hitboxes
    } else {
      console.log('No hit'); // Log miss to the console
    }
  }



  // Event listener for keydown events
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault(); // Prevent the default space key action (scrolling down)
      if(gameStarted){
        checkHit();
      }
      else{
        gameStarted = true;
        document.querySelector(".pregame").style.display = 'none';
        startSet()
      }
      
    }
  });

  // Add an event listener for touchstart events
  document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if(gameStarted){
      checkHit();
    }
    else{
      gameStarted = true;
      document.querySelector(".pregame").style.display = 'none';
      startSet()
    }
  }, {passive: false});

  document.addEventListener('contextmenu', function(e) {
  e.preventDefault(); // Prevent showing the context menu
  }, false);

  

  function startNextSet() {
    if (currentSet < 3) {
        currentSet++;
        console.log(currentSet)
        currentRound=0;
        updateVisuals();
        startSet(); // Resets hitboxes for the new set
    } else {
        gameWon();
        isAnimating = false;  
    }
  }
  function hitboxesDestroyed() {
    // Example check, replace with your actual logic
    return hitboxes.length === 0;
  }
  function startSet() {
    resetHitboxes();
    sliderX = 0; // Reset slider position to the left
    currentRound = 0; // Reset the round counter at the start of a set
    movingLeft = false; // Start moving right
    isAnimating = true; // Start the animation
    startRound(); // Start the first round
  }
  function resetHitboxes() {
    // Reset or recreate hitboxes for the new set
    createHitboxes();
    drawHitboxes();
  }

  function startRound() {
    isAnimating = true; // Ensure the animation loop continues
    animateSlider();
  }

  function playerHitAnimation(){
    console.log('playerHit')
  }

  function enemyHitAnimation(){
    console.log('enemyHit')
  }

  function gameWon(){
    enemyHealth = 0;
    updateVisuals();
    isAnimating =false;
    console.log("Game Won");
    showResults();
  }

  function gameOver() {
    isAnimating =false;
    console.log("Game Over");
    showResults();
    // Implement additional game over logic here
    // showing a game over screen, game sound, etc.
  }
  let resultOne = "";
  let resultTwo = "";
  let resultThree = "";
  let resultFour= "";
  let result = "Oniboto\nBattle #001\n";
  function showResults(){
    let resultOneDisplay = document.querySelector('.resultOne');
    let resultTwoDisplay = document.querySelector('.resultTwo');
    let resultThreeDisplay = document.querySelector('.resultThree');
    let resultFourDisplay = document.querySelector('.resultFour');
    for(let i=1; i<=4; i++){
      switch (i){
        case 1:
          resultOne+="🟦".repeat(playerShieldOne)
          resultOne+="⬛️".repeat(3-playerShieldOne)
          break;
        case 2:
          resultTwo+="🟩".repeat(playerShieldTwo)
          resultTwo+="⬛️".repeat(3-playerShieldTwo)
          break;
        case 3:
          resultThree+="🟨".repeat(playerShieldThree)
          resultThree+="⬛️".repeat(3-playerShieldThree)
          break;
        case 4:
          resultFour+="❤️".repeat(playerHealth)
          resultFour+="🖤".repeat(3-playerHealth)
          break;
      }
    }
    resultOneDisplay.innerHTML = resultOne;
    resultTwoDisplay.innerHTML = resultTwo;
    resultThreeDisplay.innerHTML = resultThree;
    resultFourDisplay.innerHTML = resultFour;
    result += resultOne + "\n" + resultTwo + "\n" + resultThree + "\n" + resultFour + "\n";
    document.querySelector('.postgame').style.display = 'flex';

  }

  function shareWithFriends() {
    if (navigator.share) {
      navigator.share({
        title: 'Oniboto',
        text: result // Example: Sharing the current URL
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that do not support the Share API
      alert('Share API not supported in this browser.');
    }
  }

  
});