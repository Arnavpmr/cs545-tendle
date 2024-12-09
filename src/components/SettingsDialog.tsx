import React, { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { MusicContext } from "../sound/MusicContext";
import { SoundEffectsContext } from "../sound/SoundEffectsContext";
import Transition from "./Transition";
import {
  Box,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { VolumeDown, VolumeUp } from "@mui/icons-material";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { soundEffectVolume, setSoundEffectVolume } =
    useContext(SoundEffectsContext);
  const { musicVolume, setMusicVolume } = useContext(MusicContext);

  const handleMusicVolumeChange = (_: Event, newValue: number | number[]) => {
    setMusicVolume(newValue as number);
  };
  const handleSoundEffectVolumeChange = (
    _: Event,
    newValue: number | number[]
  ) => {
    setSoundEffectVolume(newValue as number);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="settings-dialog-title"
    >
      <DialogTitle id="settings-dialog-title">Volume</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: {
              xs: 200, // Mobile devices
              sm: 300, // Tablets
              md: 300, // Small laptops/desktops
              lg: 300, // Larger desktops
            },
          }}
        >
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
              sx={{ width: "100%", maxWidth: "300px" }}
            />
            <VolumeUp />
          </Stack>

          {/* Sound Effect Volume */}
          <Typography gutterBottom>Sound Effect</Typography>
          <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
            <VolumeDown />
            <Slider
              aria-label="Sound Effect Volume"
              value={soundEffectVolume}
              onChange={handleSoundEffectVolumeChange}
              sx={{ width: "100%", maxWidth: "300px" }}
            />
            <VolumeUp />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
