const GameState = Object.freeze({
    off: 0,
    computerPlaying: 1,
    humanPlaying: 2
});
const startBtn = document.querySelector('#circle #center');
const colorBtns = document.querySelectorAll('.color');
const greenBtn = document.getElementById('green');
const redBtn = document.getElementById('red');
const yellowBtn = document.getElementById('yellow');
const blueBtn = document.getElementById('blue');
const greenAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
const redAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
const blueAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
const yellowAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
const errorAudio = new Audio('https://s3.amazonaws.com/adam-recvlohe-sounds/error.wav');
const lvlVal = document.querySelector('#level .value');
let startBtnTxt = document.querySelector('#circle #center .text');
let colorSequence = [];
let gameState = GameState.off;
let currBtnIndex = 0;

// Click on "start" button.
startBtn.onclick = () => {
    // Evaluate game state.
    switch (gameState) {
    case GameState.off:
        // Change from "off" to "computer playing".
        startBtn.setAttribute('disabled', '');
        gameState = GameState.computerPlaying;
        makeComputerPlay();
        break;
    }
}

// Computer behavior during "computer playing" game state.
function makeComputerPlay() {
    startBtn.setAttribute('disabled', '');
    startBtnTxt.innerHTML = 'Genius';
    // Select new, different from previous, color. 
    let colorCode;
    do {
        colorCode = Math.floor(Math.random() * 4) + 1;
    } while (colorSequence.length > 0 && colorCode == document.getElementById(colorSequence[colorSequence.length - 1]).getAttribute('data-code'));
    colorSequence.push(document.querySelector('[data-code="' + colorCode + '"]').id);
    // Play each color (highlight and sound) after given interval.
    for (let i = 0; i < colorSequence.length; i++) {
        const btn = document.getElementById(colorSequence[i]);
        // Begins playing.
        setTimeout(() => {
            btn.classList.add('bright');
            playSound(btn.id);
        }, 1000 + 500 * i);
        // Ends playing.
        setTimeout(() => {
            btn.classList.remove('bright');
            // Switches from "computer playing" to "human playing".
            if (i === colorSequence.length - 1) {
                for (let i = 0; i < colorBtns.length; i++) {
                    colorBtns[i].removeAttribute('disabled');
                }
                gameState = GameState.humanPlaying;
            }
        }, 1000 + 500 * i + 200);
    }
}

// Click on any "color" button during "human playing" game state.
for (let i = 0; i < colorBtns.length; i++) {
    colorBtns[i].onclick = function() {
        switch (gameState) {
        case GameState.humanPlaying:
            // Right color.
            if (this.id === colorSequence[currBtnIndex]) {
                // Last element of the sequence.
                if (currBtnIndex === colorSequence.length - 1) {
                    lvlVal.innerHTML = parseInt(lvlVal.innerHTML) + 1;
                    currBtnIndex = 0;
                    for (let i = 0; i < colorBtns.length; i++) {
                        colorBtns[i].setAttribute('disabled', '');
                    }
                    gameState = GameState.computerPlaying;
                    makeComputerPlay();
                }
                // Not last element of the sequence.
                else {
                    currBtnIndex++;
                }
                playSound(this.id);
            }
            // Wrong color. Resets game.
            else {
                colorSequence = [];
                errorAudio.play();
                lvlVal.innerHTML = currBtnIndex = 0;
                startBtnTxt.innerHTML = 'Start';
                startBtn.removeAttribute('disabled');
                for (let i = 0; i < colorBtns.length; i++) {
                    colorBtns[i].setAttribute('disabled', '');
                }
                gameState = GameState.off;
            }
            break;
        }
    }
}

// Play the sound corresponding to the color.
function playSound(id) {
    switch (id) {
    case 'green': greenAudio.play(); break;
    case 'red': redAudio.play(); break;
    case 'yellow': yellowAudio.play(); break;
    case 'blue': blueAudio.play(); break;
    }
}