'use strict';
console.log('OMG MineSweeper!');

const MINE = '🧨';
const EMPTY = ' ';
const MARK = '🚩';

var gBoard;
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init(size = 4, mines = 2) {
    gBoard = buildBoard(size);
    createRandMines(mines);
    setNegsMineCounter(gBoard);
    renderBoard(gBoard);
    document.querySelector('.lose').style.display = 'none';
    document.querySelector('.win').style.display = 'none';
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
                ' class="' + className + '" id="' + cellID + '" oncontextmenu="cellMarked(this)"> <span class="td-text">' +
                currCell.mineNegsCount + '</span> </td>\n';
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function gameOver() {
    gGame.isOn = false;
    document.querySelector('.lose').style.display = 'block';
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j  = 0; j < gBoard[i].length; j++) {
        }
    }
}

function checkVictory() {
    var isVictory = false;
    if ((gGame.markedCount === gLevel.mines) && (gGame.shownCount === (gLevel.size ** 2 - gLevel.mines))) isVictory = true;
    if (isVictory) {
        document.querySelector('.win').style.display = 'block';
        gGame.shownCount = 0;
        gGame.markedCount = 0;
    }
}

function openNegs (pos1, pos2) {
    for (var i = pos1 - 1; i <= pos1 + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos2 - 1; j <= pos2 + 1; j++) {
            var cell = gBoard[i][j];
            if (j < 0 || j >= gBoard[i].length) continue;
            if (cell.mineNegsCount === 0) cell.classList = 'shown';
            else cell.classList = 'hidden';
            
        }
    }
}

function cellClicked(elCell, i, j) {
    elCell.classList = 'shown';
    gGame.shownCount++;
    checkVictory();
    if (gBoard[i][j].isMine) gameOver();
    openNegs(i, j);
}

function cellMarked(elCell) {
    elCell.isMarked = true;
    if (elCell.isMarked) {
        elCell.innerHTML = MARK;
        gGame.markedCount++;
    }
    checkVictory();
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