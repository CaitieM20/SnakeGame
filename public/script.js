const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasSize = 400;
const scale = 20;
const rows = canvasSize / scale;
const columns = canvasSize / scale;

canvas.width = canvasSize;
canvas.height = canvasSize;

const computedStyle = getComputedStyle(document.getElementById('gameArea'));

let snake;
let fruit;
let score = 0;
let gameOver = false;

const scoreDisplay = document.getElementById('scoreDisplay');

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = computedStyle.getPropertyValue('--snake-color').trim();
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        if (this.total >= 1) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Check for collision with canvas borders
        if (this.x < 0 || this.y < 0 || this.x >= canvasSize || this.y >= canvasSize) {
            gameOver = true;
        }
    }

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed !== scale) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale;
                }
                break;
            case 'Down':
                if (this.ySpeed !== -scale) {
                    this.xSpeed = 0;
                    this.ySpeed = scale;
                }
                break;
            case 'Left':
                if (this.xSpeed !== scale) {
                    this.xSpeed = -scale;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed !== -scale) {
                    this.xSpeed = scale;
                    this.ySpeed = 0;
                }
                break;
        }
    }

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            return true;
        }
        return false;
    }
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * columns)) * scale;
        this.y = (Math.floor(Math.random() * rows)) * scale;
    }

    this.draw = function() {
        ctx.fillStyle = computedStyle.getPropertyValue('--fruit-color').trim();
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

function drawGrid() {
    ctx.strokeStyle = computedStyle.getPropertyValue('--grid-color').trim();
    for (let i = 0; i < rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * scale);
        ctx.lineTo(canvasSize, i * scale);
        ctx.stroke();
    }
    for (let j = 0; j < columns; j++) {
        ctx.beginPath();
        ctx.moveTo(j * scale, 0);
        ctx.lineTo(j * scale, canvasSize);
        ctx.stroke();
    }
}

function displayGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = '16px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 80);
}

let gameLoopTimeout;

function resetGame() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();
    score = 0;
    gameOver = false;
    scoreDisplay.textContent = `Score: ${score}`;
    
    // Clear any existing game loop
    if (gameLoopTimeout) {
        clearTimeout(gameLoopTimeout);
    }
    
    // Start a new game loop
    gameLoop();
}

document.addEventListener('keydown', (event) => {
    if (!gameOver) {
        const direction = event.key.replace('Arrow', '');
        snake.changeDirection(direction);
    }

    if (event.code === 'Space' && gameOver) {
        resetGame();
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    fruit.draw();
    snake.update();
    snake.draw();

    if (snake.eat(fruit)) {
        fruit.pickLocation();
    }

    if (gameOver) {
        displayGameOver();
    } else {
        gameLoopTimeout = setTimeout(gameLoop, 100); // Adjust this value to change game speed
    }
}

resetGame(); // Initial game start
