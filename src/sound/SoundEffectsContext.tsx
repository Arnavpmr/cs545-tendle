// Context to manage sound effects volume globally
import React, { createContext, useState, ReactNode } from "react";

interface SoundEffectsContextProps {
  soundEffectVolume: number;
  setSoundEffectVolume: (volume: number) => void;
  playSound: (sound: string) => void;
}

export const SoundEffectsContext = createContext<SoundEffectsContextProps>({
  soundEffectVolume: 50,
  setSoundEffectVolume: () => {},
  playSound: () => {},
});

export const SoundEffectsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [soundEffectVolume, setSoundEffectVolume] = useState<number>(50);

  const playSound = (sound: string) => {
    const audio = new Audio(sound);
    audio.volume = soundEffectVolume / 100;
    audio.play().catch((error) => {
      console.error("Playback failed:", error);
    });
  };

  return (
    <SoundEffectsContext.Provider
      value={{ soundEffectVolume, setSoundEffectVolume, playSound }}
    >
      {children}
    </SoundEffectsContext.Provider>
  );
};
