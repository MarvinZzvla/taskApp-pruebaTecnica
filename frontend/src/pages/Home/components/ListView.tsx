import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  IconButton,
  Box,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Task } from "../Home";

type Props = {
  tasks: Task[];
  updateTaskStatus: (
    id: string,
    event: React.ChangeEvent<{ value: unknown }>
  ) => void;
  openEditDialog: (task: Task) => void;
  deleteTask: (id: string) => void;
};
// Types
export type TaskStatus = "todo" | "inProgress" | "completed";

function ListView({
  tasks,
  updateTaskStatus,
  openEditDialog,
  deleteTask,
}: Props) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "#ff9800";
      case "inProgress":
        return "#2196f3";
      case "completed":
        return "#4caf50";
      default:
        return "#757575";
    }
  };
  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "inProgress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };
  return (
    <>
      {/* Task List View */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tasks
        </Typography>
        <Grid container spacing={3}>
          {tasks.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1">
                  No tasks available. Click "Add Task" to create one.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: `4px solid ${getStatusColor(task.status)}`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={getStatusLabel(task.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(task.status),
                          color: "white",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, wordBreak: "break-word" }}
                    >
                      {task.description}
                    </Typography>
                    {task.assignedTo && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Assigned to:</strong> {task.assignedTo}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Updated: {new Date(task.updatedAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                      <InputLabel id={`status-label-${task.id}`}>
                        Status
                      </InputLabel>
                      <Select
                        labelId={`status-label-${task.id}`}
                        id={`status-select-${task.id}`}
                        value={task.status}
                        label="Status"
                        onChange={(e) => updateTaskStatus(task.id, e)}
                      >
                        <MenuItem value="todo">To Do</MenuItem>
                        <MenuItem value="inProgress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openEditDialog(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
}

export default ListView;
