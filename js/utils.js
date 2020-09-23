'use strict';
console.log('some helpful stuff');

  function getRandPos(board) {
    var emptyPoses = [];
    for (var i = 1; i < board.length; i++) {
      for (var j = 1; j < board[i].length; j++) {
        var cell = gBoard[i][j];
        var pos = {i: i, j: j};
        if (!cell.isMine) {
          emptyPoses.push(pos);
        }
      }
    }
    var randPos = emptyPoses[getRandomInt(0, emptyPoses.length)];
    return randPos;
  }

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
 }