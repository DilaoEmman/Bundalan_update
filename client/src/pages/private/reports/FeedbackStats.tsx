import React, { useEffect, useState, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

// Helper: Choose the right API base URL depending on environment
const getApiUrl = (path: string) => {
  // Use full URL in dev, relative in prod (adjust as needed for your setup)
  if (import.meta.env.DEV) {
    // Try IPv4 localhost first (avoids ::1/IPv6 issues)
    return `http://127.0.0.1:8000${path}`;
  }
  // Production (served via proxy)
  return path;
};

const FeedbackStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(() => {
    fetch(getApiUrl("/api/v1/feedback/stats"))
      .then(res => {
        if (!res.ok) {
          // Optionally parse the error text for debugging
          return res.text().then(text => {
            throw new Error(text || `Server error: ${res.status}`);
          });
        }
        return res.json();
      })
      .then(data => {
        setStats(data);
        setError(null);
      })
      .catch(err => {
        // Detect ECONNREFUSED or similar network errors
        if (err.message.includes("Failed to fetch") || err.message.includes("ECONNREFUSED")) {
          setError(
            "Unable to connect to backend. Make sure your Laravel server is running on http://127.0.0.1:8000."
          );
        } else {
          setError("Failed to load feedback stats. " + (err.message || ""));
        }
        setStats(null);
      });
  }, []);

  useEffect(() => {
    fetchStats();
    // Listen for feedbackAdded event to refetch stats live
    window.addEventListener("feedbackAdded", fetchStats);
    return () => window.removeEventListener("feedbackAdded", fetchStats);
  }, [fetchStats]);

  if (error)
    return (
      <Box>
        <Typography color="error" sx={{ fontWeight: "bold" }}>
          {error}
        </Typography>
      </Box>
    );

  if (!stats) return <div>Loading...</div>;

  const chartData = {
    labels: stats.distribution.map((item: any) => `${item.rating} Stars`),
    datasets: [
      {
        label: "Number of Feedback",
        data: stats.distribution.map((item: any) => item.count),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h6">Customer Feedback Overview</Typography>
      <Typography>
        Average Rating: {stats.average !== null ? Number(stats.average).toFixed(2) : "N/A"} / 5
      </Typography>
      <Bar data={chartData} />
      <Typography>Total Feedback: {stats.count}</Typography>
    </Box>
  );
};

export default FeedbackStats;
