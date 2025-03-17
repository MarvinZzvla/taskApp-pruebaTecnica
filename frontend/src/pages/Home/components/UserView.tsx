import { User } from "../Home";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
  Fab,
  Divider,
  Card,
  CardContent,
  Grid,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { createUser, deleteUserDb, updateUserDb } from "../../../api/apiUsers";

type Props = {
  users: User[];
  setUsers: (u: User[]) => void;
};
// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const formatDate = (date: Date) => date.toLocaleDateString();

function UserView({ users, setUsers }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User operations
  const addUser = async () => {
    if (!validateUserForm()) return;

    const user: User = {
      name: newUser.name || "",
      email: newUser.email || "",
      password: newUser.password || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const { id } = await createUser(user);
      console.log(id);
      setUsers([...users, { ...user, id: id }]);
      setNewUser({
        name: "",
        email: "",
        password: "",
      });
      setOpenDialog(false);
      showSnackbar("User added successfully", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Fail adding user, please try again", "error");
    }
  };

  const updateUser = async () => {
    if (!editingUser || !validateUserForm(true)) return;

    try {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? { ...editingUser, updatedAt: new Date() }
          : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
      setOpenDialog(false);
      await updateUserDb(editingUser);
      showSnackbar("User updated successfully", "success");
    } catch (error) {}
  };

  const deleteUser = async () => {
    if (!deletingUserId) return;

    try {
      setUsers(users.filter((user) => user.id !== deletingUserId));
      setDeletingUserId(null);
      setOpenDeleteDialog(false);
      await deleteUserDb(deletingUserId);
      showSnackbar("User deleted successfully", "info");
    } catch (error) {
      console.error(error);
      showSnackbar("User not was deleted, please try again", "error");
    }
  };

  const validateUserForm = (isEditing = false) => {
    const userToValidate = isEditing ? editingUser : newUser;

    if (!userToValidate?.name || userToValidate.name.trim() === "") {
      showSnackbar("Name is required", "error");
      return false;
    }

    if (!userToValidate?.email || userToValidate.email.trim() === "") {
      showSnackbar("Email is required", "error");
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userToValidate.email)) {
      showSnackbar("Please enter a valid email address", "error");
      return false;
    }

    if (
      !isEditing &&
      (!userToValidate?.password || userToValidate.password.trim() === "")
    ) {
      showSnackbar("Password is required", "error");
      return false;
    }

    return true;
  };

  // Dialog handlers
  const openAddDialog = () => {
    setEditingUser(null);
    setNewUser({
      name: "",
      email: "",
      password: "",
    });
    setOpenDialog(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser({ ...user });
    setOpenDialog(true);
  };

  const openConfirmDeleteDialog = (userId: string) => {
    setDeletingUserId(userId);
    setOpenDeleteDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setNewUser({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeletingUserId(null);
  };

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [name]: value,
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Snackbar
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  return (
    <>
      {/* Users View */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Fab color="primary" aria-label="add" onClick={openAddDialog}>
          <AddIcon />
        </Fab>
      </Box>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm("")} edge="end">
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <>
          {/* Desktop view - Table */}
          <TableContainer
            component={Paper}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {formatDate(new Date(user.createdAt))}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(user.updatedAt))}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => openEditDialog(user)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => openConfirmDeleteDialog(user.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile view - Cards */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Grid container spacing={2}>
              {filteredUsers.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{user.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Created: {formatDate(new Date(user.createdAt))}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            Updated: {formatDate(new Date(user.updatedAt))}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            onClick={() => openEditDialog(user)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => openConfirmDeleteDialog(user.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editingUser ? editingUser.name : newUser.name}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editingUser ? editingUser.email : newUser.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            required
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel htmlFor="password">
              Password {editingUser && "(Leave blank to keep current)"}
            </InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={editingUser ? editingUser.password : newUser.password}
              onChange={handleInputChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label={`Password ${
                editingUser ? "(Leave blank to keep current)" : ""
              }`}
              required={!editingUser}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={editingUser ? updateUser : addUser}
            variant="contained"
            color="primary"
          >
            {editingUser ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={deleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UserView;
