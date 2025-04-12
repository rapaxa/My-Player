import './App.css'
import {useEffect, useRef, useState} from "react";

import axios from "axios";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import {Button, CircularProgress, IconButton, ListItemButton, Slider} from "@mui/material";
import List from '@mui/material/List';


type TrackType = {
    id: string;
    title: string;
    url: string;
    duration: number;
}

function App() {
    const [tracks, setTracks] = useState<Array<TrackType>>([]);
    const [currentTrack, setCurrentTrack] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:3000/api/tracks/')
            .then((res) => setTracks(res.data))
            .catch(() => console.log("Error with list from server"));
    }, []);
    console.log(tracks)
    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            const updateTime = () => {
                setCurrentTime(audio.currentTime);
                if (audio.currentTime === audio.duration) {
                    setCurrentTrack(prevState => prevState + 1)
                }
            };
            const updateDuration = () => {
                setDuration(audio.duration);
            }
            // Подключаем слушатель
            audio.addEventListener('timeupdate', updateTime);
            audio.addEventListener('loadedmetadata', updateDuration);
            // Убираем слушатель при размонтировании компонента
            return () => {
                audio.removeEventListener('timeupdate', updateTime);
                audio.removeEventListener('loadedmetadata', updateDuration);
            };
        }

    }, [currentTime, tracks]);


    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const handleNextTrack = () => {
        if (currentTrack < tracks.length - 1) {
            setCurrentTrack(prevTrack => prevTrack + 1);
        }

    }
    const handlePrevTrack = () => {
        if (currentTrack > 0) {
            setCurrentTrack(prevTrack => prevTrack - 1);

        }

    }
    const handlePlayTrack = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            audioRef.current.autoplay = true;
        }

    }
    const handlePauseTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }
    const handleCurrentTrack = (index: number) => {
        setCurrentTrack(index);
    }
    return (
        <div className="App">
            {tracks.length === 0 ?
                <CircularProgress/>
                :
                <>
                    <audio ref={audioRef} src={tracks[currentTrack].url}></audio>
                    <Button onClick={handleNextTrack}>Next</Button>
                    {isPlaying ?
                        <IconButton onClick={handlePauseTrack}>
                            <PauseCircleIcon color="secondary"/>
                        </IconButton>
                        :
                        <IconButton onClick={handlePlayTrack}>
                            <PlayCircleIcon color="primary"/>
                        </IconButton>}


                    <Button onClick={handlePrevTrack}>Prev</Button>
                    <Slider
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={(_e: Event, value) => {
                            if (audioRef.current && typeof value === 'number') {
                                audioRef.current.currentTime = value;
                                setCurrentTime(value);
                            }
                        }}
                        sx={{
                            width: 1000,
                            color: '#1976d2',
                            mt: 2,
                        }}
                    />
                    <div>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                </>}

            <List>
                {tracks.map((track: TrackType, index) => (
                    <ListItemButton onClick={() => handleCurrentTrack(index)}>
                        Title: {track.title}
                    </ListItemButton>
                ))}
            </List>
        </div>
    )
}


export default App
