import React, { useEffect } from "react";
import { Box, Typography, Grid, Paper, Avatar, Button } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Link } from "react-router-dom";
import { useStore } from "../../../store/rootStore";

export default function Dashboard() {
  const {
    rootStore: { alertStore },
  } = useStore();

  // Clear any lingering alerts when dashboard is mounted
  useEffect(() => {
    alertStore.close();
  }, [alertStore]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
          <FitnessCenterIcon />
        </Avatar>
        <Typography variant="h4" fontWeight={600}>
          Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PeopleIcon fontSize="large" color="primary" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Active Members
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              320
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <ShoppingCartIcon fontSize="large" color="secondary" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Products Sold (month)
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              1240
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <BarChartIcon fontSize="large" color="success" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Monthly Revenue
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              ₱210,000
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmojiEventsIcon fontSize="large" color="warning" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Personal Bests
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              42
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box>
        <Typography variant="h6" mb={2} align="center">
          Quick Actions
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/dashboard/customers"
            >
              Manage Members
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/dashboard/products"
            >
              Manage Products
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              component={Link}
              to="/dashboard/orders"
            >
              View Orders
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="warning"
              component={Link}
              to="/dashboard/reports"
            >
              View Reports
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
