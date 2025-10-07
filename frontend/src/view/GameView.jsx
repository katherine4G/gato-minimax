//frontend/src/view/GameView.jsx
"use client";

import React from "react";
import Board from "../components/Board";
import Controls from "../components/Controls";
import { winner, isFull, nextTurn } from "../controller/GameRules";
import { fetchMove } from "../services/apiService";
import "../styles/board.css";

export default class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: Array(9).fill(null),
      level: "hard",
      ai: "O",
      lock: false,
    };
  }

  resetGame = () => {
    this.setState({ board: Array(9).fill(null), lock: false }, () => {
      // Si la IA es "X", juega automáticamente al iniciar
      if (this.state.ai === "X") {
        this.makeAIMove();
      }
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
          <Board board={board} onCell={this.handleCellClick} />
        </div>
      </div>
    );
  }
}
