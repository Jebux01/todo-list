import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { PropsModal } from "../../models/modal";
import ClientHttp from "../../services";

export default function Modal({
  open,
  type,
  taskId,
  title: initialTitle = "",
  description: initialDescription = "",
  handleClose,
  handleOpenAlert,
  handlerRefresh,
}: Readonly<PropsModal>) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [open, initialTitle, initialDescription]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (type === "add") {
      return handleCreate(title, description);
    }

    return handleUpdate(title, description);
  };

  const handleCreate = async (title: string, description: string) => {
    await ClientHttp.post("/", { title, description })
      .then(() => {
        handleOpenAlert("Task created successfully", "", "success");
        handleClose();
        handlerRefresh();
      })
      .catch((error) => {
        handleOpenAlert("Error creating task", error, "error");
        console.error(error);
        handleClose();
      });
  };

  const handleUpdate = async (title: string, description: string) => {
    await ClientHttp.put(`/${taskId}`, { title, description })
      .then(() => {
        handleOpenAlert("Task updated successfully", "", "success");
        handleClose();
        handlerRefresh();
      })
      .catch((error) => {
        handleOpenAlert("Error updating task", error, "error");
        console.error(error);
        handleClose();
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{type === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="title"
          name="title"
          label="Title Task"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          required
          margin="dense"
          id="description"
          name="description"
          label="Description Task"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained">
          Cancel
        </Button>
        <Button type="submit" color="success" variant="contained">
          {type === "add" ? "Add" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
