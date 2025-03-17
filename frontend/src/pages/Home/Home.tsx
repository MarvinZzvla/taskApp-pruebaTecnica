import type React from "react";
import { useState, useEffect } from "react";
import { Typography, Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import NavBar from "../../components/NavBar";
import DialogComponent from "../../components/DialogTask";
import UserView from "./components/UserView";
import ChartView from "./components/ChartView";
import ListView, { TaskStatus } from "./components/ListView";
import {
  createTasks,
  deleteTasks,
  getTasks,
  updateTasks,
} from "../../api/apiTask";
import { getUsers } from "../../api/apiUsers";

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Add the User interface after the Task interface
export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Main App Component
export default function TaskApp() {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<"list" | "chart" | "users">(
    "list"
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    assignedTo: null,
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTasks();
        setTasks(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTask();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  // Task operations
  const addTask = async () => {
    const task: Task = {
      title: newTask.title || "",
      description: newTask.description || "",
      status: (newTask.status as TaskStatus) || "todo",
      assignedTo: newTask.assignedTo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const { task_id } = await createTasks(task);
      setTasks([...tasks, { ...task, id: task_id }]);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        assignedTo: null,
      });
      setOpenDialog(false);
    } catch (error) {}
  };

  const updateTask = async () => {
    if (!editingTask) return;

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id
        ? { ...editingTask, updatedAt: new Date() }
        : task
    );
    try {
      const taskToUpdate = updatedTasks.find(
        (task) => task.id === editingTask.id
      );
      if (taskToUpdate) {
        setTasks(updatedTasks);
        setEditingTask(null);
        setOpenDialog(false);
        await updateTasks(taskToUpdate);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasks(tasks.filter((task) => task.id !== id));
      await deleteTasks(id);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (
    id: string,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newStatus = event.target.value as TaskStatus;
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, status: newStatus, updatedAt: new Date() }
        : task
    );

    try {
      const taskToUpdate = updatedTasks.find((task) => task.id === id);
      if (taskToUpdate) {
        setTasks(updatedTasks);
        await updateTasks(taskToUpdate);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setOpenDialog(true);
  };

  const openAddDialog = () => {
    setEditingTask(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      assignedTo: null,
    });
  };

  // Replace the handleInputChange function with this updated version that properly handles Select events
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | any
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    if (editingTask) {
      setEditingTask({
        ...editingTask,
        [name]: value,
      });
    } else {
      setNewTask({
        ...newTask,
        [name]: value,
      });
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAddDialog={openAddDialog}
      />

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {/* Vista Lista */}
        {currentView === "list" ? (
          <ListView
            deleteTask={deleteTask}
            openEditDialog={openEditDialog}
            tasks={tasks}
            updateTaskStatus={updateTaskStatus}
          />
        ) : currentView === "chart" ? ( //Vista chart
          <ChartView tasks={tasks} />
        ) : currentView === "users" ? ( //Vista users
          <UserView users={users} setUsers={setUsers} />
        ) : null}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            Task Manager App © {new Date().getFullYear()} - Marvin Zavala
          </Typography>
        </Container>
      </Box>

      {/* Task Dialog */}
      <DialogComponent
        addTask={addTask}
        editingTask={editingTask}
        handleDialogClose={handleDialogClose}
        handleInputChange={handleInputChange}
        newTask={newTask}
        openDialog={openDialog}
        updateTask={updateTask}
        users={users}
      />
    </Box>
  );
}
