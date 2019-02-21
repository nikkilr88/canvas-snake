// Initial setup
const c = document.querySelector('canvas')
const ctx = c.getContext('2d')

let unit = 20

c.width = 20 * unit
c.height = 20 * unit

let game, snake, food, img

let head = new Image()
head.src = './img/head.png'

let headUp = new Image()
headUp.src = './img/headup.png'

let gridRows = c.width / unit
let gridCol = c.height / unit

let score = 0
let isPaused = false

let gameState = 'start'

// Snake shizz
class Snake {
  constructor() {
    this.body = [
      {
        x: 5 * unit,
        y: 15 * unit
      },
      {
        x: 4 * unit,
        y: 15 * unit
      },
      {
        x: 3 * unit,
        y: 15 * unit
      }
    ]
    this.direction = 'r'
    this.color = '#45aaf2'
  }

  move = e => {
    switch (e.key) {
      case 'ArrowLeft':
        this.direction = this.direction === 'r' ? 'r' : 'l'
        break
      case 'ArrowUp':
        this.direction = this.direction === 'd' ? 'd' : 'u'
        break
      case 'ArrowRight':
        this.direction = this.direction === 'l' ? 'l' : 'r'
        break
      case 'ArrowDown':
        this.direction = this.direction === 'u' ? 'u' : 'd'
        break
    }
  }

  render = () => {
    for (let i = 0; i < this.body.length; i++) {
      if (i === 0) {
        let img = this.direction == 'u' || this.direction == 'd' ? headUp : head
        ctx.drawImage(img, this.body[i].x, this.body[i].y)
      } else {
        ctx.fillStyle = this.color
        ctx.fillRect(this.body[i].x, this.body[i].y, unit, unit)
      }
    }
  }
}

// Nom noms
class Food {
  constructor() {
    this.x = Math.floor(Math.random() * gridRows) * unit
    this.y = Math.floor(Math.random() * gridCol) * unit
    this.color = '#c0392b'
  }

  render = () => {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, unit, unit)
  }
}

function draw() {
  ctx.clearRect(0, 0, c.width, c.height)

  // Display score
  printText(`Score: ${score}`, '#888', 'left', 5, 20)

  // Display food
  food.render()

  // Display snake
  snake.render()

  if (gameState === 'play') {
    // Prev snake head pos
    let snakeX = snake.body[0].x
    let snakeY = snake.body[0].y

    // Check if snake ate food
    if (snake.body[0].x == food.x && snake.body[0].y == food.y) {
      score++
      food = new Food()
    } else {
      snake.body.pop()
    }

    // Set new head pos
    switch (snake.direction) {
      case 'r':
        snakeX += unit
        break
      case 'l':
        snakeX -= unit
        break
      case 'u':
        snakeY -= unit
        break
      case 'd':
        snakeY += unit
        break
    }

    let newSnakeHead = {
      x: snakeX,
      y: snakeY
    }

    // Add new snake head
    snake.body.unshift(newSnakeHead)
    // Check if snake hits itself
    for (let i = 1; i < snake.body.length; i++) {
      if (
        newSnakeHead.y == snake.body[i].y &&
        newSnakeHead.x == snake.body[i].x
      ) {
        clearInterval(game)
        gameState = 'gameOver'
      }
    }

    //  Let snake wrap
    if (snake.body[0].x + unit > c.width) snake.body[0].x = 0
    if (snake.body[0].x < 0) snake.body[0].x = c.width - unit
    if (snake.body[0].y + unit > c.height) snake.body[0].y = 0
    if (snake.body[0].y < 0) snake.body[0].y = c.height - unit
  }

  displayMessages(gameState)
}

function init() {
  // Create food and snake
  food = new Food()
  snake = new Snake()

  // Listen for key press
  document.addEventListener('keydown', e => {
    e.preventDefault()
    if (e.key === ' ') {
      gameState =
        gameState === 'pause' || gameState === 'start' ? 'play' : 'pause'
    } else {
      snake.move(e)
    }
  })
}

init()
game = setInterval(draw, 200)

const printText = (text, color, align, x, y) => {
  ctx.fillStyle = color
  ctx.font = '18px Silkscreen'
  ctx.textAlign = align
  ctx.fillText(text, x, y)
}

const displayMessages = gameState => {
  switch (gameState) {
    case 'gameOver':
      printText('Game Over!', '#fff', 'center', c.width / 2, c.height / 2)
      break

    case 'start':
      printText(
        'Press spacebar to play!',
        '#fff',
        'center',
        c.width / 2,
        c.height / 2
      )
      break

    case 'pause':
      printText('Paused', '#fff', 'center', c.width / 2, c.height / 2)
      break
  }
}
