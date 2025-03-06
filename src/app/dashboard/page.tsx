"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search,
  Notifications,
  AccountCircle,
  Menu,
  Dashboard as DashboardIcon,
  BarChart,
  PieChart,
  Map,
} from "@mui/icons-material";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && (event as React.KeyboardEvent).key === "Tab") {
      return;
    }
    setDrawerOpen(open);
  };

  // Sample data for charts
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Average Blood Pressure (ap_hi)",
        data: [120, 125, 130, 128, 132, 135],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Glucose Levels",
        data: [90, 95, 100, 105, 110, 115],
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
    ],
  };

  const donutChartData = {
    labels: ["Normal", "Overweight", "Obese"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem component="button">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem component="button">
            <ListItemIcon><BarChart /></ListItemIcon>
            <ListItemText primary="Charts" />
          </ListItem>
          <ListItem component="button">
            <ListItemIcon><PieChart /></ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
          <ListItem component="button">
            <ListItemIcon><Map /></ListItemIcon>
            <ListItemText primary="Heatmap" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Health Dashboard</Typography>
            <InputBase placeholder="Search…" sx={{ background: "white", padding: "5px 10px", borderRadius: "5px", marginRight: 2 }} />
            <IconButton color="inherit"><Badge badgeContent={3} color="error"><Notifications /></Badge></IconButton>
            <IconButton color="inherit"><AccountCircle /></IconButton>
          </Toolbar>
        </AppBar>

        {/* Dashboard Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Patients</Typography>
                <Typography variant="h4">69,960</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average BMI</Typography>
                <Typography variant="h4">24.5</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Blood Pressure</Typography>
                <Typography variant="h4">128/82</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Glucose</Typography>
                <Typography variant="h4">98 mg/dL</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Blood Pressure Trends</Typography>
                <Line data={lineChartData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>BMI Categories</Typography>
                <Doughnut data={donutChartData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Cholesterol Levels</Typography>
                <Bar data={barChartData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}