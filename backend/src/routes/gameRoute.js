//backend/src/routes/gameRoute.js
import express from "express";
import { getAIMove } from "../controller/GameController.js";

const router = express.Router();
router.post("/move", getAIMove);

export default router;
