// JavaScript Document

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2, y = canvas.height-30;
var dx = new Date().getSeconds() % 2 == 0 ? 2 : -2, dy = -2;
var ballRadius = 10;
var paddleHeight = 10, paddleWidth = 75, paddleX = (canvas.width-paddleWidth)/2;

var brickRowCount = 6, brickColumnCount = 2, brickWidth = 50, brickHeight = 20;
var brickPadding = 5, brickOffsetTop = 30, brickOffsetLeft = 30;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, health: 2 };
    }
}

var score = 0;
var lives = 3;

var rightPressed = false, leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
			if (b.health > 0) {
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
					dy = -dy;
					b.health -= 1;
					score += b.health == 0 ? 1 : 0;
					if(score == (brickRowCount*brickColumnCount)) {
                        alert("CONGRATULATIONS! You have won the game.");
						x = canvas.width / 2; y = canvas.height-30;
						dy = -2;
                        document.location.reload();
                    }
				}
			}
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
		if (c == Math.floor(brickColumnCount / 2)) {
			continue;
		}
        for(var r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.health > 0) {
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				b.x = brickX;
				b.y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = b.health == 2 ? "#A2321A" : "#EEB2A5";
				ctx.fill();
				ctx.closePath();
			}
        }
    }
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
	
	if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if(y + dy < ballRadius) {
    	dy = -dy;
	} else if(y + dy > canvas.height-ballRadius) {
		if(x >= paddleX && x <= paddleX + paddleWidth) {
			dy = -dy;
			if (x < paddleX + (paddleWidth/2)) {
				// left
				dx = dx < 0 ? dx : -dx;
			} else {
				dx = dx > 0 ? dx : -dx;
			}
    	} else {
			lives--;
			if(!lives) {
    			alert("GAME OVER :(");
				x = canvas.width/2;
				y = canvas.height-30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width-paddleWidth)/2;
    			document.location.reload();
				
			} else {
				alert("You died!");
				x = canvas.width/2;
				y = canvas.height-30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
	}
	
	x += dx;
	y += dy;
	
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += 4;
	}
	else if(leftPressed && paddleX > 0) {
    	paddleX -= 4;
	}
	
}

setInterval(draw, 5);

/*

NEXT STEPS TO IMPROVE GAMEPLAY:

1. Implement ball-brick collision to be EDGE of ball, not center (much cleaner visual, removes "instant break" bug)
2. Allow user to select Easy, Medium, Hard modes (10, 7, or 5 millisecond intervals, respectively)
3. Change ball direction based on which 1/4th of paddle hit: left with slope 1 for left 1/4, left with slope 2 for mid-left 1/4,
   right with slope 2 for mid-right 1/4, and right with slope 1 for right 1/4.
4. Might be fun to change ball color every hit (randomly pick from array of predefined colors)
5. Levels??

*/

