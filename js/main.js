'use strict';
console.log('OMG MineSweeper!');

const MINE = '🧨';
const EMPTY = ' ';
const MARK = '🚩';

var gTimerInterval;
var gStartTime;
var gFirstClick = true;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minsPassed: 0
}

function init(size = 4, mines = 2) {
    restartGame();
    gBoard = buildBoard(size);
    createRandMines(mines);
    setNegsMineCounter(gBoard);
    renderBoard(gBoard);
}

function chooseLevel(elButtonID) {
    if (elButtonID === 'easy') {
        gLevel.size = 4;
        gLevel.mines = 2;
    } else if (elButtonID === 'medium') {
        gLevel.size = 8;
        gLevel.mines = 12;
    } else if (elButtonID === 'hard') {
        gLevel.size = 12;
        gLevel.mines = 30;
    }
    init(gLevel.size, gLevel.mines);
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                mineNegsCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellID = 'cell-' + i + '-' + j;
            var className = (currCell.isShown) ? 'shown' : 'hidden';
            strHTML += '<td onclick="cellClicked(this, ' + i + ',' + j + ')" ' +
                ' class="' + className + '" id="' + cellID + '" oncontextmenu="markCell(this, event,' + i + ',' + j + ')"> <span class="td-text">' +
                currCell.mineNegsCount + '</span> </td>\n';
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function setTimer() {
    var elTimer = document.querySelector(".timer");
    var secs = gGame.secsPassed;;
    var mins = gGame.minsPassed;
    countTime();
    elTimer.innerHTML = pad(mins) + ':' + pad(secs);
}

function gameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCellDOM = '#cell-' + i + '-' + j;
            var currCellBack = gBoard[i][j];
            if (!currCellBack.isShown) {
                document.querySelector(currCellDOM).classList.add('shown');
                document.querySelector(currCellDOM).classList.remove('hidden');
                if (currCellBack.isMine === true) {
                    document.querySelector(currCellDOM).innerHTML = MINE;
                }
                if (currCellBack.isMarked === true) {
                    if (currCellBack.mineNegsCount === 0) {
                        document.querySelector(currCellDOM).innerHTML = EMPTY;
                    } else document.querySelector(currCellDOM).innerHTML = currCellBack.mineNegsCount;
                }
            }
        }
    }
    gGame.isOn = false;
    document.querySelector('.lose').style.display = 'block';
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gFirstClick = true;
    clearInterval(gTimerInterval);
}

function checkVictory() {
    var isVictory = false;
    if ((gGame.markedCount === gLevel.mines) && (gGame.shownCount === (gLevel.size ** 2 - gLevel.mines))) isVictory = true;
    if (isVictory) {
        document.querySelector('.win').style.display = 'block';
        gGame.shownCount = 0;
        gGame.markedCount = 0;
        gGame.isOn = false;
        clearInterval(gTimerInterval);
    }
}

function cellClicked(elCell, i, j) {
    var clickedCell = gBoard[i][j];
    if (gFirstClick) onFirstClick();
    if (gGame.isOn) {
        if (clickedCell.isMine) gameOver();
        if (clickedCell.isShown) return;
        else if (clickedCell.mineNegsCount > 0) {
            clickedCell.isShown = true;
            elCell.classList.add('shown');
            elCell.classList.remove('hidden');
            gGame.shownCount++;
        } else if (clickedCell.mineNegsCount === EMPTY) {
            openNegs(i, j);
        }
    }
    checkVictory();
}

function onFirstClick() {
    gGame.isOn = true;
    gFirstClick = false;
    gStartTime = Date.now();
    gTimerInterval = setInterval(setTimer, 1000);
}

function restartGame() {
    gGame.isOn = false;
    gFirstClick = true;
    clearInterval(gTimerInterval);
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.minsPassed = 0;
    document.querySelector('.lose').style.display = 'none';
    document.querySelector('.win').style.display = 'none';
    document.querySelector('.timer').innerHTML = '00:00';
}

function markCell(elCell, event, i, j) {
    event.preventDefault();
    var clickedCell = gBoard[i][j];
    if (gGame.isOn) {
        if (!clickedCell.isMarked) {
            clickedCell.isMarked = true;
            elCell.innerHTML = MARK;
            gGame.markedCount++;
        } else {
            elCell.innerHTML = EMPTY;
            clickedCell.isMarked = false;
            gGame.markedCount--;
        }
        checkVictory();
    }
}

function openNegs(pos1, pos2) {
    if (gGame.isOn) {
        for (var i = pos1 - 1; i <= pos1 + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = pos2 - 1; j <= pos2 + 1; j++) {
                var cell = gBoard[i][j];
                if (j < 0 || j >= gBoard[i].length) continue;
                if (cell.isMine || cell.isMarked || cell.isShown) continue;
                else if (cell.mineNegsCount > 0 || cell.mineNegsCount === EMPTY) {
                    cell.isShown = true;
                    document.querySelector('#cell-' + i + '-' + j).classList.add('shown');
                    document.querySelector('#cell-' + i + '-' + j).classList.remove('hidden');
                    gGame.shownCount++;
                    if (cell.mineNegsCount === EMPTY) {
                        openNegs(i, j);
                    }
                }
                console.log(cell);
            }
        }
    }
}

function createRandMines(num) {
    var pos;
    for (var i = 0; i < num; i++) {
        pos = getRandPos(gBoard);
        gBoard[pos.i][pos.j].isMine = true;
    }
}

function setNegsMineCounter(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];
            var pos = {
                i: i,
                j: j
            };
            if (!currCell.isMine) {
                var count = countNegMines(board, pos);
                currCell.mineNegsCount = count;
                if (count === 0) currCell.mineNegsCount = EMPTY;
            } else currCell.mineNegsCount = MINE;
        }
    }
}

function countNegMines(board, pos) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === pos.i && j === pos.j) continue;
            if (board[i][j].isMine) count++;
        }
    }
    return count;
}