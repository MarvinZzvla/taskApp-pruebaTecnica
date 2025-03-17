import { Typography, Grid, Box, Paper } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Task } from "../Home";
type Props = {
  tasks: Task[];
};

function ChartView({ tasks }: Props) {
  // Prepare chart data
  const chartData = [
    {
      name: "To Do",
      value: tasks.filter((t) => t.status === "todo").length,
      color: "#ff9800",
    },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === "inProgress").length,
      color: "#2196f3",
    },
    {
      name: "Completed",
      value: tasks.filter((t) => t.status === "completed").length,
      color: "#4caf50",
    },
  ];
  return (
    <>
      {/* Chart View */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Status Chart
        </Typography>
        <Paper sx={{ p: 3, height: 400 }}>
          {tasks.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="body1">
                No tasks available to display in chart.
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Paper>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {chartData.map((status) => (
            <Grid item xs={12} sm={4} key={status.name}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderLeft: `4px solid ${status.color}`,
                }}
              >
                <Typography variant="h6" component="h3">
                  {status.name}
                </Typography>
                <Typography variant="h4" component="p" sx={{ mt: 1 }}>
                  {status.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  tasks
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default ChartView;
