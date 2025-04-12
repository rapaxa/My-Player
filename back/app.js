import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import {v1} from "uuid";
const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, "assets/tracks");

app.use(cors());


app.get("/tracks", (req, res) => {
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка чтения папки" });
        }
        const tracks = files
            .filter(file => file.endsWith(".mp3"))
            .map((file) => ({
                id: v1(),
                title: file.replace(".mp3", ""),
                url: `http://localhost:3000/track/${file}`,
            }));
        res.json(tracks);
    });
});

app.use("/track", cors(), express.static(musicDir));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
