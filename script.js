var board;
var human = "O";
var computer = "X";
const winCombos = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6],
];

let pvp = document.getElementById("pvp");
let pvc = document.getElementById("pvc");
let easy = document.getElementById("easy");
let medium = document.getElementById("medium");
let hard = document.getElementById("hard");

const cells = document.querySelectorAll(".box");
startGame();

function startGame() {
  human = "O";
  board = Array.from(Array(9).keys());

  document.getElementById("end_game").innerText = "Tic Tac Toe";
  document.getElementById("reset").innerHTML = "Reset";
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof board[square.target.id] == "number") {
    let gameWon = turn(square.target.id, human);
    if (pvp.checked && !gameWon && !checkTie()) {
      human = human == "X" ? "O" : "X";
    } else if (!gameWon && !checkTie()) turn(bestSpot(), computer);
  }
}

function bestSpot() {
  if (hard.checked) return minimax(board, computer).index;
  else if (medium.checked)
    return emptysquares()[(Math.random() * emptysquares().length) | 0];
  return emptysquares()[0];
}

// freeCodeCamp.org
function minimax(newBoard, player) {
  var availSpots = emptysquares(newBoard);
  if (checkWin(newBoard, human)) {
    return { score: -1 };
  } else if (checkWin(newBoard, computer)) {
    return { score: 1 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player == computer) {
      var result = minimax(newBoard, human);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, computer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if (player === computer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function emptysquares() {
  return board.filter((s) => typeof s == "number");
}

function checkTie() {
  if (emptysquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "pink";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function declareWinner(who) {
  document.getElementById("end_game").innerText = who;
  document.getElementById("reset").innerText = "Play Again";
}

function turn(squareId, player) {
  board[squareId] = player;
  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(board, player);
  if (gameWon) gameOver(gameWon);

  return gameWon;
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == human ? "#238D5f" : "red";
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(
    pvp.checked
      ? human == "O"
        ? "Player 1 Won!"
        : "Player 2 Won!"
      : gameWon.player == human
      ? "You Won!"
      : "You Lose!"
  );
}