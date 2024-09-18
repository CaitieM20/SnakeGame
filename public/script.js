const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasSize = 400; // Set a fixed size for the square canvas
const scale = 20; // Increased scale for better visibility
const rows = canvasSize / scale;
const columns = canvasSize / scale;

canvas.width = canvasSize;
canvas.height = canvasSize;

// Get computed styles
const computedStyle = getComputedStyle(document.getElementById('gameArea'));

// Add a border to the canvas
canvas.style.border = '2px solid black';

let snake;
let fruit;
let score = 0;

const scoreDisplay = document.getElementById('scoreDisplay');

(function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();

        if (snake.eat(fruit)) {
            fruit.pickLocation();
        }

        snake.checkCollision();
        document.querySelector('.score').innerText = snake.total;
    }, 250);
}());

window.addEventListener('keydown', ((evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
}));

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = computedStyle.getPropertyValue('--snake-color').trim();

        for (let i=0; i<this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i=0; i<this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i+1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvasSize) {
            this.x = 0;
        }

        if (this.y >= canvasSize) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvasSize - scale;
        }

        if (this.y < 0) {
            this.y = canvasSize - scale;
        }
    };

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            return true;
        }

        return false;
    };

    this.checkCollision = function() {
        for (let i=0; i<this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0;
                this.tail = [];
            }
        }
    };
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * columns)) * scale;
        this.y = (Math.floor(Math.random() * rows)) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = computedStyle.getPropertyValue('--fruit-color').trim();
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}
