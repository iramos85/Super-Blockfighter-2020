
$(()=>{

///////////////////////////global variables///////////////////////////////
let canvas = document.querySelector('canvas')
canvas.setAttribute('style', "position: absolute; top: 25%; left: 0px; right: 0px; bottom: 25%; margin: auto; border:25px solid yellow")
let ctx = canvas.getContext('2d')
let imgBall = document.getElementById('gameBall')
let pat = ctx.createPattern(imgBall, 'repeat')
//declaring default gameplay (one player) as true, false for two players
let onePlayer = true
const openModal = ($modal) => {
    $modal.css('display','block')
}
//how to modal

$("#howTo").on("click", function(){
    $(".modal, .modalContent").addClass("active");
    });

//draw rectangle
const drawRectangle = (x,y,w,h,color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h)
}

////////////////////////////sound effects for game////////////////////////////////////
let backgroundMusic = new Audio('audio/1 - A Little Background....mp3')
backgroundMusic.volume = 0.2
let hit = new Audio('audio/13 - Explosion.wav')
let point = new Audio('audio/27 - PointTally.wav')
let obstacleHit = new Audio('audio/obstacleCollision.wav')
obstacleHit.volume = 0.25
let wallHit = new Audio('audio/wallHit.wav')
let winningScore = new Audio('audio/winningScore.mp3')
winningScore.volume = 0.2
let losingScore = new Audio('audio/losingScore.mp3')
let gameOver = new Audio('audio/gameOver.mp3')
let gameWin = new Audio('audio/gameWin.mp3')

//turn off sounds
const soundOff = () => {
    backgroundMusic.volume = 0
    hit.volume = 0
    point.volume = 0
    obstacleHit.volume = 0
    wallHit.volume = 0
    losingScore.volume = 0
    winningScore = 0
}

document.getElementById('soundOff').addEventListener('click',soundOff)
///////////////////////////////////////////////////////////////////////////////////

//draw gameboard
drawRectangle(0,0,canvas.width,canvas.height,'Black')

//draw score board
const drawText = (text, x,y,color) => {
    ctx.fillStyle = color;
    ctx.font = '50px Arial';
    ctx.fillText(text,x,y)
}

//draw Player One Paddle
const playerOne = {
    x: 30,
    y: canvas.height/2,
    width: 15,
    height: 150,
    color: 'Purple',
    score: 0,
    speed: 10
}

//draw computer Paddle
const troyComputer = {
    x: canvas.width - 30,
    y: canvas.height/2,
    width: 15,
    height: 150,
    color: 'Blue',
    score: 0
}

//draw Player Two Paddle
const playerTwo = {
    x: canvas.width - 30,
    y: canvas.height/2,
    width: 15,
    height: 150,
    color: 'Pink',
    score: 0,
    speed: 10
}

//draw circle
const drawCircle = (x,y,radius,) => {
    ctx.fillStyle = pat;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

//draw obstacles
// const ob1 = () => {
//     ctx.fillStyle = color,
//     ctx.fillRect(200,400,50,50),
//     color = 'Purple'
// }
const ob1 = {
    x: 200,
    y: 400,
    width: 50,
    height: 50,
    color: 'yellow',
}
// const ob2 = () => {
//     ctx.fillStyle = color,
//     ctx.fillRect(500,300,20,60),
//     color = 'Purple'
// }
const ob2 = {
    x: 600,
    y: 200,
    width: 50,
    height: 50,
    color: 'yellow',
}
// const obArray = [ob1,ob2]
// const randomPlace = (location) => {
//     let item = location[Math.floor(Math.random() * location.length)]
//     return location
// }

// intervalTimer = null

// function startTimer() {
//     intervalTimer = setInterval(obstacleSpawn, 1000);
// }
// function stopTimer() {
//     clearInterval(startTimer);
// }
// const obstacleSpawn = () => {
//     drawRectangle(200,400, 50, 50,'red')
// }

//draw gameball
const ball = {
    x: canvas.height/2,
    y: canvas.width/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'red'
}

//paddle control
const keys = {}
window.addEventListener('keydown', function(e){
    keys[e.keyCode] = true
    e.preventDefault()
})

window.addEventListener('keyup', function(e){
    delete keys[e.keyCode]
})

const inputPlayerOne = () => {
    if(38 in keys){  //up key
        playerOne.y -= playerOne.speed
    }
    if (40 in keys){ //down key
        playerOne.y += playerOne.speed
    }
}

const inputPlayerTwo = () => {
    if(87 in keys){  //W key
        playerTwo.y -= playerTwo.speed
    }
    if (83 in keys){ //S key
        playerTwo.y += playerTwo.speed
    }
}

///////////////////////////////////////Declaring variables and sides for paddles and ball//////////////////////////////////
const collisionDetectPlayer = (b, p) => {
   
    //declaring ball sides
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    //declaring paddle sides
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width

    //if the above statements are true, there is a collision
    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
}

const collisionDetectObstacle = (b, o) => {
    
    //declaring ball sides
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    //declaring obstacle sides
    o.top = o.y;
    o.bottom = o.y + o.height;
    o.left = o.x;
    o.right = o.x + o.width

    //if return statements are true, there is a colliision
    return b.right > o.left && b.bottom > o.top && b.left < o.right && b.top < o.bottom
}

const collisionDetectPlayerTwo = (b, p) => {
    
    //declaring ball sides
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    //declaring player two paddle sides
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width

    //if return statements are true, there is a colliision
    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
}

const collisionDetectObstacleTwo = (b, o) => {
    
    //declaring ball sides
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    //declaring player two paddle sides
    o.top = o.y;
    o.bottom = o.y + o.height;
    o.left = o.x;
    o.right = o.x + o.width

    //if return statements are true, there is a colliision
    return b.right > o.left && b.bottom > o.top && b.left < o.right && b.top < o.bottom
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//reset ball
const resetBall = () => {
    ball.x = canvas.width/2
    ball.y = canvas.height/2
    ball.speed = 5;
    ball.velocityX = -ball.velocityX
}

////////////////////////////////////////////Computer AI logic////////////////////////////////////////////////////////////
const computerPlay = () => {
    troyComputer.y += ((ball.y - (troyComputer.y + troyComputer.height/2))) * 0.05
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////Drawing Board/////////////////////////////////////////////////////////
const render = () => {
       
    //drawing game board
    drawRectangle(0,0, canvas.height,canvas.width, 'Black')
    
    //draw obstacle
    drawRectangle(ob1.x,ob1.y, ob1.width, ob1.height,ob1.color)
    // randomPlace(obArray)
    drawRectangle(ob2.x,ob2.y, ob2.width, ob2.height,ob2.color)
    
    //adding player one score
    drawText(playerOne.score, 200, 100, 'Purple')
    
    //drawing player two score
    drawText(troyComputer.score, canvas.width - 200, 100, 'Blue')
    
    //draw player one paddle
    drawRectangle(playerOne.x, playerOne.y, playerOne.width, playerOne.height, playerOne.color)
    
    // draw player computer or player two paddle
    if (onePlayer === true){
    drawRectangle(troyComputer.x, troyComputer.y, troyComputer.width,troyComputer.height,troyComputer.color)
    }
    else if(onePlayer === false){
        drawRectangle(playerTwo.x, playerTwo.y, playerTwo.width, playerTwo.height, playerTwo.color)
    }
    
    //drawing game ball
    drawCircle(ball.x, ball.y,ball.radius, ball.color)   
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////Game Logic///////////////////////////////////////////////////////
const update = () => {
    inputPlayerOne()
    let score = 0
    //update score
    if(ball.x - ball.radius < 0){
    troyComputer.score++;
    point.play()
    resetBall()
    }
    else if(ball.x + ball.radius > canvas.width){
    playerOne.score++;
    point.play()
    resetBall()
    }

    //ball has velocity    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //amount of players logic////
    if (onePlayer === true){
         computerPlay()
     } else if(onePlayer === false){
          inputPlayerTwo()
     }
    
    //keeps game ball from exiting gameboard on y axis
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY
        wallHit.play()
    }
    //determines who is "player", if statement is true, then playerOne, if false = troyComputer
    let player = (ball.x + ball.radius < canvas.width/2) ? playerOne : troyComputer
    
    //declares what constitutes an "obstacle" for collision
    let obstacle = (ball.x + ball.radius < canvas.width/2) ? ob1 : player

    //declares what constitutes an "obstacle" for collision
    let obstacleTwo = (ball.x + ball.radius < canvas.width/2) ? ob2 : player

    //determines who is "player", if statement is true, then playerOne, if false = player two
    let players = (ball.x + ball.radius < canvas.width/2) ? playerOne : playerTwo

    if(collisionDetectPlayer(ball,player)) {
        hit.play()
        //ball hits the middle of paddle, at a 0 angle
        let collisionPoint = (ball.y - (player.y + player.height/2));

        //returns a value of a  hit area of "-1(top), 0(center) & 1(bottom)"
        collisionPoint = collisionPoint/(player.height/2);

        //equation for calculating the ball speed depending on where it hits the paddle
        let angleRad = collisionPoint * (Math.PI/4);

        //x direction of ball when it's hit - by player (traveling to the right, a positive), otherwise computer
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1

        // calculates the ball colliding with object and traveling at a -45 degree angle (top of paddle)
        ball.velocityX = direction * ball.speed * Math.cos(angleRad)

        //calculates the ball colliding with object and traveling in a 45 degree angle(bottom of paddle)
        ball.velocityY = ball.speed * Math.sin(angleRad)

        //whenever ball is hit,the speed is increased
        ball.speed += 0.15;
    }
    else if(collisionDetectObstacle(ball,obstacle)) {
        obstacleHit.play()
        //ball hits the middle of paddle, at a 0 angle
        let collisionPoint = (ball.y - (obstacle.y + obstacle.height/2));

        //returns a value of a  hit area of "-1(top), 0(center) & 1(bottom)"
        collisionPoint = collisionPoint/(obstacle.height/2);

        //equation for calculating the ball speed depending on where it hits the paddle
        let angleRad = collisionPoint * (Math.PI/4);

        //x direction of ball when it's hit - by player (traveling to the right, a positive), otherwise computer
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1
        
        // calculates the ball colliding with object and traveling at a -45 degree angle (top of paddle)
        ball.velocityX = direction * ball.speed * Math.cos(angleRad)

        //calculates the ball colliding with object and traveling in a 45 degree angle(bottom of paddle)
        ball.velocityY = ball.speed * Math.sin(angleRad)

        //whenever ball is hit,the speed is increased
        ball.speed += 0.15;
    }
    else if(collisionDetectPlayerTwo(ball,players)) {
        hit.play()
        //ball hits the middle of paddle, at a 0 angle
        let collisionPoint = (ball.y - (playerTwo.y + playerTwo.height/2));

        //returns a value of a  hit area of "-1(top), 0(center) & 1(bottom)"
        collisionPoint = collisionPoint/(playerTwo.height/2);

        //equation for calculating the ball speed depending on where it hits the paddle
        let angleRad = collisionPoint * (Math.PI/4);

        //x direction of ball when it's hit - by player (traveling to the right, a positive), otherwise computer
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1
        
        // calculates the ball colliding with object and traveling at a -45 degree angle (top of paddle)
        ball.velocityX = direction * ball.speed * Math.cos(angleRad)

        //calculates the ball colliding with object and traveling in a 45 degree angle(bottom of paddle)
        ball.velocityY = ball.speed * Math.sin(angleRad)

        //whenever ball is hit,the speed is increased
        ball.speed += 0.15;
    }
    else if(collisionDetectObstacleTwo(ball,obstacleTwo)) {
        obstacleHit.play()
        //ball hits the middle of paddle, at a 0 angle
        let collisionPoint = (ball.y - (obstacleTwo.y + obstacleTwo.height/2));

        //returns a value of a  hit area of "-1(top), 0(center) & 1(bottom)"
        collisionPoint = collisionPoint/(obstacleTwo.height/2);

        //equation for calculating the ball speed depending on where it hits the paddle
        let angleRad = collisionPoint * (Math.PI/4);

        //x direction of ball when it's hit - by player (traveling to the right, a positive), otherwise computer
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1
        
        // calculates the ball colliding with object and traveling at a -45 degree angle (top of paddle)
        ball.velocityX = direction * ball.speed * Math.cos(angleRad)

        //calculates the ball colliding with object and traveling in a 45 degree angle(bottom of paddle)
        ball.velocityY = ball.speed * Math.sin(angleRad)

        //whenever ball is hit,the speed is increased
        ball.speed += 0.15;
    }
    if (playerOne.score >= 3){
        backgroundMusic.volume = 0
        // winningScore.play()
        } else if(playerTwo.score >= 3){
        backgroundMusic.volume = 0
        // winningScore.play()
        } else if(troyComputer.score >= 3){
        backgroundMusic.volume = 0
        losingScore.play()
        }
        if (playerOne.score == 5){
        winningScore.volume = 0
        gameWin.play()
        $('canvas').remove()
        openModal($('#popUpWinner'))
        // $('#newGame').onClick(('popUp').toggleClass('popUpWinner'))
        } else if(playerTwo.score == 5){
        winningScore.volume = 0
        gameWin.play()
        $('canvas').remove()
        openModal($('#popUpWinnerTwo'))
        // $('#newGame').onClick(('popUp').toggleClass('popUpWinnerTwo'))  
        } else if (troyComputer.score == 5){
        losingScore.volume = 0
        gameOver.play()
        $('canvas').remove()
        openModal($('#popUpDefeat'))
        // $('#newGame').onClick(('popUp').toggleClass('popUpDefeat'))
        }
}


const gamePlay = () => {
    backgroundMusic.play()
    render()
    update()
}
const gameLoopInterval = () => {
    const framePerSecond = 50;
    setInterval(gamePlay,1000/framePerSecond) 
}
//One Player Game Setting
const onePlayerGame = () => {
    gameLoopInterval()
    onePlayer = true
    gameOverfunc()
    }
document.getElementById('onePlayer').addEventListener('click',onePlayerGame)


//Two Player Game Setting
const twoPlayerGame = () => {
    gameLoopInterval()
    onePlayer = false
    }
document.getElementById('twoPlayer').addEventListener('click',twoPlayerGame)

const gameOverfunc = () => {
    if (playerOne.score == 5){
        winningScore.volume = 0
        gameWin.play()
        clearInterval(gameLoopInterval)
        $('canvas').remove()
        openModal($('#popUpWinner'))
    }
}

   
});

