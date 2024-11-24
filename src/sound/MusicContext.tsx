// Context to manage music volume globally
import React, { createContext, useState, ReactNode } from "react";

interface MusicContextProps {
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
}

export const MusicContext = createContext<MusicContextProps>({
  musicVolume: 0,
  setMusicVolume: () => {},
});

export const MusicProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [musicVolume, setMusicVolume] = useState<number>(0);

  return (
    <MusicContext.Provider value={{ musicVolume, setMusicVolume }}>
      {children}
    </MusicContext.Provider>
  );
};