import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useStore } from "../../../store/rootStore";
import { observer } from "mobx-react-lite";
import { Button, Typography, Paper, Avatar, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Inventory2Icon from "@mui/icons-material/Inventory2";

// Helper to get product image URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const storageUrl =
    import.meta.env.VITE_STORAGE_URL?.replace(/\/$/, "") || "/storage";
  return `${storageUrl}/${imagePath.replace(/^\/+/, "")}`;
};

const ProductList = () => {
  const {
    rootStore: { productStore },
  } = useStore();

  const initTable = async () => {
    try {
      await productStore.fetchList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initTable();
    // eslint-disable-next-line
  }, []);

  // Build columns: insert image column after stock
  const baseColumns = productStore.columns.filter(
    (col) => col.field !== "image"
  );
  const stockIdx = baseColumns.findIndex((col) => col.field === "stock");
  const columns = [
    ...baseColumns.slice(0, stockIdx + 1),
    {
      field: "image",
      headerName: "Image",
      width: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) =>
        params.row.image ? (
          <img
            src={getImageUrl(params.row.image)}
            alt={params.row.name}
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />
        ) : (
          <span style={{ color: "#aaa" }}>No image</span>
        ),
    },
    ...baseColumns.slice(stockIdx + 1),
  ];

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
          <Inventory2Icon />
        </Avatar>
        <Typography variant="h5" fontWeight={600} flexGrow={1}>
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          component={Link}
          to="create"
          sx={{ ml: "auto" }}
        >
          Add Product
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          autoHeight
          rows={productStore.rowData}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#1976d2",
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

export default observer(ProductList);
