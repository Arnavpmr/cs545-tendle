import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import logo from "../assets/logo.png";
import heart from "../assets/heart.png";

interface CategoryProps {
  onFinish: () => void;
}

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
      <TableContainer sx={{ backgroundColor: "black", marginBottom: 2 }}>
        <Table>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(2)].map((_, colIndex) => (
                  <TableCell key={colIndex} sx={{ color: "white" }}>
                    {rowIndex * 2 + colIndex + 1}.
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Category;
