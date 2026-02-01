//Board
let board;
let bordHeight = 540;
let boardWidth = 600;
let context;

let startBtn;
let gameStarted = false;


//Bird
let birdHeight = 40;
let birdWidth = 50;
let birdX = boardWidth/8;
let birdY = bordHeight/2;

let bird = {
   x : birdX,
   y : birdY,
   height : birdHeight,
   width : birdWidth
}

//Pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Physics
let velocityX = -3;
let velocityY = 0;
let gravity = 0.2;
let gameOver = false;
let score = 0;


// ------------------------- ONLOAD 
window.onload = function(){

   board = document.getElementById('board');
   board.height = bordHeight;
   board.width = boardWidth;
   context = board.getContext("2d");

   //  GET BUTTON AFTER LOAD
   startBtn = document.getElementById('startBtn');

   startBtn.addEventListener("click", () => {
      startBtn.style.display = "none";
      startGame();
   });

   // Images
   birdImg = new Image();
   birdImg.src = "bird.png";

   topPipeImg = new Image();
   topPipeImg.src= "top.jpeg";

   bottomPipeImg = new Image();
   bottomPipeImg.src = "bottom.jpeg";

   setInterval(placePipes, 1500);

   document.addEventListener('keydown', moveBird);
   document.addEventListener('touchstart', moveBird);
};


// ------------------------- START GAME -------------------------
function startGame(){
   bird.y = birdY;
   pipeArray = [];
   score = 0;
   velocityY = 0;
   gameOver = false;

   gameStarted = true;

   requestAnimationFrame(update); // start loop here only
}


// ------------------------- UPDATE LOOP -------------------------
function update() {

   if(!gameStarted) return;   

   context.clearRect(0, 0, board.width, board.height);

   if (!gameOver) {

       velocityY += gravity;
       bird.y = Math.max(bird.y + velocityY, 0);

       if (bird.y + bird.height > board.height) {
           gameOver = true;
       }

       context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

       for (let i = 0; i < pipeArray.length; i++) {

           let pipe = pipeArray[i];
           pipe.x += velocityX;

           context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

           if (!pipe.passed && bird.x > pipe.x + pipe.width) {
               score += 0.5;
               pipe.passed = true;
           }

           if (detect(bird, pipe)) {
               gameOver = true;
           }
       }

       while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
           pipeArray.shift();
       }

       requestAnimationFrame(update);

   } 
   if (!gameOver) {

      // SHOW LIVE SCORE (top-left)
      context.fillStyle = "black";
      context.font = "30px Arial";
      context.textAlign = "left";
      context.fillText("Score: " + Math.floor(score), 10, 30);
  
  }
   else {

       //  CENTER FINAL SCORE
       context.fillStyle = "black";
       context.font = "bold 50px Arial";
       context.textAlign = "center";
       context.fillText("Final Score: " + Math.floor(score),
                        board.width/2,
                        board.height/4);

       // show start button again
       startBtn.style.display = "block";
       startBtn.style,height = "40px";
       gameStarted = false;
   }
}


// ------- PIPES --------//
function placePipes(){

   if(!gameStarted || gameOver) return;

   let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
   let openingSpace = board.height/3;

   pipeArray.push({
      img : topPipeImg,
      x : pipeX,
      y : randomPipeY,
      width : pipeWidth,
      height : pipeHeight,
      passed : false
   });

   pipeArray.push({
      img : bottomPipeImg,
      x : pipeX,
      y : randomPipeY + pipeHeight + openingSpace,
      width : pipeWidth,
      height : pipeHeight,
      passed : false
   });
}


//-------MOVE------
function moveBird(event){

   if(!gameStarted) return;

   if (event.code == "Space" || event.code == "ArrowUp" || event.type === "touchstart") {
      velocityY = -6;
   }
}


//---------COLLISION -------//
function detect(a,b){
   return a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;
}
