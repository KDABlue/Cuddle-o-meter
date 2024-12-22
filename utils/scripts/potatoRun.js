// utils/scripts/potatoRun.js

export function initPotatoRun() {
    // Grab references to the needed DOM elements
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
    
    // Lanes: 0 (left), 1 (center), 2 (right)
    let lane = 1;
    const totalLanes = 3;

    // Player
    let playerWidth = 50;
    let playerHeight = 50;
    let groundOffset = 20;
    let playerBaseY = 0;
    let playerX = 0;
    let playerY = 0;
    let playerVelY = 0;
    let gravity = 0.6;
    let jumpPower = -15;
    let isOnGround = true;
    let isCrouching = false;
    let crouchTimer = 0;
    const crouchDuration = 20; // frames

    // Obstacles
    let obstacles = [];
    let obstacleSpeed = 6;
    let spawnTimer = 0;
    let spawnInterval = 90;
    let obstacleWidth = 40;
    let obstacleHeight = 40;

    // Score
    let score = 0;
    let highScore = localStorage.getItem('potatoRunHighScore') || 0;

    // Responsive canvas
    function resizeCanvas() {
        const containerWidth = gameContainer.clientWidth;
        // If the container is hidden or has 0 width, we might get 0
        // so we can guard for a minimum, or call it again after un-hiding:
        if (containerWidth < 50) {
            // fallback if container is too small
            canvas.width = 800;
            canvas.height = 400;
        } else {
            canvas.width = containerWidth;
            canvas.height = containerWidth * 0.5; 
        }

        // Recalculate player base position
        playerBaseY = canvas.height - playerHeight - groundOffset;
        if (isOnGround) {
            playerY = playerBaseY;
        }
        updatePlayerX();
    }

    function updatePlayerX() {
        const laneWidth = canvas.width / totalLanes;
        // Center the player horizontally in the selected lane
        playerX = laneWidth * lane + (laneWidth / 2) - (playerWidth / 2);
    }

    // Listen to window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // initial

    /***** KEYBOARD INPUT *****/
    document.addEventListener('keydown', (e) => {
        if (!running || paused) return;
        switch (e.code) {
            case 'ArrowLeft':
                moveLane(-1);
                break;
            case 'ArrowRight':
                moveLane(1);
                break;
            case 'ArrowUp':
            case 'Space':
                handleJump();
                break;
            case 'ArrowDown':
                handleCrouch();
                break;
            default:
                break;
        }
    });

    function moveLane(direction) {
        lane += direction;
        if (lane < 0) lane = 0;
        if (lane > totalLanes - 1) lane = totalLanes - 1;
        updatePlayerX();
    }

    function handleJump() {
        if (isOnGround) {
            playerVelY = jumpPower;
            isOnGround = false;
        }
    }

    function handleCrouch() {
        if (isOnGround && !isCrouching) {
            isCrouching = true;
            crouchTimer = crouchDuration;
            playerHeight = 30;
            playerY = playerBaseY + 20; // visually shift down
        }
    }

    /***** TOUCH / SWIPE INPUT *****/
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 30;

    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });

    // Prevent scrolling on mobile
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        if (!running || paused) return;
        const touch = e.changedTouches[0];
        const distX = touch.clientX - touchStartX;
        const distY = touch.clientY - touchStartY;

        if (Math.abs(distX) > Math.abs(distY)) {
            // Horizontal swipe
            if (distX > swipeThreshold) {
                // right
                moveLane(1);
            } else if (distX < -swipeThreshold) {
                // left
                moveLane(-1);
            }
        } else {
            // Vertical swipe
            if (distY < -swipeThreshold) {
                // up => jump
                handleJump();
            } else if (distY > swipeThreshold) {
                // down => crouch
                handleCrouch();
            }
        }
    });

    /***** BUTTONS *****/
    startButton.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        recordDisplay.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        // Force a resize after un-hiding to ensure correct canvas dimensions
        resizeCanvas();

        startGame();
    });

    recordButton.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        recordDisplay.classList.remove('hidden');
        recordScore.textContent = highScore > 0 ? `Il tuo record: ${highScore}` : 'Nessun record ancora.';
    });

    backButton.addEventListener('click', () => {
        recordDisplay.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });

    pauseButton.addEventListener('click', () => {
        if (!running) return;
        paused = !paused;
        pauseButton.textContent = paused ? 'Riprendi' : 'Pausa';
        if (!paused) {
            requestAnimationFrame(update);
        }
    });

    /***** START GAME *****/
    function startGame() {
        running = true;
        paused = false;
        lane = 1;
        updatePlayerX();
        playerY = playerBaseY;
        playerVelY = 0;
        isOnGround = true;
        isCrouching = false;
        crouchTimer = 0;
        playerHeight = 50;
        
        obstacles = [];
        spawnTimer = 0;
        score = 0;
        pauseButton.textContent = 'Pausa';

        requestAnimationFrame(update);
    }

    /***** GAME LOOP *****/
    function update() {
        if (!running || paused) return;

        // Player physics
        playerY += playerVelY;
        playerVelY += gravity;

        // Crouch logic
        if (isCrouching) {
            crouchTimer--;
            if (crouchTimer <= 0) {
                isCrouching = false;
                playerHeight = 50;
                playerY = playerBaseY;
            }
        }

        // Ground collision
        if (playerY >= playerBaseY) {
            playerY = playerBaseY;
            playerVelY = 0;
            isOnGround = true;
        }

        // Spawn obstacles
        spawnTimer++;
        if (spawnTimer > spawnInterval) {
            spawnTimer = 0;
            spawnObstacle();
        }

        // Move obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= obstacleSpeed;
            // Off-screen => remove + increment score
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
            }
        }

        // Check collisions
        for (let obs of obstacles) {
            if (
                playerX < obs.x + obs.width &&
                playerX + playerWidth > obs.x &&
                playerY < obs.y + obs.height &&
                playerY + playerHeight > obs.y
            ) {
                endGame();
                return; 
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    function spawnObstacle() {
        const obsX = canvas.width;
        const obsY = canvas.height - obstacleHeight - groundOffset;
        obstacles.push({
            x: obsX,
            y: obsY,
            width: obstacleWidth,
            height: obstacleHeight
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#87CEFA'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height - groundOffset);

        // Ground
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - groundOffset, canvas.width, groundOffset);

        // Player (replace this fillRect with a potato sprite if desired)
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

        // Obstacles
        ctx.fillStyle = '#8B4513';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });

        // Score
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function endGame() {
        running = false;
        alert(`Game Over! Il tuo punteggio: ${score}`);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('potatoRunHighScore', highScore);
            alert('Nuovo record!');
        }

        setTimeout(() => {
            gameContainer.classList.add('hidden');
            mainMenu.classList.remove('hidden');
        }, 1000);
    }
}
