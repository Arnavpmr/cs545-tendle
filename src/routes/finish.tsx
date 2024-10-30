import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const Finish: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { correctResponses, category, boardsCleared } = location.state;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <img
        src={logo}
        alt="Logo"
        style={{ width: "150px", marginBottom: "20px" }}
      />
      <Typography variant="h4" gutterBottom>
        Congratulations! You earned {correctResponses * 10} points by giving {correctResponses} correct responses and
        clearing {boardsCleared} {boardsCleared === 1 ? "board" : "boards"}!
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        <Button
          variant="contained"
          color="warning"
          sx={{
            fontSize: "1.25em",
            fontFamily: "Arial,Helvetica,sans-serif",
            fontWeight: "bold",
            textTransform: "none",
            marginBottom: 4,
          }}
          onClick={() => navigate("/category", { replace: true, state: { category } })}
        >
          Play Again
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{
            fontSize: "1.25em",
            fontFamily: "Arial,Helvetica,sans-serif",
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={() => navigate("/", { replace: true })}
        >
          Change Category
        </Button>
      </Box>
    </Box>
  );
};

export default Finish;
