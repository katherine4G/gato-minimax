// frontend/src/view/GameView.jsx
"use client";
import React from "react";
import Board from "../components/Board";
import Controls from "../components/Controls";
import { winner, winningLine, isFull, nextTurn } from "../controller/GameRules";
import { fetchMove } from "../services/apiService";
import "../styles/board.css";

export default class GameView extends React.Component {
  _prevWinner = null;
  _thinkingInterval = null;

  constructor(props) {
    super(props);
    this.state = {
      board: Array(9).fill(null),
      level: "hard",
      ai: "O",
      mode: "ia", // "ia" | "2p"
      lock: false,
      thinking: false,
      thinkingText: "Pensando",
      outcome: "none",
      turn: "X",
    };
  }

  componentDidMount() {
    if (this.state.mode === "ia" && this.state.ai === "X") {
      this.makeAIMove();
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const w = winner(this.state.board);
    if (!this._prevWinner && w) {
      this._prevWinner = w;
      const aiWon = w === this.state.ai && this.state.mode === "ia";
      this.setState({ outcome: aiWon ? "lose" : "win" });
      if (aiWon) await this.triggerDefeatEffect();
      else await this.triggerWinConfetti();
    }

    // limpiar marcador al reiniciar
    if (prevState.board !== this.state.board && !w && this._prevWinner) {
      const allEmpty = this.state.board.every(v => v === null);
      if (allEmpty) {
        this._prevWinner = null;
        if (this.state.outcome !== "none") this.setState({ outcome: "none" });
      }
    }
  }

  // 🎉 Efecto “ganó humano”
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
        colors: ["#34d399", "#60a5fa", "#f59e0b", "#f472b6"],
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

  // Efecto “derrota”: lluvia oscura descendente
  triggerDefeatEffect = async () => {
    const mod = await import("canvas-confetti");
    const confetti = mod.default;

    confetti({
      particleCount: 160,
      spread: 50,
      startVelocity: 20,
      gravity: 1.1,
      origin: { x: 0.5, y: -0.1 },
      colors: ["#111827", "#6b7280", "#ef4444"],
      scalar: 0.8,
      ticks: 180,
    });

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
  const { ai, mode } = this.state;

  const firstTurn =
    mode === "2p"
      ? ai
      : ai === "X"
      ? "X"
      : "X"; //  X siempre arranca cuando IA juega de segundo

  const shouldLock = mode === "ia" && ai === "X"; // IA empieza = bloqueado
  const shouldThink = false;

  this.setState(
    {
      board: Array(9).fill(null),
      lock: shouldLock,
      thinking: shouldThink,
      outcome: "none",
      turn: firstTurn,
    },
    async () => {
      this._prevWinner = null;

      //  Si la IA juega primero, hace su movimiento con delay
      if (mode === "ia" && ai === "X") {
        this.setState({ thinking: true, thinkingText: "Pensando" });
        await new Promise((r) => setTimeout(r, 1000));
        await this.makeAIMove();
      }
    }
  );
};


  handleAiChange = (ai) => {
    this.setState({ ai }, this.resetGame);
  };

  handleModeChange = (mode) => {
    this.setState({ mode }, this.resetGame);
  };

  makeAIMove = async () => {
    const { board, ai, level } = this.state;
    try {
      const { index: aiMove } = await fetchMove(board, ai, level);
      if (aiMove !== null && aiMove >= 0) {
        const updated = board.map((v, i) => (i === aiMove ? ai : v));
        this.setState({ board: updated, turn: ai === "X" ? "O" : "X" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ lock: false, thinking: false });
      clearInterval(this._thinkingInterval);
    }
  };

handleCellClick = async (index) => {
  const { board, ai, lock, mode, turn } = this.state;
  if (lock || board[index] || winner(board) || isFull(board)) return;

  //  Bloquea de inmediato antes de actualizar el tablero
  this.setState({ lock: true });

  const newBoard = board.map((v, i) => (i === index ? turn : v));
  const next = turn === "X" ? "O" : "X";

  this.setState({ board: newBoard, turn: next }, async () => {
    if (winner(newBoard) || isFull(newBoard)) {
      this.setState({ lock: false });
      return;
    }

    //  Si es modo IA y ahora es turno de la IA
    if (mode === "ia" && next === ai) {
      this.setState({ thinking: true, thinkingText: "Pensando" });

      let dots = 0;
      this._thinkingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        this.setState({ thinkingText: "Pensando" + ".".repeat(dots) });
      }, 500);

      // Simula el tiempo de “pensar”
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await this.makeAIMove();
    } else {
      // Si no es turno de la IA, desbloquea de nuevo
      this.setState({ lock: false });
    }
  });
};

  render() {
    const { board, ai, level, outcome, thinking, thinkingText, mode, turn } = this.state;
    const w = winner(board);
    const full = isFull(board);
    const line = winningLine(board) ?? [];
   const cardClass = `card ${outcome === "lose" ? "defeat" : ""} ${mode === "2p" ? "mode-2p" : "mode-ia"}`;


    const status = thinking
      ? thinkingText
      : w ? `Ganó ${w}` : full ? "Empate" : `Turno: ${turn}`;

    return (
      <div className="container">
        <div className="hdr">
          <div className="title">Juego del Gato</div>
          <span className="badge">Análisis de Algoritmos</span>
        </div>

        <div className={cardClass}>
          {/* Controles dinámicos */}
          <div className="controls-row" style={{ textAlign: "center", marginBottom: "8px" }}>
            <label style={{ marginRight: "8px" }}>Modo:</label>
             <select
                className="fancy-select"
                value={mode}
                onChange={(e) => this.handleModeChange(e.target.value)}
              >
              <option value="ia">Jugador vs IA</option>
              <option value="2p">2 Jugadores</option>
            </select>
          </div>

        
          {mode === "ia" && (
            <Controls
              level={level}
              ai={ai}
              onLevel={(v) => this.setState({ level: v })}
              onAi={this.handleAiChange}
              onReset={this.resetGame}
            />
          )}

          {mode === "2p" && (
  <div className="two-player-settings controls-grid">
    <label className="control-label">
      Jugador que empieza:
      <select
        className="fancy-select"
        value={ai}
        onChange={(e) => this.handleAiChange(e.target.value)}
      >
        <option value="X">X</option>
        <option value="O">O</option>
      </select>
    </label>

    <button className="fancy-button" onClick={this.resetGame}>
      Reiniciar Partida
    </button>
  </div>
)}

          <div className="status">{status}</div>

          <Board
            board={board}
            onCell={this.handleCellClick}
            winningLine={line}
            outcome={outcome}
          />

          {outcome === "win" && <div className="banner">¡Victoria! 🎉</div>}
          {outcome === "lose" && <div className="banner">Derrota… 😵</div>}
          
          {/* “Tu turno” solo visible en modo IA */}
          {mode === "ia" && !w && !full && !thinking && (
            <div className="banner" style={{ opacity: 0.7 }}>
              {turn !== ai ? "Tu turno" : ""}
            </div>
          )}
        </div>
      </div>
    );
  }
}
