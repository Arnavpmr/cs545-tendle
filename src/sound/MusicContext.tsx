// Context to manage music volume globally
import React, { createContext, useState, ReactNode } from "react";

interface MusicContextProps {
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  hasConsented: boolean;
  setHasConsented: (consent: boolean) => void;
}

export const MusicContext = createContext<MusicContextProps>({
  musicVolume: 0,
  setMusicVolume: () => {},
  hasConsented: false,
  setHasConsented: () => {},
});

export const MusicProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [musicVolume, setMusicVolume] = useState<number>(0);
  const [hasConsented, setHasConsented] = useState<boolean>(false);

  return (
    <MusicContext.Provider
      value={{ musicVolume, setMusicVolume, hasConsented, setHasConsented }}
    >
      {children}
    </MusicContext.Provider>
  );
};
