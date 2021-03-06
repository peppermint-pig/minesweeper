'use strict';

  function getRandPos(board) {
    var emptyPoses = [];
    for (var i = 1; i < board.length; i++) {
      for (var j = 1; j < board[i].length; j++) {
        var cell = gBoard[i][j];
        var pos = {i: i, j: j};
        if (!cell.isMine && !cell.isShown) {
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

 function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function countTime() {
    if (gGame.isOn) {
      gGame.secsPassed += 1;
      if (gGame.secsPassed === 59) {
        gGame.secsPassed = 0;
        gGame.minsPassed = 1;
      }
    }
}