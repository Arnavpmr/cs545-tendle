import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, Box, DialogContentText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Transition from "./Transition";
// Import tutorial images
const tutorialImages = import.meta.glob("../assets/tutorial/*.jpg", { eager: true });
const tutorialCaptions = [
  "Click Play to start!",
  "Click on the dropdown to choose your category!",
  "Game Page",
  "Press Quit to return to the main menu!",
  "How to Swap (Select One)",
  "How to Swap (Select Two)",
  "How to Swap (Confirm Swap)",
  "Confirm Selection",
  "Swapped Result - Incorrect spots in RED, and correct spots in GREEN",
  "You have 3 chances. 3 Lives",
  "You can continue to swap items until you run out of lives!",
  "When prompted, the continue button will be available",
  "Settings",
  "Reveal Answers” - Click on “Submit Answers” to check your list!",
  "End Screen” (Score) “Final Score is displayed here!",
  "End Screen” (Play again) “To retry, Hit 'Play Again'",
  "End Screen” (Return to Menu) “To leave and return to the main menu, Hit 'Change Category'"
];

interface TutorialProps {
  open: boolean;
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ open, onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? Object.keys(tutorialImages).length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === Object.keys(tutorialImages).length - 1 ? 0 : prev + 1
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
        <DialogContentText>{tutorialCaptions[currentImage]}</DialogContentText>
        <Box display="flex" alignItems="center" justifyContent="center">
          <IconButton onClick={handlePrev}>
            <ArrowBackIosIcon />
          </IconButton>
          <img
            src={(tutorialImages[`../assets/tutorial/tutorial${currentImage + 1}.jpg`] as { default: string }).default}
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
