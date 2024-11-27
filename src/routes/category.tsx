import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import topTenLists from "../data/topTenLists";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Paper,
  Slider,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import logo from "../assets/logo.png";
import heart from "../assets/heart.png";
import { styled } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SettingsIcon from "@mui/icons-material/Settings";

import { MusicContext } from "../sound/MusicContext";
import { SoundEffectsContext } from "../sound/SoundEffectsContext";
import menuButtonSound from "../sound/audio/menuButton.mp3";
import swapSound from "../sound/audio/swap.mp3";
import * as constants from "../constants";
import { VolumeDown, VolumeUp } from "@mui/icons-material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

// Transition component for the dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

type TopTenList = {
  question: string;
  answerList: string[];
  category: string;
};

const Category: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const topTenListsRef = useRef<TopTenList[]>([]);
  const [topTenListIndex, setTopTenListIndex] = useState<number | undefined>(
    undefined
  );
  const [currentAnswers, setCurrentAnswers] = useState<
    {
      answer: string;
      guessState: string;
      selected: boolean;
      readySwap: boolean;
    }[]
  >([]);

  const [numLives, setNumLives] = useState(constants.NUM_LIVES);

  const [swapEnabled, setSwapEnabled] = useState(false);
  const [continueEnabled, setContinueEnabled] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [numAnswersCorrect, setNumAnswersCorrect] = useState(0);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const { soundEffectVolume, setSoundEffectVolume, playSound } =
    useContext(SoundEffectsContext);
  const { musicVolume, setMusicVolume } = useContext(MusicContext);
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

  const { category } = location.state as { category: string };

  const shuffleArray = <T,>(arr: T[]) => {
    const newArray = [...arr]; // Create a copy of the array

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }

    return newArray;
  };

  const handleAnswerClicked = (i: number) => {
    setCurrentAnswers((prevCurrentAnswers) => {
      if (currentAnswers[i].guessState === "correct" || numLives === 0)
        return prevCurrentAnswers;

      const updatedAnswers = prevCurrentAnswers.map((answer, index) => {
        if (index === i) {
          return { ...answer, selected: !currentAnswers[i].selected };
        }
        return answer;
      });

      const numSelectedUpdated = updatedAnswers.filter(
        (answer) => answer.selected
      ).length;

      if (numSelectedUpdated > 2) return prevCurrentAnswers;

      if (numSelectedUpdated === 2) setSwapEnabled(true);
      else setSwapEnabled(false);

      return updatedAnswers;
    });
  };

  const handleSwapClicked = () => {
    // Play swap button sound
    playSound(swapSound);
    const selectedAnswersIndices = currentAnswers
      .map((answer, i) => (answer.selected ? i : -1))
      .filter((index) => index !== -1);

    const updatedAnswers = [...currentAnswers];

    updatedAnswers[selectedAnswersIndices[0]].readySwap = false;
    updatedAnswers[selectedAnswersIndices[1]].readySwap = false;
    // Update state to trigger zoom out
    setCurrentAnswers(updatedAnswers);

    setTimeout(() => {
      updatedAnswers[selectedAnswersIndices[0]].readySwap = true;
      updatedAnswers[selectedAnswersIndices[1]].readySwap = true;
      updatedAnswers[selectedAnswersIndices[0]].selected = false;
      updatedAnswers[selectedAnswersIndices[0]].guessState = "default";
      updatedAnswers[selectedAnswersIndices[1]].selected = false;
      updatedAnswers[selectedAnswersIndices[1]].guessState = "default";

      const temp = updatedAnswers[selectedAnswersIndices[0]];
      updatedAnswers[selectedAnswersIndices[0]] =
        updatedAnswers[selectedAnswersIndices[1]];
      updatedAnswers[selectedAnswersIndices[1]] = temp;

      setCurrentAnswers(updatedAnswers);
      setSwapEnabled(false);
    }, 500);
  };

  const handleSubmitClicked = () => {
    // Play menu button sound
    playSound(menuButtonSound);
    const correctAnswers =
      topTenListsRef.current[topTenListIndex || 0].answerList;
    const updatedAnswers = currentAnswers.map((answer, i) => {
      if (answer.answer === correctAnswers[i]) {
        return { ...answer, guessState: "correct", selected: false };
      } else {
        return { ...answer, guessState: "wrong", selected: false };
      }
    });

    const numCorrect = updatedAnswers.filter(
      (answer) => answer.guessState === "correct"
    ).length;

    if (numCorrect === constants.LIST_LENGTH) setContinueEnabled(true);
    else {
      setNumLives((prevNumLives) => {
        const updatedNumLives = prevNumLives - 1;

        if (updatedNumLives === 0) {
          setContinueEnabled(true);
          setSubmitEnabled(false);
        }

        return updatedNumLives;
      });
    }

    setCurrentAnswers(updatedAnswers);
  };

  const handleContinueClicked = () => {
    const numCorrect = currentAnswers.filter(
      (answer) => answer.guessState === "correct"
    ).length;
    // Play menu button sound
    playSound(menuButtonSound);
    if (topTenListIndex === constants.LISTS_PER_ROUND - 1)
      navigate("/finish", {
        state: {
          category: category,
          numAnswersCorrect: numAnswersCorrect + numCorrect,
        },
      });
    else {
      setNumAnswersCorrect(numAnswersCorrect + numCorrect);
      setCurrentAnswers(
        shuffleArray(
          topTenListsRef.current[topTenListIndex || 0 + 1].answerList
        ).map((answer) => ({
          answer: answer,
          guessState: "default",
          selected: false,
          readySwap: true,
        }))
      );
      setContinueEnabled(false);
      setNumLives(constants.NUM_LIVES);
      setTopTenListIndex((topTenListIndex || 0) + 1);
      setSubmitEnabled(true);
    }
  };

  useEffect(() => {
    console.log("loading data");
    console.log(category);
    topTenListsRef.current = shuffleArray(
      topTenLists.filter((list) => list.category === category)
    );

    setTopTenListIndex(0);

    if (topTenListsRef.current.length > 0)
      setCurrentAnswers(
        shuffleArray(topTenListsRef.current[0].answerList).map((answer) => ({
          answer: answer,
          guessState: "default",
          selected: false,
          readySwap: true,
        }))
      );
  }, [category]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        sx={{
          maxWidth: "500px",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "1em",
          marginTop: "2em",
          marginBottom: "2em",
        }}
      >
        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
          {topTenListsRef.current[topTenListIndex || 0]?.question}
        </Typography>
      </Box>

      {/* Settings button */}
      <Box display="flex" justifyContent="center" marginBottom="1.5em">
        <Button
          startIcon={<SettingsIcon />}
          variant="contained"
          color="warning"
          sx={{
            fontSize: "1em",
            fontFamily: "Arial,Helvetica,sans-serif",
            fontWeight: "bold",
            width: "175px",
          }}
          onClick={handleSettingsOpen}
        >
          Settings
        </Button>
      </Box>
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
            <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
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

      {/* Buttons to check answers and continue to next round */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <Button
          sx={{
            backgroundColor: "#de6143",
            color: "white",
            fontSize: "1em",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#c55030",
            },
          }}
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
          disabled={!submitEnabled}
          onClick={handleSubmitClicked}
        >
          Submit Answers
        </Button>
        <Button
          sx={{
            backgroundColor: "#de6143",
            fontSize: "1em",
            textTransform: "none",
            color: "white",
            "&:hover": {
              backgroundColor: "#c55030",
            },
          }}
          variant="contained"
          endIcon={<NavigateNextIcon />}
          disabled={!continueEnabled}
          onClick={handleContinueClicked}
        >
          Continue
        </Button>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={2}
        sx={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            flexShrink: 0, // Prevent the box from shrinking
            minWidth: "180px", // Ensure enough room for hearts
          }}
        >
          <Typography variant="h6" mr={1}>
            Lives:
          </Typography>
          {[...Array(constants.NUM_LIVES)].map((_, index) => (
            <Fade in={index < numLives} timeout={500} key={index} unmountOnExit>
              <img
                src={heart}
                alt="Heart"
                style={{ width: "2em", marginRight: "0.5em" }}
              />
            </Fade>
          ))}
        </Box>
      </Box>

      {/* Swap Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1em",
        }}
      >
        <Button
          startIcon={<SwapHorizIcon />}
          variant="contained"
          sx={{
            backgroundColor: "#de6143",
            color: "white",
            fontSize: "1em",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#c55030",
            },
          }}
          disabled={!swapEnabled}
          onClick={handleSwapClicked}
        >
          Swap
        </Button>
      </Box>

      {/* Grid of 10 answers, see https://mui.com/material-ui/react-grid2/ */}
      {/* Note: could not get MUI grid formatted properly with regular props.
          so used regular CSS */}
      <Box marginBottom={5}>
        <Grid
          container
          spacing={2}
          columns={2}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 2 equal columns
          }}
        >
          {currentAnswers.map((answer, i) => {
            return (
              <Grid key={i}>
                <Zoom
                  in={answer.readySwap}
                  timeout={1000}
                  // style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <Item
                    onClick={() => handleAnswerClicked(i)}
                    sx={{
                      fontSize: "1em",
                      backgroundColor: answer.selected
                        ? "#f6d365"
                        : answer.guessState === "default"
                        ? "white"
                        : answer.guessState === "wrong"
                        ? "error.main"
                        : "success.main",
                      color:
                        answer.guessState === "default" || answer.selected
                          ? "black"
                          : "white",
                      textAlign: "left",
                      minWidth: "100px",
                      maxWidth: "300px",
                      wordWrap: "break-word",
                      cursor:
                        answer.guessState !== "correct" ? "pointer" : "default",
                      "&:hover":
                        answer.guessState !== "correct"
                          ? {
                              boxShadow:
                                answer.guessState === "default" ||
                                answer.selected
                                  ? "0 0 5px black"
                                  : "0 0 5px white",
                              border:
                                answer.guessState === "default" ||
                                answer.selected
                                  ? "1px solid black"
                                  : "1px solid white",
                            }
                          : {},
                    }}
                  >
                    {i + 1}. {answer.answer}
                  </Item>
                </Zoom>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box display="flex" justifyContent="center">
        <img src={logo} alt="Logo" style={{ width: "150px" }} />
      </Box>
    </Box>
  );
};

export default Category;
