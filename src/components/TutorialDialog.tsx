import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Transition from "./Transition";
// Import tutorial images
const tutorialImages = import.meta.glob("../assets/tutorial/*.jpg", {
  eager: true,
});
const tutorialCaptions = [
  "Click 'Play' to start.",
  "Select a question category from the dropdown.",
  "Go to the Settings page.",
  "This is the Game page. Rank the items in the correct order from greatest to least.",
  "Press 'Quit' to return to the main menu.",
  "Swap items: Select the first one.",
  "Swap items: Select the second one.",
  "Swap items: Confirm the swap.",
  "Click 'Submit Answers' to check your list.",
  "Results: Incorrect spots are red, correct spots are green.",
  "You have 3 lives to play.",
  "Swap items until you run out of lives.",
  "When ready, click 'Continue' to proceed.",
  "Click 'Reveal Answers' to see the solution.",
  "Final Score is shown on the End Screen.",
  "This is the End Screen Page. To play again, click 'Play Again.'",
  "This is the End Screen Page. To change categories, click 'Change Category.'",
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
      fullScreen
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
        <CloseIcon sx={{ fontSize: 50 }} />
      </IconButton>

      {/* Arrow navigation */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingTop={10}
      >
        <IconButton
          aria-label="move to previous tutorial image"
          onClick={handlePrev}
          sx={{ marginRight: 1, color: "black" }}
        >
          <ArrowCircleLeftIcon sx={{ fontSize: 50 }} />
        </IconButton>
        <IconButton
          aria-label="move to next tutorial image"
          onClick={handleNext}
          sx={{ marginLeft: 1, color: "black" }}
        >
          <ArrowCircleRightIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </Box>

      {/* Dialog Title Below Arrows */}
      <Box>
        <DialogTitle textAlign="center" sx={{ textAlign: "center" }}>
          {tutorialCaptions[currentImage]}
        </DialogTitle>
      </Box>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <img
            src={
              (
                tutorialImages[
                  `../assets/tutorial/tutorial${currentImage + 1}.jpg`
                ] as { default: string }
              ).default
            }
            alt={`Tutorial Image ${currentImage + 1}`}
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "600px", // Fixed max width
              maxHeight: "600px", // Fixed max height
              objectFit: "contain", // Maintain aspect ratio
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;
