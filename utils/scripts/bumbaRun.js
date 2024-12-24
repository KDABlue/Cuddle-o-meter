// utils/scripts/bumbaRun.js

export function initBumbaRun() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
  
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const scoreElement = document.getElementById('score');
    const recordElement = document.getElementById('record');
    const highScoresList = document.getElementById('high-scores');
    const newRecordNotification = document.getElementById('new-record-notification');
  
    // Load Images (Optional)
    const characterImg = new Image();
    characterImg.src = 'images/character.png'; // Ensure this path is correct
  
    const obstacleImg = new Image();
    obstacleImg.src = 'images/obstacle.png'; // Ensure this path is correct
  
    // Game Variables
    const lanes = 3;
    let laneWidth = canvas.width / lanes;
    let playerLane = 1; // 0, 1, 2
    let isRunning = true;
    let isPaused = false;
    let animationId;
    let obstacleIntervalId;
    let score = 0;
    let record = 0;
  
    // Load Record from localStorage
    function loadRecord() {
      const savedRecord = localStorage.getItem('bumbaRunRecord');
      if (savedRecord) {
        record = parseInt(savedRecord, 10);
        recordElement.textContent = record;
      }
    }
  
    // Update Record in localStorage
    function updateRecord() {
      if (score > record) {
        record = score;
        localStorage.setItem('bumbaRunRecord', record);
        recordElement.textContent = record;
        showNewRecordNotification();
      }
    }
  
    // Show New Record Notification
    function showNewRecordNotification() {
      newRecordNotification.style.display = 'block';
      // Hide after 3 seconds
      setTimeout(() => {
        newRecordNotification.style.display = 'none';
      }, 3000);
    }
  
    // Character
    const character = {
      width: 50,
      height: 50,
      x: 0,
      y: canvas.height - 60,
      color: '#FFD700',
      draw: function() {
        if (characterImg.complete) {
          ctx.drawImage(characterImg, this.x, this.y, this.width, this.height);
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      },
      updatePosition: function() {
        this.x = playerLane * laneWidth + (laneWidth - this.width) / 2;
      }
    };
  
    // Obstacles
    const obstacles = [];
    const obstacleFrequency = 2000; // milliseconds
    let obstacleSpeed = 2;
    const obstacleMinScale = 0.5;
    const obstacleMaxScale = 1.5;
  
    function createObstacle() {
      const lane = Math.floor(Math.random() * lanes);
      const obstacle = {
        lane: lane, // Store lane number
        baseWidth: 50,
        baseHeight: 50,
        x: lane * laneWidth + (laneWidth - 50) / 2,
        y: -100, // Start further away
        color: '#FF4500',
        speed: obstacleSpeed,
        scale: obstacleMinScale,
        draw: function() {
          const scaledWidth = this.baseWidth * this.scale;
          const scaledHeight = this.baseHeight * this.scale;
          const scaledX = lane * laneWidth + (laneWidth - scaledWidth) / 2;
  
          if (obstacleImg.complete) {
            ctx.drawImage(obstacleImg, scaledX, this.y, scaledWidth, scaledHeight);
          } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(scaledX, this.y, scaledWidth, scaledHeight);
          }
        },
        update: function() {
          this.y += this.speed;
          // Increase scale as obstacle approaches
          if (this.scale < obstacleMaxScale) {
            this.scale += 0.005; // Adjust for smooth scaling
          }
        }
      };
      obstacles.push(obstacle);
    }
  
    // Handle Lane Switching
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        if (playerLane > 0) {
          playerLane--;
          character.updatePosition();
        }
      } else if (e.key === 'ArrowRight') {
        if (playerLane < lanes - 1) {
          playerLane++;
          character.updatePosition();
        }
      }
    }
  
    // Touch Controls for Mobile Playability
    let touchStartX = 0;
    let touchEndX = 0;
  
    function handleGesture() {
      if (touchEndX < touchStartX - 50) {
        // Swipe Left
        if (playerLane > 0) {
          playerLane--;
          character.updatePosition();
        }
      }
  
      if (touchEndX > touchStartX + 50) {
        // Swipe Right
        if (playerLane < lanes - 1) {
          playerLane++;
          character.updatePosition();
        }
      }
    }
  
    canvas.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
  
    canvas.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, false);
  
    // Collision Detection
    function checkCollisions() {
      for (let obs of obstacles) {
        if (
          character.x < obs.x + obs.baseWidth * obs.scale &&
          character.x + character.width > obs.x &&
          character.y < obs.y + obs.baseHeight * obs.scale &&
          character.y + character.height > obs.y
        ) {
          endGame();
        }
      }
    }
  
    // Scoring
    function updateScore() {
      score += 1;
      scoreElement.textContent = score;
    }
  
    // Leaderboard
    function loadHighScores() {
      const highScores = JSON.parse(localStorage.getItem('bumbaRunHighScores')) || [];
      highScoresList.innerHTML = '';
      highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${score}`;
        highScoresList.appendChild(li);
      });
    }
  
    function saveHighScore(newScore) {
      let highScores = JSON.parse(localStorage.getItem('bumbaRunHighScores')) || [];
      highScores.push(newScore);
      highScores.sort((a, b) => b - a);
      highScores = highScores.slice(0, 5); // Keep top 5 scores
      localStorage.setItem('bumbaRunHighScores', JSON.stringify(highScores));
      loadHighScores();
    }
  
    // Game Loop
    function gameLoop() {
      if (!isRunning) return;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw Road
      ctx.fillStyle = '#555';
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
  
      // Draw Lane Dividers
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      for (let i = 1; i < lanes; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, canvas.height / 2);
        ctx.lineTo(i * laneWidth, canvas.height);
        ctx.stroke();
      }
  
      // Update and Draw Obstacles
      for (let obs of obstacles) {
        obs.update();
        obs.draw();
      }
  
      // Remove Off-Screen Obstacles and Update Score
      for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].y > canvas.height) {
          obstacles.splice(i, 1);
          updateScore(); // Increase score when an obstacle is avoided
          adjustDifficulty(); // Adjust difficulty based on score
        }
      }
  
      // Draw Character
      character.draw();
  
      // Check for Collisions
      checkCollisions();
  
      // Continue the loop
      animationId = requestAnimationFrame(gameLoop);
    }
  
    // Adjust Difficulty Based on Score
    function adjustDifficulty() {
      if (score === 10) {
        obstacleSpeed = 2.5;
        clearInterval(obstacleIntervalId);
        obstacleIntervalId = setInterval(createObstacle, 1800);
      } else if (score === 20) {
        obstacleSpeed = 3;
        clearInterval(obstacleIntervalId);
        obstacleIntervalId = setInterval(createObstacle, 1500);
      }
      // Add more thresholds as needed
    }
  
    // Start Game
    function startGame() {
      character.updatePosition();
      loadRecord();
      loadHighScores();
      gameLoop();
      obstacleIntervalId = setInterval(createObstacle, obstacleFrequency);
    }
  
    // Pause Game
    function pauseGame() {
      if (isPaused) {
        isPaused = false;
        gameLoop();
        obstacleIntervalId = setInterval(createObstacle, obstacleFrequency);
        pauseBtn.textContent = 'Pause';
      } else {
        isPaused = true;
        cancelAnimationFrame(animationId);
        clearInterval(obstacleIntervalId);
        pauseBtn.textContent = 'Resume';
      }
    }
  
    // Stop Game
    function stopGame() {
      isRunning = false;
      isPaused = false;
      cancelAnimationFrame(animationId);
      clearInterval(obstacleIntervalId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      alert(`Game Stopped! Your Score: ${score}`);
      updateRecord(); // Check and update record
      saveHighScore(score); // Save the score
      resetGame();
    }
  
    // End Game on Collision
    function endGame() {
      isRunning = false;
      isPaused = false;
      cancelAnimationFrame(animationId);
      clearInterval(obstacleIntervalId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      alert(`Game Over! Your Score: ${score}`);
      updateRecord(); // Check and update record
      saveHighScore(score); // Save the score
      resetGame();
    }
  
    // Reset Game
    function resetGame() {
      score = 0;
      scoreElement.textContent = score;
      obstacles.length = 0;
      playerLane = 1;
      character.updatePosition();
      isRunning = true;
      isPaused = false;
      newRecordNotification.style.display = 'none';
    }
  
    // Event Listeners
    document.addEventListener('keydown', handleKeyDown);
    pauseBtn.addEventListener('click', pauseGame);
    stopBtn.addEventListener('click', stopGame);
  
    // Responsive Canvas
    function resizeCanvas() {
      const containerWidth = document.getElementById('game-container').clientWidth;
      canvas.width = containerWidth;
      canvas.height = containerWidth * 0.5; // Maintain aspect ratio
      laneWidth = canvas.width / lanes; // Reassign laneWidth
  
      character.updatePosition();
      // Adjust obstacles positions
      for (let obs of obstacles) {
        obs.x = obs.lane * laneWidth + (laneWidth - obs.baseWidth) / 2;
      }
    }
  
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  
    // Initialize Game
    startGame();
  }
  