import React, { useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useFeedbacks } from "../hooks/seFeedbacks";

const ReportsPage: React.FC = () => {
  const { feedbacks, loading, error, fetchFeedbacks } = useFeedbacks();

  useEffect(() => {
    fetchFeedbacks();
    window.addEventListener("feedbackAdded", fetchFeedbacks);
    return () => window.removeEventListener("feedbackAdded", fetchFeedbacks);
  }, [fetchFeedbacks]);

  // Debug: See what feedbacks you get
  console.log("Feedbacks from API:", feedbacks);

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        ).toFixed(2)
      : "N/A";

  const histogram = [1, 2, 3, 4, 5].map(
    (rating) => feedbacks.filter((f) => f.rating === rating).length
  );

  const chartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Number of Feedback",
        data: histogram,
        backgroundColor: "rgba(127,210,214,0.8)",
      },
    ],
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Customer Feedback Report
        </Typography>
        <Typography align="center">
          Customer Feedback Overview
        </Typography>
        <Typography align="center" sx={{ mt: 1 }}>
          Average Rating: {averageRating} / 5
        </Typography>
        <Bar data={chartData} />
        <Typography align="center" sx={{ mt: 2 }}>
          Total Feedback: {feedbacks.length}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportsPage;
