import {
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Box,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import React from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This is required")
    .email("This is an invalid email"),
  password: yup
    .string()
    .required("This is required")
    .min(4, "Minimum length should be 4 characters"),
});

const Login = observer(() => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    rootStore: { authStore },
  } = useStore();

  const [loginError, setLoginError] = React.useState<string | null>(null);

  // Always destructure the observables here to trigger mobx reactivity.
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.userRole;
  const isLoading = authStore.isLoading;

  // Clear error on successful auth
  React.useEffect(() => {
    if (isAuthenticated) {
      setLoginError(null);
    }
  }, [isAuthenticated]);

  // Show loading if auth state is being determined
  if (isLoading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "#232323", // matches the side color of your screenshot
        }}
      >
        <CircularProgress color="primary" size={48} />
      </Box>
    );
  }

  // Redirect based on role if authenticated
  if (isAuthenticated) {
    if (userRole === "admin") return <Navigate to="/dashboard/admin" replace />;
    if (userRole === "manager")
      return <Navigate to="/dashboard/manager" replace />;
    if (userRole === "cashier")
      return <Navigate to="/dashboard/cashier" replace />;
    return <Navigate to="/dashboard/customers" replace />;
  }

  const onSubmit = async (data: any) => {
    setLoginError(null);
    try {
      await authStore.login({
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      setLoginError(
        err?.message ||
          "Login failed. Please check your email and password and try again."
      );
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "#232323", // matches the color of the right and left side
      }}
    >
      <Card
        elevation={3}
        sx={{
          minWidth: 400,
          maxWidth: 420,
          width: "100%",
          p: 2,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{ bgcolor: "primary.main", width: 56, height: 56, mb: 1 }}
            >
              <FitnessCenterIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={600} mb={1}>
              Active Essentials
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={1}>
              Sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {loginError && (
              <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                {loginError}
              </Alert>
            )}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  autoComplete="email"
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  autoComplete="current-password"
                  {...field}
                />
              )}
            />
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              fullWidth
              size="large"
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
});

export default Login;
