import express from "express";
import { getTracks } from "../controllers/trackController.js";

const router = express.Router();

// Маршрут для получения списка треков
router.get("/tracks", getTracks);

export default router;
