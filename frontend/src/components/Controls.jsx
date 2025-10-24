/**
 * @param {{ level: "easy"|"medium"|"hard", onLevel:(v:"easy"|"medium"|"hard")=>void, ai:"X"|"O", onAi:(v:"X"|"O")=>void, onReset:()=>void }} props
 */
export default function Controls({ level, onLevel, ai, onAi, onReset }) {
  return (
    <div className="controls-container">
      <div className="controls-grid">
        <label className="control-label">
          <span>Dificultad</span>
          <select className="fancy-select" value={level} onChange={(e) => onLevel(e.target.value)}>
            <option value="easy">Fácil</option>
            <option value="medium">Media</option>
            <option value="hard">Difícil</option>
          </select>
        </label>

        <label className="control-label">
          <span>IA juega</span>
          <select className="fancy-select" value={ai} onChange={(e) => onAi(e.target.value)}>
            <option value="O">Segundo</option>
            <option value="X">Primero</option>
          </select>
        </label>

        <button className="fancy-button" onClick={onReset}>
          Reiniciar partida
        </button>
      </div>
    </div>
  );
}
