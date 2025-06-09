import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { navItems } from "../../config/menu";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../../store/rootStore";
import { observer } from "mobx-react-lite";
import { Container } from "@mui/material";
import AppDialog from "../dialog/AppDialog";
import AppAlert from "../alert/AppAlert";

// --- Black bg navbar, gray font, white hover ---
const navbarTheme = {
  main: "#111111", // pure/near-black background
  text: "#e0e0e0", // light gray font
  hoverBg: "#fff", // hover: white background
  hoverText: "#111", // hover: black font
  shadow: "0px 4px 24px rgba(0,0,0,0.10)",
  activeFontWeight: 800, // bold for active
};

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

const allDropdownItems = [
  { label: "Customers", url: "/dashboard/customers" },
  { label: "Products", url: "/dashboard/products" },
  { label: "Orders", url: "/dashboard/orders" },
  { label: "Feedback", url: "/dashboard/feedback" },
  { label: "Reports", url: "/dashboard/reports" },
  { label: "Farewell Messages", url: "/dashboard/farewell-messages" },
];

const cashierDropdownItems = [
  { label: "Customers", url: "/dashboard/customers" },
  { label: "Orders", url: "/dashboard/orders" },
];

const registerItem = { label: "Register", url: "/dashboard/register" };

const BaseLayout = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Dropdown state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dropdownOpen = Boolean(anchorEl);

  const location = useLocation();

  const {
    rootStore: { authStore },
  } = useStore();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Dropdown handlers
  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    try {
      await authStore.logout();
    } catch (error) {
      console.log(error);
    }
  };

  const userRole = authStore.userRole || "";
  const isManagerOrAdmin = ["manager", "admin"].includes(userRole);
  const dashboardPath = `/dashboard/${userRole || "admin"}`;

  // Use cashier menu if cashier, otherwise all
  const dropdownItems =
    userRole === "cashier" ? cashierDropdownItems : allDropdownItems;

  // Only show register for admin
  const showRegister = userRole === "admin";

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  // Is any dropdown item active?
  const isAnyDropdownItemActive = dropdownItems.some((item) =>
    isActive(item.url)
  );

  // Drawer nav for mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <RouterLink
        to={dashboardPath}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Typography
          variant="h6"
          sx={{ my: 2, cursor: "pointer", color: navbarTheme.text }}
        >
          POS
        </Typography>
      </RouterLink>
      <Divider sx={{ borderColor: "#333" }} />
      <List>
        <ListItemButton
          sx={{
            textAlign: "center",
            color: isAnyDropdownItemActive
              ? navbarTheme.hoverText
              : navbarTheme.text,
            fontWeight: 600,
            bgcolor: isAnyDropdownItemActive ? navbarTheme.hoverBg : "inherit",
            "&:hover": {
              bgcolor: navbarTheme.hoverBg,
              color: navbarTheme.hoverText,
              fontWeight: navbarTheme.activeFontWeight,
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FitnessCenterIcon sx={{ mr: 1 }} />
                Menu
              </Box>
            }
          />
        </ListItemButton>
        {dropdownItems.map((item) => (
          <ListItemButton
            key={item.label}
            sx={{
              textAlign: "center",
              color: isActive(item.url)
                ? navbarTheme.hoverText
                : navbarTheme.text,
              fontWeight: isActive(item.url)
                ? navbarTheme.activeFontWeight
                : 400,
              bgcolor: isActive(item.url) ? navbarTheme.hoverBg : "inherit",
              "&:hover": {
                bgcolor: navbarTheme.hoverBg,
                color: navbarTheme.hoverText,
                fontWeight: navbarTheme.activeFontWeight,
              },
            }}
            component={RouterLink}
            to={item.url}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1, borderColor: "#333" }} />
        {/* Register link in Drawer */}
        {showRegister && (
          <ListItemButton
            sx={{
              textAlign: "center",
              color: isActive(registerItem.url)
                ? navbarTheme.hoverText
                : navbarTheme.text,
              fontWeight: isActive(registerItem.url)
                ? navbarTheme.activeFontWeight
                : 400,
              bgcolor: isActive(registerItem.url)
                ? navbarTheme.hoverBg
                : "inherit",
              "&:hover": {
                bgcolor: navbarTheme.hoverBg,
                color: navbarTheme.hoverText,
                fontWeight: navbarTheme.activeFontWeight,
              },
            }}
            component={RouterLink}
            to={registerItem.url}
          >
            <ListItemText primary={registerItem.label} />
          </ListItemButton>
        )}
        <ListItemButton
          sx={{
            textAlign: "center",
            color: navbarTheme.text,
            "&:hover": {
              bgcolor: navbarTheme.hoverBg,
              color: navbarTheme.hoverText,
              fontWeight: navbarTheme.activeFontWeight,
            },
          }}
          key={"logout"}
          onClick={logout}
        >
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        elevation={0}
        sx={{
          background: navbarTheme.main,
          color: navbarTheme.text,
          boxShadow: navbarTheme.shadow,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left: Dropdown */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Muscle Icon Dropdown for essential links */}
            <Button
              id="dropdown-menu-btn"
              aria-controls={dropdownOpen ? "dropdown-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={dropdownOpen ? "true" : undefined}
              onClick={handleDropdownOpen}
              sx={{
                color: isAnyDropdownItemActive
                  ? navbarTheme.hoverText
                  : navbarTheme.text,
                fontWeight: 600,
                borderRadius: 2,
                mr: 2,
                background: isAnyDropdownItemActive
                  ? navbarTheme.hoverBg
                  : "transparent",
                "&:hover": {
                  background: navbarTheme.hoverBg,
                  color: navbarTheme.hoverText,
                },
                textTransform: "none",
                minWidth: 48,
                px: 1.5,
              }}
              startIcon={<FitnessCenterIcon />}
              endIcon={<ArrowDropDownIcon />}
            >
              {/* No label, just icon */}
            </Button>
            <Menu
              id="dropdown-menu"
              anchorEl={anchorEl}
              open={dropdownOpen}
              onClose={handleDropdownClose}
              MenuListProps={{
                "aria-labelledby": "dropdown-menu-btn",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                "& .MuiPaper-root": {
                  bgcolor: navbarTheme.main,
                  color: navbarTheme.text,
                  minWidth: 180,
                },
              }}
            >
              {dropdownItems.map((item) => (
                <MenuItem
                  key={item.label}
                  component={RouterLink}
                  to={item.url}
                  onClick={handleDropdownClose}
                  selected={isActive(item.url)}
                  sx={{
                    fontWeight: isActive(item.url)
                      ? navbarTheme.activeFontWeight
                      : 400,
                    bgcolor: isActive(item.url)
                      ? navbarTheme.hoverBg
                      : "transparent",
                    color: isActive(item.url)
                      ? navbarTheme.hoverText
                      : navbarTheme.text,
                    "&.Mui-selected": {
                      bgcolor: navbarTheme.hoverBg + " !important",
                      color: navbarTheme.hoverText + " !important",
                    },
                    "&:hover": {
                      bgcolor: navbarTheme.hoverBg,
                      color: navbarTheme.hoverText,
                      fontWeight: navbarTheme.activeFontWeight,
                    },
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
            {/* Logo / Title */}
            <RouterLink
              to={dashboardPath}
              style={{ textDecoration: "none", color: navbarTheme.text }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  cursor: "pointer",
                  color: navbarTheme.text,
                  fontWeight: 800,
                  ml: 1,
                }}
              >
                Active Essentials
              </Typography>
            </RouterLink>
          </Box>

          {/* Right side: Register and Logout */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {showRegister && (
              <Button
                key="register"
                sx={{
                  color: isActive(registerItem.url)
                    ? navbarTheme.hoverText
                    : navbarTheme.text,
                  fontWeight: isActive(registerItem.url)
                    ? navbarTheme.activeFontWeight
                    : 600,
                  background: isActive(registerItem.url)
                    ? navbarTheme.hoverBg
                    : "transparent",
                  borderRadius: 2,
                  "&:hover": {
                    background: navbarTheme.hoverBg,
                    color: navbarTheme.hoverText,
                    fontWeight: navbarTheme.activeFontWeight,
                  },
                }}
                component={RouterLink}
                to={registerItem.url}
              >
                {registerItem.label}
              </Button>
            )}
            <Button
              key="logout"
              sx={{
                color: navbarTheme.text,
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  background: navbarTheme.hoverBg,
                  color: navbarTheme.hoverText,
                  fontWeight: navbarTheme.activeFontWeight,
                },
              }}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: navbarTheme.main,
              color: navbarTheme.text,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Container maxWidth="lg">
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
          <AppAlert />
          <Outlet />
          <AppDialog />
        </Box>
      </Container>
    </Box>
  );
};

export default observer(BaseLayout);
