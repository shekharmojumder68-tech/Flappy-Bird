//Board
let board;
let bordHeight = 540;
let boardWidth = 600;
let context;

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
let velocityX = -3;//pipes Moving speed
let velocityY = 0;
let gravity = 0.2;
let gameOver = false;
let score = 0;

window.onload = function(){
   board = document.getElementById('board');
   board.height = bordHeight;
   board.width = boardWidth;
   context = board.getContext("2d");

   //Flappy Bird
//   context.fillStyle = "green";
//   context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //Draw Bird
  birdImg = new Image();
  birdImg.src = "bird.png";
  birdImg.onload = function(){
   context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  topPipeImg = new Image();
  topPipeImg.src= "top.jpeg";
  bottomPipeImg = new Image();
  bottomPipeImg.src = "bottom.jpeg";


   requestAnimationFrame(update);

   setInterval(placePipes, 1500);
document.addEventListener('keydown', moveBird);
document.addEventListener('touchstart', moveBird);

};

//--------------UPDATE LOOP-------------//


function update(){


   if(gameOver){
      return;
   }
   requestAnimationFrame(update);
   context.clearRect(0,0,board.width, board.height);

   //bird
   velocityY += gravity;
   // bird.y += velocityY;
   bird.y = Math.max(bird.y + velocityY, 0 );//limit bird

   ///bird falling
   if (bird.y + bird.height > board.height){
      gameOver = true;
      bird.y = board.height - bird.height; // optional
  }
   context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
   
   //pipe
   for(let i=0; i<pipeArray.length; i++){
      let pipe = pipeArray[i];
      pipe.x +=velocityX;
      context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

      //Score
      if(!pipe.passed && bird.x > pipe.x + pipe.width){
        score += 0.5;
        pipe.passed = true; 
      }

      if(detect(bird,pipe)){
         gameOver = true;
      }
   }
   context.fillStyle = "black";
   context.font = "30px Arial";
   context.fillText("Score: " + Math.floor(score), 10, 30);
   if(gameOver){
      context.fillStyle = "red"
      context.font = "bold 50px Arial";
      context.textAlign = "center";
      context.fillText("GAME OVER!",board.width/2, board.height/2);
   }
}
while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
   pipeArray.shift();
}



function placePipes(){
   if(gameOver){
      return;
   }
   let randomPipeY = pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
   let openingSpace = board.height/3;
   let topPipe = {
      img : topPipeImg,
      x : pipeX,
      y : randomPipeY,
      width : pipeWidth,
      height : pipeHeight,
      passed : false
   }
   pipeArray.push(topPipe);

     let bottomPipe = {
      img : bottomPipeImg,
      x : pipeX,
      y : randomPipeY + pipeHeight+openingSpace,
      width : pipeWidth,
      height : pipeHeight,
      passed : false
   }
   pipeArray.push(bottomPipe);
}

function moveBird(event) {
   // Check if the correct keys are pressed
   if (event.code == "Space" || event.code == "ArrowUp" || event.type === "touchstart") {
       
       if (gameOver) {
           // --- RESET GAME ---
           bird.y = birdY;
           pipeArray = [];
           score = 0;
           velocityY = 0; // Reset gravity speed
           gameOver = false;
           
           // Restart the animation loop
           requestAnimationFrame(update); 

       } else {
           // --- JUMP ---
           velocityY = -6;
       }
   }
}


   function detect(a,b){
      return a.x < b.x + b.width &&
      a.x+ a.width > b.x &&
      a.y < b.y + b.height &&
      a.y +a.height > b.y 
   }