import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { describe, it, vi, beforeEach, expect } from "vitest";
import Login from "../Login";
import { getLogin } from "../../../api/apiUsers";
import userEvent from "@testing-library/user-event";

// Mock the API calls and navigation
vi.mock("../../../api/apiUsers");
vi.mock("react-router-dom", () => ({
  ...(vi.importActual("react-router-dom") as any),
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it("should render login form", () => {
    renderLogin();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByText("Remember me")).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    renderLogin();
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("should handle remember me checkbox", async () => {
    renderLogin();
    const rememberMeCheckbox = screen.getByRole("checkbox", {
      name: /remember me/i,
    });

    expect(rememberMeCheckbox).not.toBeChecked();
    await userEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
  });
});
