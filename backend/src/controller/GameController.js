//backend/src/controller/GameController.js
import { MinimaxModel } from "../model/MinimaxModel.js";

export const getAIMove = (req, res) => {
  try {
    const { board, ai, level } = req.body;

    if (!board || ai === undefined || !level) {
      return res.status(400).json({ error: "Datos insuficientes en la petición" });
    }

    const human = ai === "X" ? "O" : "X";
    const aiModel = new MinimaxModel(ai, human);
    const move = aiModel.getAIMove(board, level);

    res.json({ index: move });
  } catch (error) {
    console.error("Error en getAIMove:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};