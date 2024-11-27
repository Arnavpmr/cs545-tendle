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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import logo from "../assets/logo.png";
import * as constants from "../constants";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// Settings page
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { MusicContext } from "../sound/MusicContext";
import { SoundEffectsContext } from "../sound/SoundEffectsContext";

// Import sound effects
import menuButtonSound from "../sound/audio/menuButton.mp3";
import gameStartSound from "../sound/audio/gameStart.mp3";

import { CATEGORIES } from "../constants";

// Transition component for the dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Root: React.FC = () => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { musicVolume, setMusicVolume, hasConsented, setHasConsented } =
    useContext(MusicContext);
  const { soundEffectVolume, setSoundEffectVolume, playSound } =
    useContext(SoundEffectsContext);
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
  const handleMusicVolumeChange = (_: Event, newValue: number | number[]) => {
    setMusicVolume(newValue as number);
  };
  const handleSoundEffectVolumeChange = (
    _: Event,
    newValue: number | number[]
  ) => {
    setSoundEffectVolume(newValue as number);
  };

  const handleMusicConsent = (consent: boolean) => {
    if (consent) {
      setMusicVolume(30); // Set to default volume
    } else {
      setMusicVolume(0);
    }
    setHasConsented(true);
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
            startIcon={<PlayArrowIcon />}
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.25em",
              fontFamily: "Arial,Helvetica,sans-serif",
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
            startIcon={<HelpOutlineIcon />}
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.25em",
              fontFamily: "Arial,Helvetica,sans-serif",
              fontWeight: "bold",
              width: "175px",
              marginTop: "1em",
            }}
            onClick={() => {
              playSound(menuButtonSound);
              // TODO: Add tutorial navigation or action here
            }}
          >
            Tutorial
          </Button>

          {/* Settings Button */}
          <Button
            startIcon={<SettingsIcon />}
            variant="contained"
            color="warning"
            sx={{
              fontSize: "1.25em",
              fontFamily: "Arial,Helvetica,sans-serif",
              fontWeight: "bold",
              width: "175px",
            }}
            style={{ marginTop: "1em" }}
            onClick={handleSettingsOpen}
          >
            Settings
          </Button>

          {/* Music Consent Dialog */}
          <Dialog
            open={!hasConsented}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => handleMusicConsent(false)}
            aria-labelledby="music-consent-dialog-title"
          >
            <DialogTitle id="music-consent-dialog-title">
              Play Background Music
            </DialogTitle>
            <DialogContent>
              <Typography>
                Would you like to enable background music?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleMusicConsent(true)}>Yes</Button>
              <Button onClick={() => handleMusicConsent(false)}>No</Button>
            </DialogActions>
          </Dialog>

          {/* Settings Dialog */}
          <Dialog
            open={settingsOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleSettingsClose}
            aria-labelledby="settings-dialog-title"
          >
            <DialogTitle id="settings-dialog-title">Volume</DialogTitle>
            <DialogContent>
              <Box sx={{ width: 300 }}>
                {/* Music Volume */}
                <Typography gutterBottom>Music</Typography>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ alignItems: "center", mb: 2 }}
                >
                  <VolumeDown />
                  <Slider
                    aria-label="Music Volume"
                    value={musicVolume}
                    onChange={handleMusicVolumeChange}
                  />
                  <VolumeUp />
                </Stack>

                {/* Sound Effect Volume */}
                <Typography gutterBottom>Sound Effect</Typography>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ alignItems: "center" }}
                >
                  <VolumeDown />
                  <Slider
                    aria-label="Sound Effect Volume"
                    value={soundEffectVolume}
                    onChange={handleSoundEffectVolumeChange}
                  />
                  <VolumeUp />
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSettingsClose}>Close</Button>
            </DialogActions>
          </Dialog>

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
