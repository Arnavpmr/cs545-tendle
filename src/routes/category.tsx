import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import topTenLists from "../data/topTenLists";
import { Box, Paper, Typography, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import logo from "../assets/logo.png";
import heart from "../assets/heart.png";
import { styled } from "@mui/material/styles";

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

  const topTenListsRef = useRef<TopTenList[]>([]);
  const [topTenListIndex, setTopTenListIndex] = useState<number | undefined>(
    undefined
  );
  const [answers, setAnswers] = useState<boolean[]>(
    Array.from(Array(constants.LIST_LENGTH), () => false)
  );

  const [numLives, setNumLives] = useState(constants.NUM_LIVES);
  const [streak, setStreak] = useState(0);

  const [correctResponses, setCorrectResponses] = useState(0);
  const [boardsCleared, setBoardsCleared] = useState(0);

  const { category } = location.state as { category: string };

  const handleGuess = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const guess = (event.target as HTMLInputElement).value
        .trim()
        .toLowerCase();
      const answerList = topTenListsRef.current[
        topTenListIndex || 0
      ]?.answerList.map((answer) => answer.toLowerCase());
      const answerLoc = answerList.indexOf(guess);

      if (answerLoc !== -1) {
        if (answers[answerLoc]) return;

        const newAnswers = [...answers];
        newAnswers[answerLoc] = true;
        setAnswers(newAnswers);

        setCorrectResponses(correctResponses + 1);

        setStreak(streak + 1);

        if (!newAnswers.includes(false) && topTenListIndex !== undefined) {
          if (boardsCleared >= constants.LISTS_PER_ROUND - 1)
            navigate("/finish", {
              state: {
                correctResponses: correctResponses + 1,
                boardsCleared: boardsCleared + 1,
                category,
              },
            });

          setBoardsCleared(boardsCleared + 1);
          setTopTenListIndex(topTenListIndex + 1);
          setAnswers(Array.from(Array(constants.LIST_LENGTH), () => false));
          setNumLives(constants.NUM_LIVES);
        }
      } else {
        if (numLives <= 1)
          navigate("/finish", {
            state: { correctResponses, boardsCleared, category },
          });

        setStreak(0);
        setNumLives(numLives - 1);
      }

      (event.target as HTMLInputElement).value = "";
    }
  };

  useEffect(() => {
    topTenListsRef.current = topTenLists.filter(
      (list) => list.category === category
    );
    setTopTenListIndex(0);
  }, []);

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

      {/* User input */}
      <TextField
        variant="filled"
        label="Your Guess"
        onKeyUp={handleGuess}
        sx={{
          marginBottom: "20px",
          backgroundColor: "white",
          borderRadius: "4px",
          minWidth: "300px",
        }}
      />

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
        <Typography variant="h6" mr={3}>
          Streak: {streak}
        </Typography>
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
          {[...Array(numLives)].map((_, index) => (
            <img key={index} src={heart} alt="Heart" style={{ width: "2em" }} />
          ))}
        </Box>
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
          {Array.from(Array(constants.LIST_LENGTH)).map((_, index) => (
            <Grid key={index}>
              <Item
                sx={{
                  fontSize: "1.5em",
                  color: "black",
                  textAlign: "left",
                  minWidth: "100px",
                }}
              >
                {index + 1}.{" "}
                {answers[index] &&
                  topTenListsRef.current[topTenListIndex || 0]?.answerList[
                    index
                  ]}
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box display="flex" justifyContent="center">
        <img src={logo} alt="Logo" style={{ width: "150px" }} />
      </Box>

      {/* <Button
        variant="contained"
        sx={{
          backgroundColor: "#FB8500",
          fontSize: "1.25em",
          fontFamily: "Arial,Helvetica,sans-serif",
          fontWeight: "bold",
          marginBottom: 4,
        }}
        onClick={handleCheckAnswer}
      >
        Check
      </Button> */}
    </Box>
  );
};

export default Category;
