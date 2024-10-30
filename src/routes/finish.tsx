import * as React from "react";
import { Box, Typography, Button } from "@mui/material";
import logo from "../assets/logo.png";

// Callback functions for the parent component in root.tsx
// Which are handled with the handle functions in root.tsx
interface FinishProps {
  onPlayAgain: () => void;
  onChangeCategory: () => void;
}

const Finish: React.FC<FinishProps> = ({ onPlayAgain, onChangeCategory }) => {
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
        Congratulations! You earned X points by giving Y correct responses and
        clearing Z boards.
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
          onClick={onPlayAgain}
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
          onClick={onChangeCategory}
        >
          Change Category?
        </Button>
      </Box>
    </Box>
  );
};

export default Finish;
