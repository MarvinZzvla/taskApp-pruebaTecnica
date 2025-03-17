import {
  Button,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import { Task, User } from "../pages/Home/Home";

type Props = {
  openDialog: boolean;
  handleDialogClose: () => void;
  editingTask: Task | null;
  newTask: Partial<Task>;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | any
  ) => void;
  updateTask: () => void;
  addTask: () => void;
  users: User[];
};

function DialogComponent({
  openDialog,
  handleDialogClose,
  editingTask,
  newTask,
  handleInputChange,
  addTask,
  updateTask,
  users,
}: Props) {
  // Add sample users array inside the TaskApp component, after the isMobile declaration

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingTask ? "Edit Task" : "Add New Task"}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editingTask ? editingTask.title : newTask.title}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={editingTask ? editingTask.description : newTask.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={
                editingTask ? editingTask.status : newTask.status || "todo"
              }
              label="Status"
              onChange={handleInputChange}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="assigned-to-label">Assigned To</InputLabel>
            <Select
              labelId="assigned-to-label"
              id="assignedTo"
              name="assignedTo"
              value={
                editingTask
                  ? editingTask.assignedTo || ""
                  : newTask.assignedTo || ""
              }
              label="Assigned To"
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.name}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={editingTask ? updateTask : addTask}
            variant="contained"
            disabled={!(editingTask ? editingTask.title : newTask.title)}
          >
            {editingTask ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogComponent;
