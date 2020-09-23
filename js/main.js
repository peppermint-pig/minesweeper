'use strict';
console.log('OMG MineSweeper!');

const MINE = '@';
const EMPTY = ' ';

var gBoard;

function init() {
    gBoard = buildBoard(4);
    createRandMines(2);
    setNegsMineCounter(gBoard);
    renderBoard(gBoard);
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

    // board[3][1].isMine = true;
    // board[2][2].isMine = true;
    // board[0][2].isMine = true;

    return board;
}

function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        // createRandMines(num);
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var className = (currCell.isShown) ? 'shown' : 'hidden';
            strHTML += '<td onclick="cellClicked(this)" ' +
                ' class="' + className + '"> <span class="td-text">' + currCell.mineNegsCount + '</span> </td>\n';
            if (className === 'shown') {
                if (currCell.isMine) currCell = MINE;
                else if (currCell.mineNegsCount > 0) currCell = currCell.mineNegsCount;
                else currCell = EMPTY;
            }
        }
        strHTML += '</tr>\n';
    }
    // console.log('strHTML is:', strHTML);
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell) {
    console.log('click!', elCell);
    elCell.classList = 'shown';

}

function createRandMines(num) {
    var pos;
    for (var i = 0; i < num; i++) {
        pos = getRandPos(gBoard);
        gBoard[pos.i][pos.j].isMine = true;
        console.log(gBoard[pos.i][pos.j]);
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