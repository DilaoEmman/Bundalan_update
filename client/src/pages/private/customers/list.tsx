import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useStore } from "../../../store/rootStore";
import { observer } from "mobx-react-lite";
import { Button, Typography, Paper, Avatar, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PeopleIcon from "@mui/icons-material/People";

const CustomerList = () => {
  const {
    rootStore: { customerStore },
  } = useStore();

  const initTable = async () => {
    try {
      await customerStore.fetchList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initTable();
  }, []);

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
          <PeopleIcon />
        </Avatar>
        <Typography variant="h5" fontWeight={600} flexGrow={1}>
          Members List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddAlt1Icon />}
          component={Link}
          to="create"
          sx={{ ml: "auto" }}
        >
          Add Member
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          autoHeight
          rows={customerStore.rowData}
          columns={customerStore.columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "primary.light",
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

export default observer(CustomerList);
