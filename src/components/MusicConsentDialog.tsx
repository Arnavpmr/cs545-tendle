import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Transition from "./Transition";
import { DialogActions, DialogContent, Typography } from "@mui/material";

interface MusicConsentDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const MusicConsentDialog: React.FC<MusicConsentDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="music-consent-dialog-title"
    >
      <DialogTitle id="music-consent-dialog-title">
        Play Background Music
      </DialogTitle>
      <DialogContent>
        <Typography>Would you like to enable background music?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Yes</Button>
        <Button onClick={onCancel}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MusicConsentDialog;
