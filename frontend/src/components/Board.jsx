// frontend/src/components/Board.jsx
import "../styles/board.css";

/**
 * @param {{ board: ("X"|"O"|null)[], onCell:(i:number)=>void, winningLine?: number[] }} props
 */
export default function Board({ board, onCell, winningLine = [] }) {
  const isWin = (i) => winningLine?.includes(i);

  return (
    <div className="board">
      {board.map((v, i) => (
        <button
          key={i}
          className={`cell ${isWin(i) ? "win" : ""}`}
          onClick={() => onCell(i)}
          aria-label={`cell-${i}`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
