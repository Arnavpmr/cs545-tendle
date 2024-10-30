import * as React from "react";
import { Box, Button, Paper, Typography, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import logo from "../assets/logo.png";
import heart from "../assets/heart.png";
import { styled } from "@mui/material/styles";

interface CategoryProps {
  onFinish: () => void;
}

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

const Category: React.FC<CategoryProps> = ({ onFinish }) => {
  const handleCheckAnswer = () => {
    // TODO: Add logic to check the user's answer
    // setShowFinishPage(true);
    onFinish();
  };

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
            Question text goes here
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" mr={1}>
            Lives:
          </Typography>
          {[...Array(3)].map((_, index) => (
            <img key={index} src={heart} alt="Heart" style={{ width: "4em" }} />
          ))}
        </Box>
      </Box>
      <Typography variant="h6" mb={2}>
        Streak: 0
      </Typography>
      <TextField
        variant="filled"
        label="Your Answer"
        fullWidth
        sx={{
          marginBottom: "20px",
          backgroundColor: "white",
          borderRadius: "4px",
        }}
      />
      <Button
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
      </Button>

      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8}}
        >
          {Array.from(Array(10)).map((_, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              <Item
                sx={{
                  fontSize: "1.5em",
                  color: "black",
                  textAlign: "left",
                }}
              >
                {index + 1}&#46;
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Category;
