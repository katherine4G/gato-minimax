// frontend/src/services/apiService.js
const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
const API_URL = isLocal ? "http://localhost:3001/api" : "/api";

export const fetchMove = async (board, ai, level) => {
  const response = await fetch(`${API_URL}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board, ai, level }),
  });

  if (!response.ok) throw new Error("Error al obtener movimiento de la IA");
  return response.json();
};
