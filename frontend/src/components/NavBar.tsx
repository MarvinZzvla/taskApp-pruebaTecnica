import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Drawer,
} from "@mui/material";
import {
  Menu as MenuIcon,
  FormatListBulleted as ListIcon,
  Dashboard as DashboardIcon,
  People,
  Add as AddIcon,
  PowerSettingsNew,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import toggleDrawer from "../utils/toggleDrawer";
import { useNavigate } from "react-router-dom";

type Props = {
  openDrawer: boolean;
  setOpenDrawer: (n: boolean) => void;
  currentView: string;
  setCurrentView: (n: "list" | "chart" | "users") => void;
  openAddDialog: () => void;
};

function NavBar({
  openDrawer,
  setOpenDrawer,
  currentView,
  setCurrentView,
  openAddDialog,
}: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigationItems = [
    { text: "Task List", icon: <ListIcon />, view: "list" as const },
    { text: "Task Chart", icon: <DashboardIcon />, view: "chart" as const },
    { text: "Users", icon: <People />, view: "users" as const },
  ];
  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate("/login");
  };
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false, setOpenDrawer)}
      onKeyDown={toggleDrawer(false, setOpenDrawer)}
    >
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => setCurrentView(item.view)}
            selected={currentView === item.view}
          >
            {item.icon}
            <ListItemText primary={item.text} sx={{ ml: 2 }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true, setOpenDrawer)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          {!isMobile && (
            <Box sx={{ display: "flex" }}>
              {navigationItems.map((item) => (
                <Button
                  color="inherit"
                  key={item.text}
                  startIcon={item.icon}
                  onClick={() => setCurrentView(item.view)}
                  sx={{
                    mx: 1,
                    borderBottom:
                      currentView === item.view ? "2px solid white" : "none",
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
          >
            Add Task
          </Button>
          <Button color="error" onClick={handleLogout}>
            <PowerSettingsNew />
          </Button>
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer(false, setOpenDrawer)}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default NavBar;
