//backend/src/model/MinimaxModel.js
export class MinimaxModel {
  constructor(aiSymbol = "O", humanSymbol = "X") {
    this.ai = aiSymbol;
    this.human = humanSymbol;
    this.lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  winner(board) {
    for (const [a, b, c] of this.lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
  }

  isFull(board) {
    return board.every(cell => cell !== null);
  }

  randomMove(board) {
    const free = board.map((v, i) => (v === null ? i : null)).filter(i => i !== null);
    if (free.length === 0) return null;
    return free[Math.floor(Math.random() * free.length)];
  }

  minimax(board, isMaximizing, alpha, beta) {
    const win = this.winner(board);
    if (win === this.ai) return 10;
    if (win === this.human) return -10;
    if (this.isFull(board)) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = this.ai;
          const val = this.minimax(board, false, alpha, beta);
          board[i] = null;
          best = Math.max(best, val);
          alpha = Math.max(alpha, val);
          if (beta <= alpha) break;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = this.human;
          const val = this.minimax(board, true, alpha, beta);
          board[i] = null;
          best = Math.min(best, val);
          beta = Math.min(beta, val);
          if (beta <= alpha) break;
        }
      }
      return best;
    }
  }

  getBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = this.ai;
        const moveVal = this.minimax(board, false, -Infinity, Infinity);
        board[i] = null;
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  }

  getAIMove(board, level = "hard") {
    if (level === "easy") {
      // Totalmente aleatorio (para un modo relajado)
      return this.randomMove(board);
    }

    // Difícil: usa Mini-Max con poda
    return this.getBestMove([...board]);
  }
}
