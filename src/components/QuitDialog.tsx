import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Transition from "./Transition";
import { DialogActions, DialogContent, Typography } from "@mui/material";

interface ExitDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const QuitDialog: React.FC<ExitDialogProps> = ({
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
      aria-labelledby="quit-dialog-title"
    >
      <DialogTitle id="quit-dialog-title">Quit Game</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to quit Tendle?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          NO
        </Button>
        <Button onClick={onConfirm} color="primary">
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuitDialog;
