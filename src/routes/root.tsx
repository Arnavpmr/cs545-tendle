import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import logo from "../assets/logo.png";
import * as constants from "../constants";
import { PlayArrow, HelpOutline, Settings } from "@mui/icons-material";
import { MusicContext } from "../sound/MusicContext";
import { SoundEffectsContext } from "../sound/SoundEffectsContext";

// Components
import TutorialDialog from "../components/TutorialDialog";
import SettingsDialog from "../components/SettingsDialog";
import MusicConsentDialog from "../components/MusicConsentDialog";

// Import sound effects
import menuButtonSound from "../sound/audio/menuButton.mp3";
import gameStartSound from "../sound/audio/gameStart.mp3";

import { CATEGORIES } from "../constants";

const Root: React.FC = () => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { setMusicVolume, hasConsented, setHasConsented } =
    useContext(MusicContext);
  const { playSound } = useContext(SoundEffectsContext);
  const navigate = useNavigate();

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleSettingsOpen = () => {
    playSound(menuButtonSound);
    setSettingsOpen(true);
  };
  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleMusicConsent = (consent: boolean) => {
    if (consent) {
      setMusicVolume(30); // Set to default volume
    } else {
      setMusicVolume(0);
    }
    setHasConsented(true);
  };

  // Tutorial Dialog
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const handleTutorialOpen = () => {
    playSound(menuButtonSound);
    setTutorialOpen(true);
  };

  const handleTutorialClose = () => {
    setTutorialOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#219EBC",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "250px", marginBottom: "20px" }}
          />
          <Typography variant="h4" gutterBottom>
            Try to guess the correct order of the top 10 items in a category!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Select a category:
          </Typography>
          <FormControl
            variant="filled"
            sx={{
              marginBottom: "1em",
              minWidth: 200,
              backgroundColor: "white",
            }}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleCategoryChange}
              label="Category"
            >
              {constants.CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Play Button */}
          <Button
            startIcon={<PlayArrow />}
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.25em",
              fontWeight: "bold",
              width: "175px",
            }}
            onClick={() => {
              playSound(gameStartSound);
              navigate(`/category`, { replace: true, state: { category } });
            }}
          >
            Play
          </Button>

          {/* Tutorial Button */}
          <Button
            startIcon={<HelpOutline />}
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.25em",
              fontWeight: "bold",
              width: "175px",
              marginTop: "1em",
            }}
            onClick={handleTutorialOpen}
          >
            Tutorial
          </Button>

          {/* Settings Button */}
          <Button
            startIcon={<Settings />}
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.25em",
              fontWeight: "bold",
              width: "175px",
            }}
            style={{ marginTop: "1em" }}
            onClick={handleSettingsOpen}
          >
            Settings
          </Button>

          {/* Tutorial, Settings, Music Consent Dialog */}
          <TutorialDialog open={tutorialOpen} onClose={handleTutorialClose} />
          <SettingsDialog open={settingsOpen} onClose={handleSettingsClose} />
          <MusicConsentDialog
            open={!hasConsented}
            onConfirm={() => handleMusicConsent(true)}
            onCancel={() => handleMusicConsent(false)}
          />

          {/* Attribution Text */}
          <Box
            sx={{
              position: "static",
              bottom: 0,
              width: "100%",
              textAlign: "center",
              padding: "1em",
            }}
          >
            <Typography variant="caption" color="textSecondary">
              Music used: Bensound.com
              <br />
              License code: IO401RZ5ITTRKR2Q
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Root;
