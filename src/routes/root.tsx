import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import logo from "../assets/logo.png";

import * as constants from "../constants";

const Root: React.FC = () => {
  const [category, setCategory] = useState("General Knowledge");
  const navigate = useNavigate();

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
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
        <img
          src={logo}
          alt="Logo"
          style={{ width: "250px", marginBottom: "20px" }}
        />
          <Typography variant="h4" gutterBottom>
            Try to guess the top 10 items in a category!
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
              {constants.CATEGORIES.map((category) =>
                <MenuItem key={category} value={category}>{category}</MenuItem>)
              }
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
            onClick={() => navigate(`/category`, {replace: true, state: { category }})}
          >
            Play
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Root;