/**
 * @param {{ board: import("frontend/src/utils/MinimaxAI").Cell[], onCell: (i:number)=>void }} props
 */
import "../styles/board.css";

export default function Board({ board, onCell }) {
  return (
    <div className="board">
      {board.map((v, i) => (
        <button key={i} className="cell" onClick={() => onCell(i)} aria-label={`cell-${i}`}>
          {v}
        </button>
      ))}
    </div>
  );
}
