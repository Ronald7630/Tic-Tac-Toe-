const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWin(board, player) {
  // Temukan pola kemenangan
  const winningPattern = winPatterns.find(pattern =>
    pattern.every(index => board[index] === player)
  );

  // Jika ada pola kemenangan, tandai sel-sel pemenang
  if (winningPattern) {
    winningPattern.forEach(index => cells[index].classList.add("win"));
    return true;
  }
  return false;
}

function checkDraw(board) {
  return board.every(cell => cell !== "");
}

function aiMove() {
  statusText.textContent = "AI is thinking...";
  setTimeout(() => {
    // Strategi AI
    const emptyCells = board
      .map((cell, index) => (cell === "" ? index : null))
      .filter(index => index !== null);

    // Cek apakah AI bisa menang
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === "O" && board[b] === "O" && board[c] === "") {
        board[c] = "O";
        updateCell(c, "O");
        return;
      }
      if (board[a] === "O" && board[c] === "O" && board[b] === "") {
        board[b] = "O";
        updateCell(b, "O");
        return;
      }
      if (board[b] === "O" && board[c] === "O" && board[a] === "") {
        board[a] = "O";
        updateCell(a, "O");
        return;
      }
    }

    // Cek apakah AI perlu memblokir pemain
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === "X" && board[b] === "X" && board[c] === "") {
        board[c] = "O";
        updateCell(c, "O");
        return;
      }
      if (board[a] === "X" && board[c] === "X" && board[b] === "") {
        board[b] = "O";
        updateCell(b, "O");
        return;
      }
      if (board[b] === "X" && board[c] === "X" && board[a] === "") {
        board[a] = "O";
        updateCell(a, "O");
        return;
      }
    }

    // Ambil pusat jika kosong
    if (board[4] === "") {
      board[4] = "O";
      updateCell(4, "O");
      return;
    }

    // Jika tidak ada langkah strategis, pilih secara acak
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    updateCell(randomIndex, "O");
  }, 1000); // Jeda 1 detik untuk membuat AI tampak berpikir
}

function updateCell(index, player) {
  cells[index].textContent = player;
  cells[index].classList.add("taken");

  if (checkWin(board, player)) {
    statusText.textContent = player === "O" ? "AI Wins!" : "You Win!";
    document.getElementById("game-board").classList.add(player === "O" ? "lose" : "");
    return;
  }

  if (checkDraw(board)) {
    statusText.textContent = "It's a Draw!";
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  if (currentPlayer === "X") {
    statusText.textContent = "Your turn!";
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || checkWin(board, "X") || checkWin(board, "O")) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("taken");

  if (checkWin(board, currentPlayer)) {
    statusText.textContent = `${currentPlayer} Wins!`;
    return;
  }

  if (checkDraw(board)) {
    statusText.textContent = "It's a Draw!";
    return;
  }

  currentPlayer = "O";
  aiMove();
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken", "win");
  });
  document.getElementById("game-board").classList.remove("lose");
  statusText.textContent = "";
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);