"use client";
import React from "react";
import Board from "../components/Board";
import Controls from "../components/Controls";
import { winner, winningLine, isFull, nextTurn } from "../controller/GameRules";
import { fetchMove } from "../services/apiService";
import "../styles/board.css";

export default class GameView extends React.Component {
  _prevWinner = null;

  constructor(props) {
    super(props);
    this.state = {
      board: Array(9).fill(null),
      level: "hard",
      ai: "O",
      lock: false,
      outcome: "none", // "none" | "win" | "lose"
    };
  }

  componentDidMount() {
    if (this.state.ai === "X") this.makeAIMove();
  }

  async componentDidUpdate(prevProps, prevState) {
    const w = winner(this.state.board);
    if (!this._prevWinner && w) {
      this._prevWinner = w;
      const aiWon = w === this.state.ai;
      this.setState({ outcome: aiWon ? "lose" : "win" });
      if (aiWon) {
        // derrota: sin confeti, solo efecto oscuro/sacudida
        await this.triggerDefeatEffect();
      } else {
        // victoria humano: confeti
        await this.triggerWinConfetti();
      }
    }


    // si se resetea el tablero a vacío, limpiar marcadores
    if (prevState.board !== this.state.board && !w && this._prevWinner) {
      const allEmpty = this.state.board.every(v => v === null);
      if (allEmpty) {
        this._prevWinner = null;
        if (this.state.outcome !== "none") this.setState({ outcome: "none" });
      }
    }
  }

  // 🎉 Confeti “ganó humano”
  triggerWinConfetti = async () => {
    const mod = await import("canvas-confetti");
    const confetti = mod.default;

    const duration = 1600;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        startVelocity: 48,
        spread: 75,
        origin: { x: 0.1, y: 0.3 },
        colors: ["#34d399", "#60a5fa", "#f59e0b", "#f472b6"], // verde/azul/dorado/rosa
      });
      confetti({
        particleCount: 6,
        startVelocity: 48,
        spread: 75,
        origin: { x: 0.9, y: 0.3 },
        colors: ["#34d399", "#60a5fa", "#f59e0b", "#f472b6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 140,
      spread: 90,
      scalar: 0.95,
      origin: { x: 0.5, y: 0.2 },
      colors: ["#34d399", "#60a5fa", "#f59e0b", "#f472b6"],
    });
  };

  // 💥 Efecto “derrota”: ráfaga oscura descendente + sacudida (CSS)
  triggerDefeatEffect = async () => {
    const mod = await import("canvas-confetti");
    const confetti = mod.default;

    // lluvia corta de partículas oscuras cayendo
    confetti({
      particleCount: 160,
      spread: 50,
      startVelocity: 20,
      gravity: 1.1,            // cae hacia abajo
      drift: 0,                // sin desplazamiento lateral
      origin: { x: 0.5, y: -0.1 },
      colors: ["#111827", "#6b7280", "#ef4444"], // gris oscuro, gris, rojo
      scalar: 0.8,
      ticks: 180,
    });

    // golpe “boom” rojo pequeño
    confetti({
      particleCount: 60,
      spread: 40,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.15 },
      colors: ["#ef4444", "#b91c1c", "#111827"],
      scalar: 0.9,
    });
  };

  resetGame = () => {
    this.setState({ board: Array(9).fill(null), lock: false, outcome: "none" }, () => {
      this._prevWinner = null;
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
    const { board, ai, level, outcome } = this.state;
    const w = winner(board);
    const full = isFull(board);
    const turn = nextTurn(board);
    const status = w ? `Ganó ${w}` : full ? "Empate" : `Turno: ${turn}`;
    const line = winningLine(board) ?? [];
    const cardClass = `card ${outcome === "lose" ? "defeat" : ""}`;

    return (
      <div className="container">
        <div className="hdr">
          <div className="title">Juego del Gato</div>
          <span className="badge">Análisis de Algoritmos</span>
        </div>

        <div className={cardClass}>
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
            outcome={outcome}   // 👈 agrega esta línea
          />


          {outcome === "win" && <div className="banner">¡Victoria! 🎉</div>}
          {outcome === "lose" && <div className="banner">Derrota… 😵</div>}
          {w === null && !full && <div className="banner" style={{ opacity: .7 }}>Tu turno</div>}
        </div>
      </div>
    );
  }
}
