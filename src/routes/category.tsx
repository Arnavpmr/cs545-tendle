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
}

const Category: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const topTenListsRef = useRef<TopTenList[]>([]);
  const [topTenListIndex, setTopTenListIndex] = useState<number | undefined>(undefined);
  const [guessedAnswers, setGuessedAnswers] = useState<boolean[]>(Array.from(Array(constants.LIST_LENGTH), () => false));

  const [numLives, setNumLives] = useState(constants.NUM_LIVES);
  const [streak, setStreak] = useState(0);

  const [correctResponses, setCorrectResponses] = useState(0);
  const [boardsCleared, setBoardsCleared] = useState(0);

  const {category} = location.state as {category: string};

  const handleGuess = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const guess = (event.target as HTMLInputElement).value.trim().toLowerCase();
      if (guess === "") return;

      const answerList = topTenListsRef.current[topTenListIndex || 0]?.answerList
      .map(answer => answer.toLowerCase());
      const answerLoc = answerList.indexOf(guess);

      if (answerLoc !== -1) {
        if (guessedAnswers[answerLoc]) return;

        const newAnswers = [...guessedAnswers];
        newAnswers[answerLoc] = true;
        setGuessedAnswers(newAnswers);

        setCorrectResponses(correctResponses + 1);
        setStreak(streak + 1);

        if (!newAnswers.includes(false) && topTenListIndex !== undefined) {
          if (boardsCleared >= constants.LISTS_PER_ROUND - 1)
            navigate("/finish",
            {state: {correctResponses: correctResponses + 1,
            boardsCleared: boardsCleared + 1, category}});

          setBoardsCleared(boardsCleared + 1);
          setTopTenListIndex(topTenListIndex + 1);
          setGuessedAnswers(Array.from(Array(constants.LIST_LENGTH), () => false));
          setNumLives(constants.NUM_LIVES);
        }
      } else {
          if (numLives <= 1)
            navigate("/finish", {state: {correctResponses, boardsCleared, category}});

          setStreak(0);
          setNumLives(numLives - 1);
      }

      (event.target as HTMLInputElement).value = "";
    }
  }

  useEffect(() => {
    topTenListsRef.current = topTenLists.filter(list => list.category === category);
    setTopTenListIndex(0);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box display="flex" alignItems="center" mb={4}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: "100px", marginRight: "2em" }}
        />
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "10px",
            flexGrow: 1,
            marginRight: "20px",
          }}
        >
          <Typography variant="h6" sx={{ color: "black" }}>
            {topTenListsRef.current[topTenListIndex || 0]?.question}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" mr={1}>
            Lives:
          </Typography>
          {[...Array(numLives)].map((_, index) => (
            <img key={index} src={heart} alt="Heart" style={{ width: "4em" }} />
          ))}
        </Box>
      </Box>
      <Typography variant="h6" mb={2}>
        Streak: {streak}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8}}
        >
          {Array.from(Array(constants.LIST_LENGTH)).map((_, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              <Item
                sx={{
                  fontSize: "1.5em",
                  color: "black",
                  textAlign: "left",
                }}
              >
                {index + 1}&#46;
                {guessedAnswers[index] && 
                " " + topTenListsRef.current[topTenListIndex || 0]?.answerList[index]}
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
      <TextField
        variant="filled"
        label="Your Guess"
        fullWidth
        onKeyUp={handleGuess}
        sx={{
          marginBottom: "20px",
          backgroundColor: "white",
          borderRadius: "4px",
        }}
      />
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
