//Variables concerned with the canvas element
var canvas;
var canvasContext;

// Variables concerned with the ball
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var radius = 10;

// Variables concerned with the paddles
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

// Variables concerned with scorekeeping
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;


function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  }
}

function handleMouseClick(evt) {
  if( showingWinScreen ) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  console.log("hello world!");  
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  
  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();  
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - ( PADDLE_HEIGHT / 2 )
  });
}

function ballReset() {
  if( player1Score >= WINNING_SCORE || 
      player2Score >= WINNING_SCORE ) {
        showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  // Since paddle2y tracks the top of the paddle, the line below establishes 
  // the center of the paddle and allows us to track that
  var paddle2Ycenter = paddle2Y + ( PADDLE_HEIGHT / 2 );

  // Basically, if the ball's above the center move up, if it's below, move 
  // down.  The addition/subtraction of 35 helps reduce the jerkiness of the 
  // paddle's movement.
  if( paddle2Ycenter < ballY - 35 ) {
    paddle2Y += 6;
  } else if( paddle2Ycenter < ballY + 35 ) {
    paddle2Y -= 6;
  }
} 

function moveEverything() {
  if( showingWinScreen ) {
    return;
  }
  
  computerMovement();

  // This function moves the ball
  ballX += ballSpeedX;
  ballY -= ballSpeedY;
  ballDirection();  
}

function ballDirection() {
  // This function bounces the ball off each edge of the screen
  if( ballX < radius ) {
    if( ballY > paddle1Y &&
        ballY < paddle1Y + PADDLE_HEIGHT ) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY
        - ( paddle1Y + PADDLE_HEIGHT/2 );
        ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // Must be BEFORE ballReset()
      ballReset();  
    }
  }
  if( ballX > canvas.width - radius ) {
    if( ballY > paddle2Y &&
        ballY < paddle2Y + PADDLE_HEIGHT ) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY
        - ( paddle2Y + PADDLE_HEIGHT/2 );
        ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // Must be BEFORE ballReset
      ballReset();
    }
  }
  if( ballY > canvas.height - radius || ballY < radius ) {
    ballSpeedY = -ballSpeedY; 
  }
}

function drawNet() {
  for(var i=0; i<canvas.height; i+=40) {
    colorRect( canvas.width/2-1, i, 2, 20, 'white' );
  }
}

function drawEverything() {
  
  // The following line blacks out the screen providing the background
  colorRect( 0, 0, canvas.width, canvas.height, 'black' );          
  
  if( showingWinScreen ) {
    canvasContext.fillStyle = 'white';

    if( player1Score >= WINNING_SCORE ){
      canvasContext.fillText( "LEFT PLAYER WON!", 350, 200);
    } else if( player2Score >= WINNING_SCORE ) {
      canvasContext.fillText( "RIGHT PLAYER WON!", 350, 200);
    } 
    
    canvasContext.fillText( "CLICK TO CONTINUE", 350, 400);
    return;
  }
  
  // The following calls the function that draws the net
  drawNet();

  // The following line draws the left paddle
  colorRect( 0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white' );

  // The following line draws the right computer paddle
  colorRect( canvas.width - PADDLE_THICKNESS, paddle2Y,PADDLE_THICKNESS, PADDLE_HEIGHT, 'white' );

  // The following line draws the ball
  colorCircle( ballX, ballY, radius, 'white' );

  canvasContext.fillText( player1Score, 100, 100 );
  canvasContext.fillText( player2Score, canvas.width - 100, 100 );

}  

function colorCircle( centerX, centerY, radius, drawColor ) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
function colorRect( leftX, topY, width, height, drawColor ) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect( leftX, topY, width, height )
}
  