import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Rating, Paper } from "@mui/material";
import { useParams } from "react-router-dom"; // <-- ADD THIS

interface Feedback {
  id: number;
  order_id: number;
  rating: number;
  feedback: string;
  created_at: string;
}

const FeedbackPage: React.FC = () => {
  // Use useParams to get orderId from URL
  const { orderId } = useParams<{ orderId: string }>();
  const numericOrderId = Number(orderId);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numericOrderId) return;
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_API_URL}v1/surveys/${numericOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("_token")}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Could not fetch feedback!");
        }
        const data = await res.json();
        setFeedback(data);
      } catch (e: any) {
        setError(e.message || "Failed to load feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [numericOrderId]);

  if (!numericOrderId) return <Alert severity="error">Invalid order ID</Alert>;
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!feedback) return <Alert severity="info">No feedback found for this order.</Alert>;

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Feedback for Order #{feedback.order_id}
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="subtitle1" mr={1}>Rating:</Typography>
          <Rating value={feedback.rating} readOnly />
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Comments:
        </Typography>
        <Typography variant="body1">
          {feedback.feedback || <i>No comments provided.</i>}
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
          Submitted at: {new Date(feedback.created_at).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default FeedbackPage;
