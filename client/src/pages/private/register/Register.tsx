import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// --- Design Theme ---
const registerTheme = {
  mainBg: "#f4f8fb",
  cardBg: "#fff",
  accent: "#1976d2", // Material Blue
  accentGradient: "linear-gradient(90deg, #1976d2 0%, #64b6f7 100%)",
  accentLight: "#e3f2fd",
  accentText: "#1976d2",
  inputBg: "#f4f8fb",
  button: "linear-gradient(90deg, #1976d2 0%, #64b6f7 100%)",
  buttonText: "#fff",
  border: "#e0eafc",
  success: "#43a047",
  error: "#e53935",
  shadow: "0px 4px 24px rgba(25, 118, 210, 0.08)",
};

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api/";

const roles = [
  { value: "cashier", label: "Cashier" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

const Register: React.FC = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "cashier",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: registerTheme.mainBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 80% 20%, #e3f2fd 30%, ${registerTheme.mainBg} 100%)`,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 370,
          background: registerTheme.cardBg,
          borderRadius: 4,
          boxShadow: registerTheme.shadow,
          border: `1px solid ${registerTheme.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mb: 2,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: registerTheme.accentGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://fonts.gstatic.com/s/i/materialiconsoutlined/person_add/v17/24px.svg"
            alt="Register"
            style={{ width: 34, height: 34, filter: "invert(1)" }}
          />
        </Box>
        <Typography
          variant="h5"
          align="center"
          mb={2}
          sx={{
            fontWeight: 700,
            color: registerTheme.accentText,
            letterSpacing: 1,
          }}
        >
          Create Account
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            name="first_name"
            label="First Name"
            fullWidth
            required
            margin="normal"
            value={form.first_name}
            onChange={handleChange}
            sx={{
              background: registerTheme.inputBg,
              borderRadius: 2,
            }}
          />
          <TextField
            name="last_name"
            label="Last Name"
            fullWidth
            required
            margin="normal"
            value={form.last_name}
            onChange={handleChange}
            sx={{
              background: registerTheme.inputBg,
              borderRadius: 2,
            }}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={handleChange}
            sx={{
              background: registerTheme.inputBg,
              borderRadius: 2,
            }}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={handleChange}
            sx={{
              background: registerTheme.inputBg,
              borderRadius: 2,
            }}
          />
          <TextField
            name="role"
            label="Role"
            select
            fullWidth
            margin="normal"
            value={form.role}
            onChange={handleChange}
            sx={{
              background: registerTheme.inputBg,
              borderRadius: 2,
            }}
          >
            {roles.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ my: 2 }}>
              Registration successful! Redirecting to login...
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              background: registerTheme.button,
              color: registerTheme.buttonText,
              fontWeight: 700,
              letterSpacing: 1,
              borderRadius: 2,
              boxShadow: registerTheme.shadow,
              "&:hover": {
                background: "#1565c0",
              },
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <Button
          fullWidth
          sx={{
            mt: 1,
            color: registerTheme.accentText,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 15,
            "&:hover": {
              background: registerTheme.accentLight,
            },
          }}
          component="a"
          href="/login"
        >
          Already have an account? Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;
