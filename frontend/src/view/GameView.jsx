"use client";
import React from "react";
import Board from "../components/Board";
import Controls from "../components/Controls";
import { winner, winningLine, isFull, nextTurn } from "../controller/GameRules";
import { fetchMove } from "../services/apiService";
import "../styles/board.css";

export default class GameView extends React.Component {
  // para no disparar confeti varias veces por el mismo juego
  _prevWinner = null;

  constructor(props) {
    super(props);
    this.state = {
      board: Array(9).fill(null),
      level: "hard",
      ai: "O",
      lock: false,
    };
  }

  componentDidMount() {
    // Si la IA es "X", juega automáticamente al iniciar
    if (this.state.ai === "X") this.makeAIMove();
  }

  componentDidUpdate(prevProps, prevState) {
    const w = winner(this.state.board);

    // dispara confeti SOLO cuando pasamos de "sin ganador" a "con ganador"
    if (!this._prevWinner && w) {
      this._prevWinner = w;
      this.triggerConfetti();
    }
    // si resetean el juego, vuelve a permitir confeti
    if (prevState.board !== this.state.board && !w && this._prevWinner) {
      // si el tablero vuelve a vacío por reset, limpia el marcador
      const allEmpty = this.state.board.every(v => v === null);
      if (allEmpty) this._prevWinner = null;
    }
  }

  triggerConfetti = async () => {
    // import dinámico para que no rompa el SSR de Next
    const mod = await import("canvas-confetti");
    const confetti = mod.default;

    const duration = 1600;
    const end = Date.now() + duration;

    // ráfagas laterales
    (function frame() {
      confetti({ particleCount: 5, startVelocity: 45, spread: 70, origin: { x: 0.1, y: 0.3 } });
      confetti({ particleCount: 5, startVelocity: 45, spread: 70, origin: { x: 0.9, y: 0.3 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // boom central
    confetti({
      particleCount: 140,
      spread: 90,
      scalar: 0.95,
      origin: { x: 0.5, y: 0.2 },
    });
  };

  resetGame = () => {
    this.setState({ board: Array(9).fill(null), lock: false }, () => {
      this._prevWinner = null; // permitir confeti de nuevo
      if (this.state.ai === "X") this.makeAIMove();
    });
  };

  handleAiChange = (ai) => {
    this.setState({ ai }, this.resetGame);
  };

  makeAIMove = async () => {
    const { board, ai, level } = this.state;
    try {
      const { index: aiMove } = await fetchMove(board, ai, level);
      if (aiMove !== null && aiMove >= 0) {
        const updated = board.map((v, i) => (i === aiMove ? ai : v));
        this.setState({ board: updated });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ lock: false });
    }
  };

  handleCellClick = async (index) => {
    const { board, ai, lock } = this.state;
    if (lock || board[index] || winner(board) || isFull(board)) return;

    const human = ai === "X" ? "O" : "X";
    const newBoard = board.map((v, i) => (i === index ? human : v));
    this.setState({ board: newBoard }, async () => {
      if (winner(newBoard) || isFull(newBoard)) return;
      this.setState({ lock: true });
      await this.makeAIMove();
    });
  };

  render() {
    const { board, ai, level } = this.state;
    const w = winner(board);
    const full = isFull(board);
    const turn = nextTurn(board);
    const status = w ? `Ganó ${w}` : full ? "Empate" : `Turno: ${turn}`;
    const line = winningLine(board) ?? [];

    return (
      <div className="container">
        <div className="hdr">
          <div className="title">Juego del Gato</div>
          <span className="badge">Análisis de Algoritmos</span>
        </div>

        <div className="card">
          <Controls
            level={level}
            ai={ai}
            onLevel={(v) => this.setState({ level: v })}
            onAi={this.handleAiChange}
            onReset={this.resetGame}
          />
          <div className="status">{status}</div>

          <Board
            board={board}
            onCell={this.handleCellClick}
            winningLine={line}
          />
        </div>
      </div>
    );
  }
}
