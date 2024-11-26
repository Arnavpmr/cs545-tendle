import { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { SoundEffectsContext } from "../sound/SoundEffectsContext";
import menuButtonSound from "../sound/audio/menuButton.mp3";

const Finish: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, boardsCleared } = location.state;
  const { playSound } = useContext(SoundEffectsContext);

  const handleCategoryClick = () => {
    playSound(menuButtonSound);
    navigate("/", { replace: true });
    
  };

  const handlePlayAgainClick = () => {
    playSound(menuButtonSound);
    navigate("/category", { replace: true, state: { category } });
  };

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
      {/* TODO: print point system like 10 pts per correct answer? */}
      <Typography variant="h4" gutterBottom>
        You cleared {boardsCleared} {boardsCleared === 1 ? "board" : "boards"}.
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
          onClick={handlePlayAgainClick}
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
          onClick={handleCategoryClick}
        >
          Change Category
        </Button>
      </Box>
    </Box>
  );
};

export default Finish;
