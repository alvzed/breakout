//Setting up the canvas 
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const lives = 3;

// ------ Paddle -------- //
const paddleWidth = 120;
const paddleHeight = 15;
const paddleMarginBottom = 30;

const paddle = {
    xPosition: canvas.width/2 - paddleWidth/2,
    yPosition: canvas.height - paddleHeight - paddleMarginBottom,
    width: paddleWidth,
    height: paddleHeight,
    dx: 10
}

function paddleDraw() {
    ctx.fillStyle = "black";
    ctx.fillRect(paddle.xPosition, paddle.yPosition, paddle.width, paddle.height);
}

// paddle movement //
let leftArrow = false;
let rightArrow = false;

document.addEventListener("keydown", function(event) {
    if(event.keyCode == 37){
        leftArrow = true;
    } else if(event.keyCode == 39){
        rightArrow = true; 
    }
});

document.addEventListener("keyup", function(event) {
    if(event.keyCode == 37){
        leftArrow = false;
    } else if(event.keyCode == 39){
        rightArrow = false; 
    }
});

function paddleMove(){
    if(rightArrow && paddle.xPosition + paddle.width < canvas.width) {
        paddle.xPosition += paddle.dx;
    } else if(leftArrow && paddle.xPosition > 0){
        paddle.xPosition -= paddle.dx;
    }
}

// ------------------------- The ball ------------------------- //
const ballRadius = 10;

const ball = {
    xPosition: canvas.width/2,
    yPosition: paddle.yPosition - ballRadius,
    radius: ballRadius,
    speed: 6,
    dx: 5,
    dy: -5
}

function ballDraw() {
    ctx.beginPath();

    ctx.arc(ball.xPosition, ball.yPosition, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.closePath();
}

function ballMove() {
    ball.xPosition += ball.dx;
    ball.yPosition += ball.dy;
}

// ---------------- Bricks -------------------- //
const brick = {
    row: 3,
    column: 7,
    width: 55,
    height: 15,
    offsetLeft: 20,
    offsetTop: 20,
    marginTop: 40,
    fillColor: "black"
}

let bricks = [];

function bricksCreate() {
    for(let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++) {
            bricks[c][r] = {
                x: c * (brick.width + brick.offsetLeft) + brick.offsetLeft,
                y: r * (brick.height + brick.offsetTop) + brick.offsetTop + brick.marginTop,
                status: true
            }
        }
    }
}

// ---------------- Collisions ---------------- //
function wallCollision() {
    if(ball.xPosition + ball.radius > canvas.width || ball.xPosition - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if(ball.yPosition - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    if(ball.yPosition + ball.radius > canvas.height) {
        lives--;
        resetBall();
    }
}

function paddleCollision() {
    if(ball.yPosition > paddle.yPosition && ball.yPosition < paddle.yPosition + paddle.height
       && ball.xPosition > paddle.xPosition && ball.xPosition < paddle.xPosition + paddle.width) {

        let collidePoint = ball.xPosition - (paddle.xPosition + paddle.width/2);
        collidePoint = collidePoint / (paddle.width/2);

        let angle = collidePoint * (Math.PI/3);
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// ---------------- Initialising -------------------- //
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballDraw();
    paddleDraw();
}

function game() {
    paddleMove();
    ballMove();
    wallCollision();
    paddleCollision();
    draw();
//    update();
    requestAnimationFrame(game);
} 

game();