import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  Alert,
} from "@mui/material";
import { string } from "yup";

interface SurveyModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  onSubmitted?: () => void;
  customerId?: number; // Add this if you want to send customer_id
}

const SurveyModal: React.FC<SurveyModalProps> = ({
  open,
  onClose,
  orderId,
  onSubmitted,
  customerId,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}v1/surveys`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            customer_id: customerId, // only add if available
            rating,
            feedback, // <-- use "comment" instead of "feedback"
          }),
        }
      );
      if (response.ok) {
        setSubmitted(true);
        window.dispatchEvent(new Event("feedbackAdded"));
        if (onSubmitted) onSubmitted();
      } else if (response.status === 409) {
        setError("You have already submitted feedback for this order.");
      } else {
        setError("Failed to submit survey. Please try again.");
      }
    } catch (e) {
      setError("An error occurred while submitting your feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          minWidth: 340,
          maxWidth: 400,
          mx: "auto",
          my: "20vh",
        }}
      >
        {submitted ? (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              Thank you for your feedback!
            </Typography>
            <Button onClick={onClose} variant="contained" fullWidth>
              Close
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" align="center" gutterBottom>
              How satisfied are you with your experience?
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
              <Rating
                name="survey-rating"
                value={rating}
                onChange={(_, value) => setRating(value)}
                size="large"
              />
            </Box>
            <TextField
              label="Additional Comments (optional)"
              multiline
              minRows={2}
              fullWidth
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!rating || loading}
              onClick={handleSubmit}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default SurveyModal;
