// Audio playback controlled by music volume
import React, { useEffect, useRef, useContext } from "react";
import { MusicContext } from "./MusicContext";
import moonlightDrive from "./audio/moonlight-drive.mp3";

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { musicVolume } = useContext(MusicContext);

  // Update volume when musicVolume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100;
      if (musicVolume > 0) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [musicVolume]);

  return <audio ref={audioRef} src={moonlightDrive} loop />;
};

export default AudioPlayer;
