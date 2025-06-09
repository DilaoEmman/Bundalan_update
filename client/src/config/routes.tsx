import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Login from "../pages/guest/Login";
import Customers from "../pages/private/customers";
import BaseLayout from "../components/layouts/BaseLayout";
import PrivateRoute from "../middleware/PrivateRoute";
import CustomerList from "../pages/private/customers/list";
import CustomerCreate from "../pages/private/customers/create";
import CustomerEdit from "../pages/private/customers/edit";
import Products from "../pages/private/products";
import ProductList from "../pages/private/products/list";
import ProductCreate from "../pages/private/products/create";
import ProductEdit from "../pages/private/products/edit";
import Orders from "../pages/private/orders";
import OrderCreate from "../pages/private/orders/create";
import OrderList from "../pages/private/orders/list";
import OrderView from "../pages/private/orders/view";
import RoleRoute from "../middleware/RoleRoute";
import RoleBasedDashboardRedirect from "../pages/private/RoleBasedDashboardRedirect";
import ReportsDashboard from "../pages/private/reports/ReportsDashboard";
import ProductPerformanceChart from "../pages/private/reports/ProductPerformanceChart";
import FeedbackPage from "../pages/private/feedback/FeedbackPage";
import FeedbackListPage from "../pages/private/feedback/FeedbackListPage";
import FarewellMessageAdmin from "../components/farewell/FarewellMessageAdmin";
import Dashboard from "../pages/private/dashboard/Dashboard";
import Register from "../pages/private/register/Register";

const routes = [
  { path: "/", element: <Navigate to="login" /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: <PrivateRoute element={<BaseLayout />} />,
    children: [
      { path: "", element: <RoleBasedDashboardRedirect /> },
      // --- Dashboards ---
      {
        path: "admin",
        element: (
          <RoleRoute roles={["admin"]}>
            <Dashboard />
          </RoleRoute>
        ),
      },
      {
        path: "manager",
        element: (
          <RoleRoute roles={["manager"]}>
            <Dashboard />
          </RoleRoute>
        ),
      },
      {
        path: "cashier",
        element: (
          <RoleRoute roles={["cashier"]}>
            <Dashboard />
          </RoleRoute>
        ),
      },
      // --- Reports: Only admin and manager can view ---
      {
        path: "reports",
        element: (
          <RoleRoute roles={["admin", "manager"]}>
            <ReportsDashboard />
          </RoleRoute>
        ),
        children: [
          {
            path: "product-performance",
            element: (
              <RoleRoute roles={["admin", "manager"]}>
                <ProductPerformanceChart />
              </RoleRoute>
            ),
          },
        ],
      },
      // --- Customers: All roles can view, only admin can create/edit ---
      {
        path: "customers",
        element: (
          <RoleRoute roles={["admin", "manager", "cashier"]}>
            <Customers />
          </RoleRoute>
        ),
        children: [
          { path: "", element: <CustomerList /> },
          {
            path: "create",
            element: (
              <RoleRoute roles={["admin"]}>
                <CustomerCreate />
              </RoleRoute>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <RoleRoute roles={["admin"]}>
                <CustomerEdit />
              </RoleRoute>
            ),
          },
        ],
      },
      // --- Products: Only admin and manager can access ---
      {
        path: "products",
        element: (
          <RoleRoute roles={["admin", "manager"]}>
            <Products />
          </RoleRoute>
        ),
        children: [
          { path: "", element: <ProductList /> },
          {
            path: "create",
            element: (
              <RoleRoute roles={["admin"]}>
                <ProductCreate />
              </RoleRoute>
            ),
          },
          {
            path: "edit/:id",
            element: (
              <RoleRoute roles={["admin", "manager"]}>
                <ProductEdit />
              </RoleRoute>
            ),
          },
        ],
      },
      // --- Orders: All roles can access ---
      {
        path: "orders",
        element: (
          <RoleRoute roles={["admin", "manager", "cashier"]}>
            <Orders />
          </RoleRoute>
        ),
        children: [
          { path: "", element: <OrderList /> },
          { path: "create", element: <OrderCreate /> },
          { path: "view/:id", element: <OrderView /> },
        ],
      },
      // --- Feedback list page for displaying all feedback ---
      {
        path: "feedback",
        element: <FeedbackListPage />,
      },
      // --- Feedback page for displaying feedback after survey submission ---
      {
        path: "feedback/:orderId",
        element: <FeedbackPage />,
      },
      // --- Farewell Messages Management (ADMIN only) ---
      {
        path: "farewell-messages",
        element: (
          <RoleRoute roles={["admin"]}>
            <FarewellMessageAdmin />
          </RoleRoute>
        ),
      },
      // --- Register Page (ADMIN only) ---
      {
        path: "register",
        element: (
          <RoleRoute roles={["admin"]}>
            <Register />
          </RoleRoute>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> },
];

const AppRoutes = () => {
  const route = useRoutes(routes);
  return route;
};

export default AppRoutes;
