import musicMetadata from "music-metadata";  // Подключаем библиотеку для метаданных

// Функция для получения длительности аудиофайла
export const getTrackDuration = (filePath) => {
    return musicMetadata.parseFile(filePath)
        .then(metadata => metadata.format.duration)  // Получаем длительность
        .catch(() => 0);  // Если не удалось получить длительность, возвращаем 0
};

