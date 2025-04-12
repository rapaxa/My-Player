import fs from "fs";
import path from "path";
import { v1 as uuidv1 } from "uuid";
import { getTrackDuration } from "../services/musicService.js";

const musicDir = path.join(process.cwd(), "assets/tracks");  // Используем process.cwd() для получения корня проекта

// Функция для получения всех треков
export const getTracks = async (req, res) => {
    try {
        const files = fs.readdirSync(musicDir);  // Синхронно читаем директорию

        // Формируем промисы для получения длительности каждого трека
        const tracksPromises = files
            .filter(file => file.endsWith(".mp3"))
            .map(async (file) => {
                const filePath = path.join(musicDir, file);
                const duration = await getTrackDuration(filePath);
                console.log(duration)// Получаем длительность

                return {
                    id: uuidv1(),
                    title: file.replace(".mp3", ""),
                    url: `http://localhost:3000/track/${file}`,
                    duration: duration,  // Добавляем длительность
                };
            });

        const tracks = await Promise.all(tracksPromises);  // Получаем все треки с длительностями
        res.json(tracks);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при извлечении метаданных" });
    }
};
