// utils/scripts/potatoRun.js

export function initPotatoRun() {
    const mainMenu = document.getElementById('main-menu');
    const startButton = document.getElementById('start-button');
    const recordButton = document.getElementById('record-button');
    const recordDisplay = document.getElementById('record-display');
    const recordScore = document.getElementById('record-score');
    const backButton = document.getElementById('back-button');
    const gameContainer = document.getElementById('game-container');
    const pauseButton = document.getElementById('pause-button');
    const canvas = document.getElementById('potato-game-canvas');
    const ctx = canvas.getContext('2d');

    // Game state variables
    let running = false;
    let paused = false;
    let playerY = 0;
    let playerX = 50;
    let playerWidth = 50;
    let playerHeight = 50;
    let playerVelY = 0;
    let gravity = 0.5;
    let isOnGround = true;

    let obstacles = [];
    let obstacleSpeed = 6;
    let spawnTimer = 0;
    let spawnInterval = 120; // frames between obstacles

    let score = 0;
    let highScore = localStorage.getItem('potatoRunHighScore') || 0;

    // Responsive canvas
    function resizeCanvas() {
        const containerWidth = gameContainer.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.5; // Maintain aspect ratio
        playerY = canvas.height - playerHeight - 20; // Adjust ground level
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial sizing

    // Simple input handling
    function handleJump() {
        if (isOnGround && running && !paused) {
            playerVelY = -12;  // Jump velocity
            isOnGround = false;
        }
    }

    // Keyboard input
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scrolling
            handleJump();
        }
    });

    // Touch input for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleJump();
    });

    // Start Game
    startButton.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        recordDisplay.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startGame();
    });

    // Show Records
    recordButton.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        recordDisplay.classList.remove('hidden');
        recordScore.textContent = highScore > 0 ? `Il tuo record: ${highScore}` : 'Nessun record ancora.';
    });

    // Back to Menu
    backButton.addEventListener('click', () => {
        recordDisplay.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });

    // Pause/Resume Game
    pauseButton.addEventListener('click', () => {
        if (!running) return;
        paused = !paused;
        pauseButton.textContent = paused ? 'Riprendi' : 'Pausa';
        if (!paused) {
            requestAnimationFrame(update);
        }
    });

    // Start the game
    function startGame() {
        // Initialize game state
        running = true;
        paused = false;
        playerY = canvas.height - playerHeight - 20;
        playerVelY = 0;
        isOnGround = true;
        obstacles = [];
        spawnTimer = 0;
        score = 0;
        pauseButton.textContent = 'Pausa';

        requestAnimationFrame(update);
    }

    // Update game state
    function update() {
        if (!running || paused) return;

        // Update player position
        playerY += playerVelY;
        playerVelY += gravity;
        if (playerY >= canvas.height - playerHeight - 20) {
            playerY = canvas.height - playerHeight - 20;
            playerVelY = 0;
            isOnGround = true;
        }

        // Spawn obstacles
        spawnTimer++;
        if (spawnTimer > spawnInterval) {
            spawnTimer = 0;
            const obstacleHeight = 40;
            const obstacleWidth = 40;
            obstacles.push({
                x: canvas.width,
                y: canvas.height - obstacleHeight - 20,
                width: obstacleWidth,
                height: obstacleHeight
            });
        }

        // Move obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= obstacleSpeed;
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score += 1; // Increment score for passing an obstacle
                updateScore();
            }
        }

        // Check collision
        for (let obs of obstacles) {
            if (playerX < obs.x + obs.width &&
                playerX + playerWidth > obs.x &&
                playerY < obs.y + obs.height &&
                playerY + playerHeight > obs.y) {
                endGame();
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    // Draw game elements
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background (simple sky and ground)
        ctx.fillStyle = '#87CEFA'; // Sky blue
        ctx.fillRect(0, 0, canvas.width, canvas.height - 20);

        ctx.fillStyle = '#228B22'; // Forest green for ground
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        // Draw player (simple rectangle or image)
        ctx.fillStyle = '#FFD700'; // Gold color for potato
        ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

        // Draw obstacles (simple rectangles or images)
        ctx.fillStyle = '#8B4513'; // SaddleBrown color for rocks
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });

        // Draw score
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }

    // Update score display (could be enhanced)
    function updateScore() {
        // You can implement a dynamic score display if needed
    }

    // End the game
    function endGame() {
        running = false;
        alert(`Game Over! Il tuo punteggio: ${score}`);
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('potatoRunHighScore', highScore);
            alert('Nuovo record!');
        }
        // Reset to main menu after a short delay
        setTimeout(() => {
            gameContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        }, 1000);
    }

    // Initialize the game when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Ensure canvas is resized correctly
        resizeCanvas();
    });
}

// Initialize the Potato Run gam
