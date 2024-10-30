import * as React from "react";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import Category from "./category";
import Finish from "./finish";
import logo from "../assets/logo.png";

const Root: React.FC = () => {
  const [showCategoryPage, setShowCategoryPage] = useState(false);
  const [showFinishPage, setShowFinishPage] = useState(false);
  const [category, setCategory] = useState("General Knowledge");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handlePlayAgain = () => {
    // TODO: need different logic
    setShowFinishPage(false);
    setShowCategoryPage(true);
  };

  const handleChangeCategory = () => {
    setShowFinishPage(false);
    setShowCategoryPage(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#219EBC",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          {showFinishPage ? (
             <Finish onPlayAgain={handlePlayAgain} onChangeCategory={handleChangeCategory} />
          ) : showCategoryPage ? (
            <Category onFinish={() => setShowFinishPage(true)} />
          ) : (
            <>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "250px", marginBottom: "20px" }}
              />
              <Typography variant="h4" gutterBottom>
                Try to guess the top 10 items in a category.
              </Typography>
              <Typography variant="h6" gutterBottom>
                Select a category:
              </Typography>
              <FormControl
                variant="filled"
                sx={{
                  marginBottom: "1em",
                  minWidth: 200,
                  backgroundColor: "white",
                }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="General Knowledge">General Knowledge</MenuItem>
                  <MenuItem value="Music">Music</MenuItem>
                  <MenuItem value="Movies">Movies</MenuItem>
                  <MenuItem value="Geography">Geography</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="warning"
                sx={{
                  fontSize: "1.25em",
                  fontFamily: "Arial,Helvetica,sans-serif",
                  fontWeight: "bold",
                }}
                onClick={() => setShowCategoryPage(true)}
              >
                Play
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Root;