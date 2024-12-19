// utils/scripts/potatoRun.js

export function initPotatoRun() {
    const canvas = document.getElementById('potato-game-canvas');
    const ctx = canvas.getContext('2d');

    // Game state variables
    let running = true;
    let playerY = canvas.height - 100;   // Player's vertical position
    let playerX = 50;                    // Player's horizontal position
    let playerVelY = 0;                  // Vertical velocity for jumps
    let gravity = 0.5;                   // Gravity for jumping mechanics
    let isOnGround = true;

    let obstacles = [];
    let obstacleSpeed = 6;
    let spawnTimer = 0;
    let spawnInterval = 120; // frames between obstacles

    // Load images (textures)
    const potatoImg = new Image();
    potatoImg.src = 'images/potato_runner.png'; // Place your potato texture in images/

    const obstacleImg = new Image();
    obstacleImg.src = 'images/rock_obstacle.png'; // Place your obstacle image in images/

    const backgroundImg = new Image();
    backgroundImg.src = 'images/background.png'; // Place a background image (optional)

    // Simple input handling
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && isOnGround) {
            playerVelY = -10;  // Jump velocity
            isOnGround = false;
        }
    });

    function update() {
        if (!running) return;

        // Update player position
        playerY += playerVelY;
        playerVelY += gravity;
        if (playerY > canvas.height - 100) {
            playerY = canvas.height - 100;
            playerVelY = 0;
            isOnGround = true;
        }

        // Spawn obstacles
        spawnTimer++;
        if (spawnTimer > spawnInterval) {
            spawnTimer = 0;
            obstacles.push({
                x: canvas.width,
                y: canvas.height - 60,
                width: 40,
                height: 40
            });
        }

        // Move obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= obstacleSpeed;
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }

        // Check collision
        for (let obs of obstacles) {
            if (playerX < obs.x + obs.width &&
                playerX + 50 > obs.x && // player width ~50 (you can adjust)
                playerY < obs.y + obs.height &&
                playerY + 50 > obs.y) { // player height ~50 (you can adjust)
                running = false;
                alert('Game Over! Refresh the page or revisit the tab to try again.');
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        // Draw background
        if (backgroundImg.complete) {
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        } else {
            // fallback to solid color if background not loaded
            ctx.fillStyle = '#87CEFA'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (potatoImg.complete) {
            ctx.drawImage(potatoImg, playerX, playerY, 50, 50);
        } else {
            ctx.fillStyle = 'brown';
            ctx.fillRect(playerX, playerY, 50, 50);
        }

        for (let obs of obstacles) {
            if (obstacleImg.complete) {
                ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
            } else {
                ctx.fillStyle = 'gray';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            }
        }
    }

    update();
}
