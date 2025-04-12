import './App.css'
import {ChangeEventHandler, useEffect, useRef, useState} from "react";

import axios from "axios";
import {Button, CircularProgress, LinearProgress, Slider} from "@mui/material";


type TrackType = {
    id: string;
    title: string;
    url: string;
}

function App() {
    const [tracks, setTracks] = useState<Array<TrackType>>([]);
    const [currentTrack, setCurrentTrack] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:3000/tracks')
            .then((res) => setTracks(res.data))
            .catch(() => console.log("Error with list from server"));
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [currentTrack]);


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
            audioRef.current.autoplay = true;
        }

    }

    return (
        <div className="App">
            {tracks.length === 0 ?
                <CircularProgress/>
                :
                <>
                    <audio ref={audioRef} src={tracks[currentTrack].url}></audio>
                    <Button onClick={handleNextTrack}>Next</Button>
                    <Button onClick={handlePlayTrack}>Play</Button>
                    <Button onClick={handlePrevTrack}>Prev</Button>
                    <Slider
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={(e: Event, value) => {
                            if (audioRef.current && typeof value === 'number') {
                                audioRef.current.currentTime = value;
                                setCurrentTime(value);
                                console.log(e)
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

        </div>
    )
}


export default App
