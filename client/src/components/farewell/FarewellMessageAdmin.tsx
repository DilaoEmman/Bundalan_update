import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Switch,
  Modal,
  Paper,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface FarewellMessage {
  id: number;
  message: string;
  active: boolean;
}

const API_BASE = "http://localhost:8000/api/v1/farewell-messages";

export default function FarewellMessageAdmin() {
  const [messages, setMessages] = useState<FarewellMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [edit, setEdit] = useState<{ id: number; message: string; active: boolean } | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          "Content-Type": "application/json",
        };
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}`, { headers: { Accept: "application/json" } });
      if (res.ok) setMessages(await res.json());
      else alert("Failed to fetch: " + (await res.text()));
    } catch (e) {
      alert("Failed to fetch: " + e);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message: newMsg }),
    });
    if (!res.ok) {
      alert("Failed to add: " + (await res.text()));
      return;
    }
    setNewMsg("");
    fetchMessages();
  };

  const handleEdit = async () => {
    if (!edit) return;
    const res = await fetch(`${API_BASE}/${edit.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message: edit.message, active: edit.active }),
    });
    if (!res.ok) {
      alert("Failed to update: " + (await res.text()));
      return;
    }
    setEdit(null);
    fetchMessages();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      alert("Failed to delete: " + (await res.text()));
      return;
    }
    fetchMessages();
  };

  const handleToggleActive = async (msg: FarewellMessage) => {
    const res = await fetch(`${API_BASE}/${msg.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message: msg.message, active: !msg.active }),
    });
    if (!res.ok) {
      alert("Failed to update: " + (await res.text()));
      return;
    }
    fetchMessages();
  };

  return (
    <Box maxWidth={600} mx="auto" mt={6}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{ bgcolor: "warning.main", width: 48, height: 48, mr: 2, boxShadow: 2 }}
          >
            <EmojiEventsIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={600} color="warning.main">
            Farewell Messages
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <TextField
            label="New Message"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            size="small"
            fullWidth
          />
          <Button type="submit" variant="contained">
            Add
          </Button>
        </form>
        <List sx={{ bgcolor: "#fff", borderRadius: 2, py: 0 }}>
          {messages.map(m => (
            <ListItem
              key={m.id}
              secondaryAction={
                <>
                  <Tooltip title={m.active ? "Deactivate" : "Activate"}>
                    <Switch checked={m.active} onChange={() => handleToggleActive(m)} />
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => setEdit(m)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(m.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
              sx={{
                opacity: m.active ? 1 : 0.5,
                borderBottom: "1px solid #eee",
                bgcolor: m.active ? "#fdf7e3" : "#f7f7f7",
                fontWeight: m.active ? 600 : 400,
                fontSize: "1.05rem",
              }}
            >
              {m.message}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Modal open={!!edit} onClose={() => setEdit(null)}>
        <Box
          p={4}
          bgcolor="#fff"
          m="auto"
          mt="10%"
          borderRadius={2}
          width={400}
          position="relative"
        >
          <Typography variant="h6">Edit Farewell Message</Typography>
          <TextField
            label="Message"
            value={edit?.message ?? ""}
            onChange={e => setEdit(edit ? { ...edit, message: e.target.value } : null)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box mt={2} display="flex" alignItems="center">
            <Typography variant="body2">Active</Typography>
            <Switch
              checked={edit?.active ?? true}
              onChange={e => setEdit(edit ? { ...edit, active: e.target.checked } : null)}
              sx={{ ml: 1 }}
            />
          </Box>
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleEdit}
              disabled={!edit?.message.trim()}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={() => setEdit(null)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
