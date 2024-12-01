import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Transition from "./Transition";
// Import tutorial images
import dummy1 from "../assets/dummy1.jpg";
import dummy2 from "../assets/dummy2.jpg";
import dummy3 from "../assets/dummy3.jpg";

const tutorialImages = [
  dummy1,
  dummy2,
  dummy3,
  // Add more imported images
];

interface TutorialProps {
  open: boolean;
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ open, onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? tutorialImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === tutorialImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={() => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: "black",
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <IconButton onClick={handlePrev}>
            <ArrowBackIosIcon />
          </IconButton>
          <img
            src={tutorialImages[currentImage]}
            alt={`Tutorial Image ${currentImage + 1}`}
            style={{ maxWidth: "80%", maxHeight: "60vh" }}
          />
          <IconButton onClick={handleNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;
