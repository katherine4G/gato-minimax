// frontend/src/components/Board.jsx
import "../styles/board.css";

/**
 * @param {{ board: ("X"|"O"|null)[], onCell:(i:number)=>void, winningLine?: number[] }} props
 */
export default function Board({ board, onCell, winningLine = [], outcome = "none" }) {
  const isWin = (i) => winningLine?.includes(i);

  return (
    <div className="board">
      {board.map((v, i) => (
        <button
          key={i}
           className={`cell ${isWin(i) ? (outcome === "lose" ? "lose" : "win") : ""}`}
          onClick={() => onCell(i)}
        >
          {v}
        </button>

      ))}
    </div>
  );
}
