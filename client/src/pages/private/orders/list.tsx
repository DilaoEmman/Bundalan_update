import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useStore } from "../../../store/rootStore";
import { observer } from "mobx-react-lite";
import { Button, Typography, Paper, Avatar, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const OrderList = () => {
  const {
    rootStore: { orderStore },
  } = useStore();

  useEffect(() => {
    orderStore.fetchList();
  }, [orderStore]);

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "success.main", mr: 1 }}>
          <ReceiptLongIcon />
        </Avatar>
        <Typography variant="h5" fontWeight={600} flexGrow={1}>
          Orders List
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddShoppingCartIcon />}
          component={Link}
          to="create"
          sx={{ ml: "auto" }}
        >
          Add Order
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          autoHeight
          rows={orderStore.rowData}
          columns={orderStore.columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "success.light",
              color: "#222",
              fontWeight: "bold",
              fontSize: 16,
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "action.hover",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default observer(OrderList);
