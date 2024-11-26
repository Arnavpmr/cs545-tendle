import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import topTenLists from "../data/topTenLists";
import { Box, Button, Fade, Paper, Typography, Zoom } from "@mui/material";
import Grid from "@mui/material/Grid2";
import logo from "../assets/logo.png";
import heart from "../assets/heart.png";
import { styled } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { SoundEffectsContext } from "../sound/SoundEffectsContext";
import menuButtonSound from "../sound/audio/menuButton.mp3";
import swapSound from "../sound/audio/swap.mp3";
import * as constants from "../constants";

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

  const { playSound } = useContext(SoundEffectsContext);

  const topTenListsRef = useRef<TopTenList[]>([]);
  const [topTenListIndex, setTopTenListIndex] = useState<number | undefined>(
    undefined
  );
  const [currentAnswers, setCurrentAnswers] = useState<
    { answer: string; guessState: string; selected: boolean }[]
  >([]);

  const [numLives, setNumLives] = useState(constants.NUM_LIVES);

  const [swapEnabled, setSwapEnabled] = useState(false);
  const [continueEnabled, setContinueEnabled] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [boardsCleared, setBoardsCleared] = useState(0);

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
    // Play menu button sound
    playSound(menuButtonSound);
    if (numLives === 0)
      navigate("/finish", {
        state: { category: category, boardsCleared: boardsCleared },
      });
    else if (topTenListIndex === constants.LISTS_PER_ROUND - 1)
      navigate("/finish", {
        state: { category: category, boardsCleared: boardsCleared + 1 },
      });
    else {
      setCurrentAnswers(
        shuffleArray(
          topTenListsRef.current[topTenListIndex || 0 + 1].answerList
        ).map((answer) => ({
          answer: answer,
          guessState: "default",
          selected: false,
        }))
      );
      setContinueEnabled(false);
      setNumLives(constants.NUM_LIVES);
      setBoardsCleared(boardsCleared + 1);
      setTopTenListIndex((topTenListIndex || 0) + 1);
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
            if (answer.guessState === "correct")
              return (
                <Grid key={i}>
                  <Item
                    onClick={() => handleAnswerClicked(i)}
                    sx={{
                      fontSize: "1em",
                      color: "white",
                      textAlign: "left",
                      minWidth: "100px",
                      maxWidth: "300px",
                      wordWrap: "break-word",
                      backgroundColor: "success.main",
                    }}
                  >
                    {i + 1}. {answer.answer}
                  </Item>
                </Grid>
              );

            if (answer.selected)
              return (
                <Grid key={i}>
                  <Item
                    onClick={() => handleAnswerClicked(i)}
                    sx={{
                      fontSize: "1em",
                      color: "black",
                      textAlign: "left",
                      minWidth: "100px",
                      maxWidth: "300px",
                      wordWrap: "break-word",
                      backgroundColor: "#f6d365",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0 0 5px black",
                        border: "1px solid black",
                      },
                    }}
                  >
                    {i + 1}. {answer.answer}
                  </Item>
                </Grid>
              );

            if (answer.guessState === "default")
              return (
                <Grid key={i}>
                  <Zoom
                    in={true}
                    timeout={1000}
                    // style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <Item
                      onClick={() => handleAnswerClicked(i)}
                      sx={{
                        fontSize: "1em",
                        color: "black",
                        textAlign: "left",
                        minWidth: "100px",
                        maxWidth: "300px",
                        wordWrap: "break-word",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "0 0 5px black",
                          border: "1px solid black",
                        },
                      }}
                    >
                      {i + 1}. {answer.answer}
                    </Item>
                  </Zoom>
                </Grid>
              );

            if (answer.guessState === "wrong")
              return (
                <Grid key={i}>
                  <Item
                    onClick={() => handleAnswerClicked(i)}
                    sx={{
                      fontSize: "1em",
                      color: "white",
                      textAlign: "left",
                      minWidth: "100px",
                      maxWidth: "300px",
                      wordWrap: "break-word",
                      backgroundColor: "error.main",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0 0 5px white",
                        border: "1px solid white",
                      },
                    }}
                  >
                    {i + 1}. {answer.answer}
                  </Item>
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
