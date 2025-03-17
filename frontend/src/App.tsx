import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const theme = useTheme();
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
