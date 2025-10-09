//frontend/src/components/Controls.jsx
/**
 * @param {{ level: "easy"|"hard", onLevel:(v:"easy"|"hard")=>void, ai:"X"|"O", onAi:(v:"X"|"O")=>void, onReset:()=>void }} props
 */
export default function Controls({ level, onLevel, ai, onAi, onReset }) {
  return (
    <div className="row" style={{ justifyContent: "space-between" }}>
      <div className="split">
        <label>
          <span style={{ marginRight: 8 }}>Dificultad</span>
          <select className="select" value={level} onChange={(e) => onLevel(e.target.value)}>
            <option value="easy">Fácil</option>
            <option value="hard">Difícil</option>
          </select>
        </label>

        <label>
          <span style={{ marginRight: 8 }}>IA juega</span>
          <select className="select" value={ai} onChange={(e) => onAi(e.target.value)}>
            <option value="O">segundo</option>
            <option value="X">primero</option>
          </select>
        </label>

        <button className="reset" onClick={onReset}>Reiniciar</button>
      </div>
    </div>
  );
}
