import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, vi, beforeEach, expect } from "vitest";
import Home from "../Home";
import {
  getTasks,
  createTasks,
  updateTasks,
  deleteTasks,
} from "../../../api/apiTask";
import { getUsers } from "../../../api/apiUsers";

// Mock the API calls
vi.mock("../../../api/apiTask");
vi.mock("../../../api/apiUsers");

const mockTasks = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Test Description 1",
    status: "todo",
    assignedTo: "John Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Test Task 2",
    description: "Test Description 2",
    status: "inProgress",
    assignedTo: "Jane Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Home Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(getTasks).mockResolvedValue(mockTasks);
    vi.mocked(getUsers).mockResolvedValue(mockUsers);
  });

  it("renders the home page with task list view by default", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText("Tasks")).toBeInTheDocument();
    });

    // Check if tasks are rendered
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  it("can switch between different views", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Tasks")).toBeInTheDocument();
    });

    // Switch to Chart view
    const chartButton = screen.getByText("Task Chart");
    fireEvent.click(chartButton);
    expect(screen.getByText("Task Status Chart")).toBeInTheDocument();

    // Switch to Users view
    const usersButton = screen.getByText("Users");
    fireEvent.click(usersButton);
    expect(screen.getByText("User Management")).toBeInTheDocument();
  });

  it("can add a new task", async () => {
    vi.mocked(createTasks).mockResolvedValue({ task_id: "3" });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Click add task button
    const addButton = screen.getByText("Add Task");
    fireEvent.click(addButton);

    // Fill in the form
    const titleInput = screen.getByLabelText("Task Title");
    const descriptionInput = screen.getByLabelText("Description");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "New Description" },
    });

    // Submit the form
    const submitButton = screen.getByText("Add");
    fireEvent.click(submitButton);

    // Verify API was called
    await waitFor(() => {
      expect(createTasks).toHaveBeenCalled();
    });
  });

  it("can delete a task", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    // Find and click delete button for first task
    const deleteButtons = screen.getAllByTestId("delete-task-button");
    fireEvent.click(deleteButtons[0]);

    // Verify API was called
    await waitFor(() => {
      expect(deleteTasks).toHaveBeenCalledWith("1");
    });
  });

  it("can update task status", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    // Find and change status for first task
    const statusSelect = screen.getAllByLabelText("Status")[0];
    fireEvent.change(statusSelect, { target: { value: "completed" } });

    // Verify API was called
    await waitFor(() => {
      expect(updateTasks).toHaveBeenCalled();
    });
  });
});
