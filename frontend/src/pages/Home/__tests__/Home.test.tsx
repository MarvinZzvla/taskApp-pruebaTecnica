import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, vi, beforeEach, expect } from "vitest";
import Home from "../Home";
import userEvent from "@testing-library/user-event";
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
vi.mock("react-router-dom", () => ({
  ...(vi.importActual("react-router-dom") as any),
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

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
    vi.clearAllMocks();
    vi.mocked(getTasks).mockResolvedValue(mockTasks);
    vi.mocked(getUsers).mockResolvedValue(mockUsers);
  });

  it("should fetch and display tasks on mount", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalled();
      expect(getUsers).toHaveBeenCalled();
    });

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  it("should handle task creation", async () => {
    vi.mocked(createTasks).mockResolvedValue({ task_id: "new-task-id" });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Open dialog
    const addButton = screen.getByRole("button", { name: /add task/i });
    await userEvent.click(addButton);

    // Fill form
    const titleInput = screen.getByRole("textbox", { name: /task title/i });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });

    await userEvent.type(titleInput, "New Task");
    await userEvent.type(descriptionInput, "New Description");

    // Submit
    const submitButton = screen.getByRole("button", { name: /add/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(createTasks).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Task",
          description: "New Description",
        })
      );
    });
  });

  it("should handle task deletion", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("delete-task-button-1");
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteTasks).toHaveBeenCalledWith("1");
    });
  });

  it("should handle task status update", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const statusSelect = screen.getAllByRole("combobox", {
      name: /status/i,
    })[0];
    await userEvent.click(statusSelect);
    const completedOption = screen.getByRole("option", { name: /completed/i });
    await userEvent.click(completedOption);

    await waitFor(() => {
      expect(updateTasks).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "1",
          status: "completed",
        })
      );
    });
  });

  it("should switch between views", async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Switch to Chart view
    fireEvent.click(screen.getByText("Task Chart"));
    expect(screen.getByText("Task Status Chart")).toBeInTheDocument();

    // Switch to Users view
    fireEvent.click(screen.getByText("Users"));
    expect(screen.getByText("User Management")).toBeInTheDocument();

    // Switch back to List view
    fireEvent.click(screen.getByText("Task List"));
    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });
});
