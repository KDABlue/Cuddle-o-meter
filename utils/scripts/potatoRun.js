/* potatoRun.js */

export function initPotatoRun() {
    // DOM elements
    const startBtn = document.getElementById('potato-run-start-btn');
    const recordSpan = document.getElementById('potato-run-record');
    const gameContainer = document.getElementById('potato-run-game-container');
    const bridge = document.getElementById('bridge');
    const player = document.getElementById('player');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const finalScoreMessage = document.getElementById('final-score-message');
    const restartBtn = document.getElementById('restart-btn');
  
    // Lanes in pseudo-3D: we’ll shift the X position (via transform: translateX).
    // Adjust these based on your plane width and how wide you want lanes spaced:
    const laneTranslations = [
      'translateX(-50px)', // left lane
      'translateX(0)',     // center lane
      'translateX(50px)'   // right lane
    ];
    let currentLane = 1; // Start in center
  
    // For jump
    let isJumping = false;
    let verticalSpeed = 0;
    const gravity = 0.8;
    const jumpPower = 12;
  
    // Score
    let score = 0;
    let record = 0;
  
    // Intervals
    let gameInterval;
    let obstacleInterval;
  
    // Load record from localStorage if available
    if (localStorage.getItem('potatoRunRecord')) {
      record = parseInt(localStorage.getItem('potatoRunRecord'), 10);
      recordSpan.textContent = record;
    }
  
    // Initialize player lane
    updatePlayerLane();
  
    /* ------------
       START GAME
       ------------ */
    function startGame() {
      // Reset state
      currentLane = 1;
      isJumping = false;
      verticalSpeed = 0;
      score = 0;
  
      // Reset Player position on the slope
      player.style.bottom = '1300px';
      updatePlayerLane();
  
      // Remove existing obstacles
      document.querySelectorAll('.obstacle').forEach(o => o.remove());
  
      // Hide game-over
      gameOverOverlay.style.display = 'none';
  
      // Start main loop & spawn intervals
      gameInterval = setInterval(gameLoop, 50);       // ~20 frames per second
      obstacleInterval = setInterval(spawnObstacle, 1500); // spawn every 1.5s
    }
  
    /* -------------
       END GAME
       ------------- */
    function endGame() {
      clearInterval(gameInterval);
      clearInterval(obstacleInterval);
  
      // Show overlay
      gameOverOverlay.style.display = 'flex';
      finalScoreMessage.textContent = `Your Score: ${score}`;
  
      // Update record
      if (score > record) {
        record = score;
        recordSpan.textContent = record;
        localStorage.setItem('potatoRunRecord', record);
      }
    }
  
    /* ----------------
       MAIN GAME LOOP
       ---------------- */
    function gameLoop() {
      // Move obstacles
      moveObstacles();
  
      // Jump logic
      handleJump();
  
      // Increase score
      score++;
    }
  
    /* -----------------------
       SPAWN AN OBSTACLE
       ----------------------- */
    function spawnObstacle() {
      const obstacle = document.createElement('div');
      obstacle.classList.add('obstacle');
  
      // Random lane for obstacle
      const laneIndex = Math.floor(Math.random() * 3);
  
      // Use the same transform approach to place it in that lane
      obstacle.style.transform = `${laneTranslations[laneIndex]} translateZ(0)`;
  
      // Start from top of the slope
      obstacle.style.bottom = '1500px';
  
      bridge.appendChild(obstacle);
    }
  
    /* ------------------------
       MOVE OBSTACLES & CHECK
       ------------------------ */
    function moveObstacles() {
      const obsList = document.querySelectorAll('.obstacle');
      obsList.forEach(obs => {
        // Move downward by some speed
        let bottomVal = parseInt(obs.style.bottom, 10);
        bottomVal -= 25; // obstacle speed
        obs.style.bottom = bottomVal + 'px';
  
        // Remove if below visible area
        if (bottomVal < 200) {
          obs.remove();
        } else {
          // Collision check
          if (isColliding(player, obs)) {
            endGame();
          }
        }
      });
    }
  
    /* --------------------------------
       LANE UPDATES (LEFT, RIGHT)
       -------------------------------- */
    function moveLeft() {
      if (currentLane > 0) {
        currentLane--;
        updatePlayerLane();
      }
    }
  
    function moveRight() {
      if (currentLane < 2) {
        currentLane++;
        updatePlayerLane();
      }
    }
  
    function updatePlayerLane() {
      // We keep the “rotateX(…deg)” from CSS on #bridge, 
      // so we just do a simple translateX for lane switching
      const laneTransform = laneTranslations[currentLane];
      // Also maintain any vertical offset from jumping: we do that separately
      // So we might do something like:
      player.style.transform = `${laneTransform}`;
    }
  
    /* --------------------------------
       JUMPING
       -------------------------------- */
    function jump() {
      if (!isJumping) {
        isJumping = true;
        verticalSpeed = jumpPower;
      }
    }
  
    function handleJump() {
      if (!isJumping) return;
  
      let currBottom = parseInt(player.style.bottom, 10);
      currBottom += verticalSpeed;
      verticalSpeed -= gravity;
  
      // Basic floor check. Our “floor” is at bottom=1300.
      if (currBottom <= 1300) {
        // landed
        currBottom = 1300;
        isJumping = false;
        verticalSpeed = 0;
      }
      player.style.bottom = currBottom + 'px';
    }
  
    /* -----------------------
       COLLISION CHECK (2D)
       ----------------------- */
    function isColliding(elem1, elem2) {
      // bounding-box approach
      const r1 = elem1.getBoundingClientRect();
      const r2 = elem2.getBoundingClientRect();
  
      return !(
        r1.top > r2.bottom ||
        r1.bottom < r2.top ||
        r1.left > r2.right ||
        r1.right < r2.left
      );
    }
  
    /* ------------------------
       CONTROLS: KEY & TOUCH
       ------------------------ */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        jump();
      }
    });
  
    // Basic touch logic for left, right, up
    let touchStartX = null;
    let touchStartY = null;
  
    gameContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });
  
    gameContainer.addEventListener('touchmove', (e) => {
      if (!touchStartX || !touchStartY) return;
  
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      const threshold = 30;
  
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Left/Right
        if (deltaX > threshold) {
          moveRight();
          resetTouch();
        } else if (deltaX < -threshold) {
          moveLeft();
          resetTouch();
        }
      } else {
        // Up (jump)
        if (deltaY < -threshold) {
          jump();
          resetTouch();
        }
      }
    });
  
    function resetTouch() {
      touchStartX = null;
      touchStartY = null;
    }
  
    /* ------------
       BUTTONS
       ------------ */
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
  }
  