import React from "react";
import { Typography, Box } from "@mui/material";

// Now expects a message prop!
const FarewellMessageDisplay: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <Box sx={{ mt: 3, mb: 3, textAlign: "center" }}>
      <Typography variant="h6" color="primary">
        {message}
      </Typography>
    </Box>
  );
};

export default FarewellMessageDisplay;
