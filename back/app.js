import express from "express";
import cors from "cors";
import trackRoutes from "./routes/trackRoutes.js";  // Один импорт маршрутов

const app = express();
const PORT = 3000;

app.use(cors());

// Подключаем маршруты
app.use("/api", trackRoutes);  // Уже подключили маршруты

// Статическая раздача аудиофайлов
app.use("/track", express.static("assets/tracks"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
