// backend/src/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import gameRoute from "./routes/gameRoute.js";

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas de la API
app.use("/api", gameRoute);

// Ruta base opcional para verificar que el backend está activo
app.get("/", (req, res) => {
  res.send("Backend del juego activo");
});

export default app;
