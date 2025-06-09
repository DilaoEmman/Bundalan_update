import React, { useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Divider,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useFeedbacks } from "../hooks/seFeedbacks";

const FeedbackListPage: React.FC = () => {
  const { feedbacks, loading, error, fetchFeedbacks } = useFeedbacks();

  useEffect(() => {
    fetchFeedbacks();
    // Listen for feedbackAdded event
    window.addEventListener("feedbackAdded", fetchFeedbacks);
    return () => window.removeEventListener("feedbackAdded", fetchFeedbacks);
  }, [fetchFeedbacks]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          width: "100%",
          boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "info.main",
              width: 48,
              height: 48,
              mr: 2,
              boxShadow: 2,
            }}
          >
            <EmojiEmotionsIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={600} color="info.main">
            Feedback List
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {feedbacks.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No feedback entries found.
          </Typography>
        ) : (
          <Table
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              "& th": {
                bgcolor: "info.light",
                color: "info.contrastText",
                fontWeight: "bold",
                fontSize: 16,
              },
              "& tbody tr:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((fb) => (
                <TableRow key={fb.id}>
                  <TableCell>{fb.order_id}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        bgcolor: "info.lighter",
                        color: "info.dark",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        display: "inline-block",
                        fontWeight: 500,
                      }}
                    >
                      {fb.rating}
                    </Box>
                  </TableCell>
                  <TableCell>{fb.feedback}</TableCell>
                  <TableCell>
                    {new Date(fb.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default FeedbackListPage;
