import { useEffect, useState } from "react";
import { Box, CardContent, AlertColor } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UpdateIcon from "@mui/icons-material/Update";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Tooltip from "@mui/material/Tooltip";
import { SelectChangeEvent } from "@mui/material/Select";
import SelectState from "./components/select";
import Typography from "@mui/material/Typography";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Modal from "./components/modal";
import AlertComponent from "./components/alert";
import { Task } from "./models/tasks";
import ClientHttp from "./services";

function App() {
  const [state, setState] = useState("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [useModal, setUseModal] = useState("add");
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("success" as AlertColor);
  const [titleAlert, setTitleAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");
  const [tasks, setTasks] = useState([] as Task[]);
  const [reload, setReload] = useState(false);

  const handleOpenAlert = (
    title: string,
    description: string,
    type: AlertColor
  ) => {
    setTypeAlert(type);
    setTitleAlert(title);
    setDescriptionAlert(description);
    setOpenAlert(true);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleOpenNew = () => {
    setUseModal("add");
    setTaskId("");
    setTitle("");
    setDescription("");
    handleOpenAdd();
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenUpdate = (row: any) => {
    setUseModal("update");
    setTaskId(row.id);
    setTitle(row.title);
    setDescription(row.description);
    setOpenAdd(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setState(event.target.value);
  };

  const getTasks = async () => {
    await ClientHttp.get(`/${state}`)
      .then((response: any) => {
        setTasks(response.data);
      })
      .catch((error: any) => {
        handleOpenAlert("Error", error.message, "error");
      });
  };

  const handleSucess = (id: string) => {
    sucessTask(id);
  };

  const sucessTask = async (id: string) => {
    await ClientHttp.patch(`/success/${id}`)
      .then(() => {
        handleOpenAlert(
          "Task Finished",
          "Task Finished successfully",
          "success"
        );
        setReload(!reload);
      })
      .catch((error) => {
        console.log(error);
        handleOpenAlert("Error", error.message, "error");
      });
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  const deleteTask = async (id: string) => {
    await ClientHttp.delete(`/${id}`)
      .then(() => {
        handleOpenAlert("Task deleted", "Task deleted successfully", "success");
        setReload(!reload);
      })
      .catch((error) => {
        handleOpenAlert("Error", error.message, "error");
      });
  };

  useEffect(() => {
    getTasks();
  }, [reload, state]);

  return (
    <div className="App">
      <AlertComponent
        open={openAlert}
        type={typeAlert}
        title={titleAlert}
        description={descriptionAlert}
        handleClose={() => setOpenAlert(false)}
      />
      <header className="App-header">
        <Modal
          open={openAdd}
          handleClose={handleCloseAdd}
          type={useModal}
          taskId={taskId}
          title={title}
          description={description}
          handleOpenAlert={handleOpenAlert}
          handlerRefresh={() => setReload(!reload)}
        />
        <Typography variant="h3" component="h1" mb={2}>
          TODO LIST
        </Typography>
        <Box>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-around"
            alignItems="center"
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNew}
            >
              Add Task
            </Button>
            <SelectState state={state} handleChange={handleChange} />
          </Stack>
          {tasks.length > 0 ? (
            <List
              sx={{
                margin: "auto",
                borderRadius: "10px",
                marginTop: "20px",
                width: "100%",
                overflow: "auto",
                maxHeight: 550,
                "& ul": { padding: 0 },
              }}
            >
              {tasks.map((task) => (
                <ListItem key={task.id}>
                  <Card
                    sx={{
                      width: "100vh",
                      maxWidth: "50vh",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CardHeader
                      title={task.title}
                      subheader={"status: " + task.status}
                      action={
                        <Stack direction="row" spacing={2}>
                          <Tooltip title="Delete task">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="error"
                              onClick={() => handleDelete(task.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="update task">
                            <IconButton
                              aria-label="update"
                              size="small"
                              color="primary"
                              onClick={() => handleOpenUpdate(task)}
                            >
                              <UpdateIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Finish task">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              color="success"
                              onClick={() => handleSucess(task.id)}
                            >
                              <DoneAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
                    />
                    <CardContent>{task.description}</CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          ) : (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              mt={5}
            >
              <Typography variant="h6" component="h2">
                No tasks found
              </Typography>
              <img
                src="https://cdn-icons-png.flaticon.com/512/5058/5058432.png"
                alt="no tasks"
                width={100}
                height={100}
              />
            </Stack>
          )}
        </Box>
      </header>
    </div>
  );
}

export default App;
