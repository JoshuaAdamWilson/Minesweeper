
// VARIABLES
let board = document.getElementById('grid')
let timer = document.getElementById('timer')
let button = document.getElementById('button')
let num1 = 0;
let num2 = 0;
let start = 0;
let time;
let allZombies = 4; // This number changes mine and flag count
let flagCount = document.getElementById('flagCount');
let flagCountNum = 99;
flagCount.textContent = "Flags: " + flagCountNum;
let size = 10;
let x5 = document.getElementById('x5')
let x10 = document.getElementById('x10')
let x15 = document.getElementById('x15')

// Button Functions to change size
x5.addEventListener('click', function() {
    size = 5
    generate()
})

x10.addEventListener('click', function() {
    size = 10
    generate()
})

x15.addEventListener('click', function() {
    size = 15
    generate()
})

// Function that generates Grid layout
function generate() {
    board.innerHTML = '';
    for (let i = 0; i < size; i++) {
        row = board.insertRow(i);
        for (let j = 0; j < size; j++) {
            let mine = document.createAttribute('data-mine');
            cell = row.insertCell(j);
            cell.onclick = function () {
                start++
                if (start === 1) {
                    timerFunc2()
                }
                clickZombie(this)
            }
            // Flagging Mines with right-click
            cell.oncontextmenu = function(ev) {
                start++
                if (start === 1) {
                    timerFunc2()
                }
                ev.preventDefault();
                if (this.className === '') {
                    this.className = 'flag'
                    flagCountNum--
                    flagCount.textContent = "Flags: " + flagCountNum;
                    return
                } 
                if (this.className === 'flag') {
                    this.className = ''
                    flagCountNum++
                    flagCount.textContent = "Flags: " + flagCountNum;
                    return
                } 
            }
            mine.value = 'false';
            cell.setAttributeNode(mine)
        }
    }
    zombies()
}

// Function that creates mines
function zombies() {
    for (let i = 0; i < allZombies; i++) {
        let row = Math.floor(Math.random() * size)
        let col = Math.floor(Math.random() * size)
        let cell = board.rows[row].cells[col]
        cell.setAttribute('data-mine', 'true')
    }
}

// Function for onClick to check for mine or empty space
function clickZombie(cell) {
    if (cell.className === 'flag') {
        return
    }
    cell.className = 'revealed';
    if (cell.getAttribute('data-mine') === 'true') {
        clearInterval(time)
        showZombies()
        button.textContent = "Game Over! Try Again?"
        board.addEventListener('click', noClick, true)
        function noClick(cell) {
            cell.stopPropagation()
            cell.preventDefault()
        }
    } else {
        let zombieCount = 0;
        let cellRow = cell.parentNode.rowIndex;
        let cellCol = cell.cellIndex;
        for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, (size - 1)); i++) {
            for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, (size - 1)); j++) {
                if (board.rows[i].cells[j].getAttribute('data-mine') === 'true') {
                    zombieCount++;
                }
            }
        }
        cell.innerHTML = zombieCount;
        if (zombieCount === 0) {
            for (let i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, (size - 1)); i++) {
                for (let j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, (size - 1)); j++) {
                    if (board.rows[i].cells[j].innerHTML === '') {
                        clickZombie(board.rows[i].cells[j])
                    }
                }
            }
        }
        levelComplete()
    }
}

// Timer Functions
// This was a little confusing. Citation - https://jsfiddle.net/Daniel_Hug/pvk6p/

function timerFunc() {
    num1++
    if (num1 > 0 && num1 <= 9) {
        timer.innerHTML = num2 + ':0' + num1
    }
    if (num1 > 9 && num1 < 60) {
        timer.innerHTML = num2 + ':' + num1
    }
    if (num1 === 60) {
        num1 = 0
        num2++
        timer.innerHTML = num2 + ':0' + num1
    }
}

function timerFunc2() {
    time = setInterval(timerFunc, 1000);
}

// function to implement flags

// Function to reveal mines on win/lose
function showZombies() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = board.rows[i].cells[j];
            if (cell.getAttribute('data-mine') === 'true') {
                cell.className = 'zombie';
            }
        }
    }
}

// Function that checks for level completion
function levelComplete() {
    let complete = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if ((board.rows[i].cells[j].getAttribute('data-mine') === 'false') && (board.rows[i].cells[j].innerHTML === '')) {
                complete = false
            }
        }
    }
    if (complete) {
        clearInterval(time)
        button.textContent = "You Win! Play Again?"
        showZombies()
        board.addEventListener('click', noClick, true)
        function noClick(cell) {
            cell.stopPropagation()
            cell.preventDefault()
        }
    }
}

// Generates game
generate()