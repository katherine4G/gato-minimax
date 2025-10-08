// frontend/src/controller/GameRules.js
const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

export const winner = (board) => {
  for (const [a,b,c] of LINES)
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  return null;
};

export const winningLine = (board) => {
  for (const line of LINES) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
};

export const isFull = (board) => board.every(Boolean);

export const nextTurn = (board) => {
  const x = board.filter(v => v === "X").length;
  const o = board.filter(v => v === "O").length;
  return x === o ? "X" : "O";
};
