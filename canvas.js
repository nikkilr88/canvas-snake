// Initial setup
const c = document.querySelector('canvas');
const ctx = c.getContext('2d');

c.width = 300; // 15 units
c.height = 600; // 30 units

let snake, food, img;

let head = new Image();
head.src = 'head.png';

let headUp = new Image();
headUp.src = 'headup.png';

let score = 0;
let unit = 20;

// Snake shizz
class Snake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.body = [];
        this.direction = '';
        this.color = '#45aaf2';
    }

    move(e) {
        switch (e.which) {
            case 37:
                snake.direction = 'l';
                break;
            case 38:
                snake.direction = 'u';
                break;
            case 39:
                snake.direction = 'r';
                break;
            case 40:
                snake.direction = 'd';
                break;
        }
    };
}

// Nom noms
class Food {
    constructor() {
        this.x = Math.floor(Math.random() * 15) * unit;
        this.y = Math.floor(Math.random() * 30) * unit;
        this.color = '#c0392b';
    }
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    // Display score
    ctx.fillStyle = '#fff';
    ctx.font = "20px sans-serif";
    ctx.fillText('Score: ' + score, 5, 20);

     // Display food
     ctx.fillStyle = food.color;
     ctx.fillRect(food.x, food.y, unit, unit)

    // Display snake
    for(let i = 0; i < snake.body.length; i++) {
        if(i === 0) {
            let img = (snake.direction == 'u' || snake.direction == 'd') ? headUp : head;
            ctx.drawImage(img, snake.body[i].x, snake.body[i].y)
            continue;
        }
        ctx.fillStyle = snake.color;
        ctx.fillRect(snake.body[i].x, snake.body[i].y, unit, unit);
    }

    if(!snake.direction) return;

    // Prev snake head pos
    let snakeX = snake.body[0].x;
    let snakeY = snake.body[0].y;

    // Check if snake ate food
    if (snake.body[0].x == food.x && snake.body[0].y == food.y) {
        score++;
        food = new Food();
    } else {
        snake.body.pop();
    }

    // Set new head pos
    switch(snake.direction) {
        case 'r':
            snakeX+=unit;
            break;
        case 'l':
            snakeX-= unit;
            break;
        case 'u':
            snakeY-=unit;
            break;
        case 'd':
            snakeY+=unit;
            break;
    }

    let newSnakeHead = {
        x: snakeX,
        y: snakeY
    }

    // Add new snake head
    snake.body.unshift(newSnakeHead); 

    //  Let snake wrap
    if (snake.body[0].x > c.width) snake.body[0].x = 0;
    if (snake.body[0].x < 0) snake.body[0].x = c.width;
    if (snake.body[0].y > c.height) snake.body[0].y = 0;
    if (snake.body[0].y < 0) snake.body[0].y = c.height;

    // Check if snake hits itself
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[0].y == snake.body[i].y && snake.body[0].x == snake.body[i].x) {
            clearInterval(game)
        }
    }
}

function init() {
    // Create food and snake
    food = new Food();
    snake = new Snake(5 * unit, 9 * unit);

    snake.body[0] = {
        x: 5 * unit,
        y: 9 * unit
    };
    snake.body[1] = {
                x: 4*unit,
                y: 9*unit
    };
    snake.body[2] = {
        x: 3 * unit,
        y: 9 * unit
    };
    
    // Listen for clicks
    document.addEventListener('keydown', snake.move);
}

init();
const game = setInterval(draw, 200);