// js/background.js

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let lines = [];
const colors = ['#ff4e50', '#f9d423', '#6a11cb', '#2575fc', '#27ae60', '#e74c3c'];

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const numLines = isMobile ? 10 : 20; // Fewer lines on mobile for performance

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Line class
class Line {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.length = 100 + Math.random() * 200;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = 0.5 + Math.random() * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Reset if out of bounds
        if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(this.angle) * this.length, this.y + Math.sin(this.angle) * this.length);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Initialize lines
for (let i = 0; i < numLines; i++) {
    lines.push(new Line());
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    lines.forEach(line => {
        line.update();
        line.draw();
    });

    requestAnimationFrame(animate);
}

if (!isMobile) {
    animate();
} else {
    // Optionally set a static background or simplify the animation for mobile
    ctx.fillStyle = '#eef2f7';
    ctx.fillRect(0, 0, width, height);
}
