import React from "react";
import { useStore } from "../../../store/rootStore";
import { Navigate } from "react-router-dom";
import { Box, Paper, Typography, Divider, Avatar, Grid } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ProductPerformanceChart from "./ProductPerformanceChart";
import FeedbackStats from "./FeedbackStats";

const ReportsDashboard = () => {
  const {
    rootStore: { authStore }
  } = useStore();

  const isManagerOrAdmin = ["manager", "admin"].includes(authStore.userRole || "");

  if (!isManagerOrAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          py: { xs: 3, sm: 5 },
          px: { xs: 1, sm: 3 }
        }}
      >
        {/* Dashboard Title */}
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            mb: 4,
            boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
            background: "#fff"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              flexWrap: "wrap"
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 54,
                height: 54,
                mr: 2,
                boxShadow: 2
              }}
            >
              <AssessmentIcon fontSize="large" />
            </Avatar>
            <Typography variant="h3" fontWeight={700} color="primary.main">
              Reports Dashboard
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            View business reports, product performance, and customer feedback insights.
          </Typography>
        </Paper>

        {/* Side by Side Section */}
        <Grid container spacing={4}>
          {/* Top Product Performance */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                background: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.04)"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  justifyContent: "flex-start"
                }}
              >
                <Avatar sx={{ bgcolor: "warning.main", mr: 2, width: 40, height: 40 }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  Top Product Performance
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <ProductPerformanceChart />
              </Box>
            </Paper>
          </Grid>

          {/* Customer Feedback */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 4,
                background: "#fff",
                boxShadow: "0 4px 16px 0 rgba(0,0,0,0.04)"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  justifyContent: "flex-start"
                }}
              >
                <Avatar sx={{ bgcolor: "success.main", mr: 2, width: 40, height: 40 }}>
                  <EmojiEmotionsIcon />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  Customer Feedback
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <FeedbackStats />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ReportsDashboard;
