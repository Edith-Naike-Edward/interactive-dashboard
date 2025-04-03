"use client";

import { useEffect, useState } from "react";
import { useMemo } from "react";
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
import { Bar, Line, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { fetchHealthData } from "../utils/api"; // Import the utility function

interface HealthData {
  id: number;
  age: number;
  gender: string;
  height: number;
  weight: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number;
  gluc: number;
  smoke: number;
  alco: number;
  active: number;
  cardio: number;
  AgeinYr: number;
  BMI: number;
  BMICat: string;
  AgeGroup: string;
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthData, setHealthData] = useState<HealthData[]>([]); // Use HealthData type for state

  // Fetch health data from the backend
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchHealthData();
        setHealthData(data);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    }
    loadData();
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && (event as React.KeyboardEvent).key === "Tab") {
      return;
    }
    setDrawerOpen(open);
  };

  // Sample data for charts
  const sortedHealthData = [...healthData].sort((a, b) => a.AgeinYr - b.AgeinYr);

  // Bar chart for blood pressure trends
  // const barChartData = {
  //   labels: sortedHealthData.map((entry) => entry.AgeinYr),
  //   datasets: [
  //     {
  //       label: "Systolic Blood Pressure (ap_hi)",
  //       data: sortedHealthData.map((entry) => entry.ap_hi),
  //       backgroundColor: "rgba(75, 192, 192, 0.6)",
  //     },
  //     {
  //       label: "Diastolic Blood Pressure (ap_lo)",
  //       data: sortedHealthData.map((entry) => entry.ap_lo),
  //       backgroundColor: "rgba(255, 99, 132, 0.6)",
  //     },
  //   ],
  // };

  // Line chart for glucose trends
  // const lineChartData = {
  //   labels: sortedHealthData.map((entry) => entry.AgeinYr), // Use AgeinYr as labels
  //   datasets: [
  //     {
  //       label: "Glucose Levels",
  //       data: sortedHealthData.map((entry) => entry.gluc),
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       fill: false,
  //       backgroundColor: "rgba(255, 255, 255, 0.8)", // Change background color
  //     },
  //   ],
  // };

  // // Scatter plot for BMI vs AgeinYr
  // const scatterChartData = {
  //   datasets: [
  //     {
  //       label: "BMI vs AgeinYr",
  //       data: sortedHealthData.map((entry) => ({
  //         x: entry.AgeinYr,
  //         y: entry.BMI,
  //       })),
  //       backgroundColor: "rgba(75, 192, 192, 1)",
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       pointRadius: 5,
  //     },
  //     {
  //       label: "Blood Pressure (ap_hi vs ap_lo)",
  //       data: sortedHealthData.map((entry) => ({
  //         x: entry.ap_hi,
  //         y: entry.ap_lo,
  //       })),
  //       backgroundColor: "rgba(255, 99, 132, 1)",
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       pointRadius: 5,
  //     },
  //   ],
  // };
  // Memoized Bar Chart Data
const barChartData = useMemo(() => ({
  labels: sortedHealthData.map((entry) => entry.AgeinYr),
  datasets: [
    {
      label: "Systolic Blood Pressure (ap_hi)",
      data: sortedHealthData.map((entry) => entry.ap_hi),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
    // {
    // //   label: "Diastolic Blood Pressure (ap_lo)",
    //   data: sortedHealthData.map((entry) => entry.ap_lo),
    //   backgroundColor: "rgba(255, 99, 132, 0.6)",
    // },
  ],
}), [sortedHealthData]);

// const barChartData = {
//   labels: sortedHealthData.map((entry) => entry.AgeinYr),
//   datasets: [
//     {
//       label: "Systolic Blood Pressure (ap_hi)",
//       data: sortedHealthData.map((entry) => entry.ap_hi),
//       backgroundColor: "rgba(75, 192, 192, 0.6)",
//     },
//   ],
// };

// Memoized Line Chart Data
const lineChartData = useMemo(() => ({
  labels: sortedHealthData.map((entry) => entry.AgeinYr),
  datasets: [
    {
      // label: "Glucose Levels",
      // data: sortedHealthData.map((entry) => entry.gluc),
      label: "Diastolic Blood Pressure (ap_lo)",
      data: sortedHealthData.map((entry) => entry.ap_lo),
      borderColor: "rgba(255, 99, 132, 1)",
      fill: false,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
  ],
}), [sortedHealthData]);

// Memoized Scatter Chart Data
const scatterChartData = useMemo(() => ({
  datasets: [
    {
      label: "BMI vs AgeinYr",
      data: sortedHealthData.map((entry) => ({
        x: entry.AgeinYr,
        y: entry.BMI,
      })),
      backgroundColor: "rgba(75, 192, 192, 1)",
      borderColor: "rgba(75, 192, 192, 1)",
      pointRadius: 5,
    },
    {
      label: "Blood Pressure (ap_hi vs ap_lo)",
      data: sortedHealthData.map((entry) => ({
        x: entry.ap_hi,
        y: entry.ap_lo,
      })),
      backgroundColor: "rgba(255, 99, 132, 1)",
      borderColor: "rgba(255, 99, 132, 1)",
      pointRadius: 5,
    },
  ],
}), [sortedHealthData]);

  // Key Metrics
  const totalPatients = healthData.length;
  const avgBMI =
    healthData.length > 0
      ? (healthData.reduce((sum, entry) => sum + entry.BMI, 0) / healthData.length).toFixed(2)
      : 0;
  const avgBP = healthData.length > 0
    ? `${(
        healthData.reduce((sum, entry) => sum + entry.ap_hi, 0) / healthData.length
      ).toFixed(1)}/${(
        healthData.reduce((sum, entry) => sum + entry.ap_lo, 0) / healthData.length
      ).toFixed(1)}`
    : "0/0";
  const avgGlucose =
    healthData.length > 0
      ? (healthData.reduce((sum, entry) => sum + entry.gluc, 0) / healthData.length).toFixed(2)
      : 0;

  return (
    <Box sx={{ display: "flex", backgroundColor: "#FDFBFB" }}>
      {/* Sidebar */}
      {/* <Drawer
        variant="permanent"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: sidebarCollapsed ? 60 : 240,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": {
            width: sidebarCollapsed ? 60 : 240,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      > */}
      <Drawer
        variant="permanent"
        open={!sidebarCollapsed} // Use the sidebarCollapsed state
        sx={{
          width: sidebarCollapsed ? 60 : 240,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": {
            width: sidebarCollapsed ? 60 : 240,
            transition: "width 0.3s",
            overflowX: "hidden",
            backgroundColor: "#2514BE", // Add a background color
            color: "#FFFFFF", // Set text color to white for better contrast
          },
        }}
      >
      <List>
      {/* <ListItem component="button" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        <ListItemIcon><Menu /></ListItemIcon>
        <ListItemText primary="Toggle Sidebar" />
      </ListItem> */}
      <ListItem component="button">
        <ListItemIcon sx={{ color: "#FFFFFF" }}><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem component="button" onClick={() => window.location.href = "/patientscreening"}>
        <ListItemIcon sx={{ color: "#FFFFFF" }}><BarChart /></ListItemIcon>
        <ListItemText primary="Screening Dashboard" />
      </ListItem>
      <ListItem component="button">
        <ListItemIcon sx={{ color: "#FFFFFF" }}><PieChart /></ListItemIcon>
        <ListItemText primary="Patient Monitoring Data" />
      </ListItem>
      <ListItem component="button">
        <ListItemIcon sx={{ color: "#FFFFFF" }}><Map /></ListItemIcon>
        <ListItemText primary="Reports and Insights" />
      </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <AppBar position="static" sx={{ backgroundColor: "#2514BE" }}>
          <Toolbar>
            {/* <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}> */}
            <IconButton edge="start" color="inherit" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
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
            <Card sx={{ 
              backgroundColor: "#E9E7F8",         
              borderRadius: "16px", // Rounded edges
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", 
            }, }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#1E1B3F", fontWeight: "bold" }}>Total Patients</Typography>
                <Typography variant="h4" sx={{ color: "#1E1B3F", fontWeight: "semibold" }}>{totalPatients}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              backgroundColor: "#E9E7F8",         
              borderRadius: "16px", // Rounded edges
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", 
            }, }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#1E1B3F", fontWeight: "bold" }}>Average BMI</Typography>
                <Typography variant="h4"sx={{ color: "#1E1B3F", fontWeight: "semibold" }}>{avgBMI}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              backgroundColor: "#E9E7F8",         
              borderRadius: "16px", // Rounded edges
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", 
            }, }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#1E1B3F", fontWeight: "bold" }}>Average Blood Pressure</Typography>
                <Typography variant="h4" sx={{ color: "#1E1B3F", fontWeight: "semibold" }}>{avgBP}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
              backgroundColor: "#E9E7F8",         
              borderRadius: "16px", // Rounded edges
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", 
            }, }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#1E1B3F", fontWeight: "bold" }}>Average Glucose</Typography>
                <Typography variant="h4" sx={{ color: "#1E1B3F", fontWeight: "semibold" }}>{avgGlucose}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Line Chart (Glucose Trends) */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Diastolic Blood Pressure (ap_lo)</Typography>
                <Line data={lineChartData} />
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart (Blood Pressure Trends) */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Systolic Blood Pressure (ap_hi)</Typography>
                <Bar data={barChartData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Scatter Plot (BMI vs Age and Blood Pressure Anomalies) */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>BMI vs Age and Blood Pressure Anomalies</Typography>
                <Scatter data={scatterChartData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   InputBase,
//   Badge,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Box,
//   Grid,
//   Paper,
//   Card,
//   CardContent,
// } from "@mui/material";
// import {
//   Search,
//   Notifications,
//   AccountCircle,
//   Menu,
//   Dashboard as DashboardIcon,
//   BarChart,
//   PieChart,
//   Map,
// } from "@mui/icons-material";
// import { Bar, Line, Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
// import { fetchHealthData } from "../utils/api"; // Import the utility function

// interface HealthData {
//   id: number;
//   age: number;
//   gender: string;
//   height: number;
//   weight: number;
//   ap_hi: number;
//   ap_lo: number;
//   cholesterol: number;
//   gluc: number;
//   smoke: number;
//   alco: number;
//   active: number;
//   cardio: number;
//   AgeinYr: number;
//   BMI: number;
//   BMICat: string;
//   AgeGroup: string;
// }

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// export default function DashboardPage() {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   // const [healthData, setHealthData] = useState([]);
//   const [healthData, setHealthData] = useState<HealthData[]>([]); // Use HealthData type for state

//   // Fetch health data from the backend
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const data = await fetchHealthData();
//         setHealthData(data);
//       } catch (error) {
//         console.error("Error fetching health data:", error);
//       }
//     }
//     loadData();
//   }, []);

//   const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
//     if (event.type === "keydown" && (event as React.KeyboardEvent).key === "Tab") {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   // Sample data for charts
//   // Sort healthData by AgeinYr in ascending order
//   const sortedHealthData = [...healthData].sort((a, b) => a.AgeinYr - b.AgeinYr);

//   const barChartData = {
//     labels: sortedHealthData.map((entry) => entry.AgeinYr),
//     datasets: [
//       {
//         label: "Systolic Blood Pressure (ap_hi)",
//         data: sortedHealthData.map((entry) => entry.ap_hi),
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//       },
//     ],
//   };

//   const lineChartData = {
//     labels: sortedHealthData.map((entry) => entry.AgeinYr), // Use AgeinYr as labels
//     datasets: [
//       {
//         label: "Glucose Levels",
//         data: sortedHealthData.map((entry) => entry.gluc),
//         borderColor: "rgba(255, 99, 132, 1)",
//         fill: false,
//       },
//     ],
//   };

//     // Group health data by BMI category (BMICat) and count occurrences
//   const bmiCategories = ["Normal", "Over Weight", "Obese"];
//   const bmiCounts = bmiCategories.map(category => 
//     healthData.filter(entry => entry.BMICat === category).length
//   );

//   const donutChartData = {
//     labels: bmiCategories, // Labels for the donut chart
//     datasets: [
//       {
//         data: bmiCounts, // Counts of each BMI category
//         backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
//       },
//     ],
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Sidebar */}
//       <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
//         <List>
//           <ListItem component="button">
//             <ListItemIcon><DashboardIcon /></ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItem>
//           <ListItem component="button">
//             <ListItemIcon><BarChart /></ListItemIcon>
//             <ListItemText primary="Screening Data" />
//           </ListItem>
//           <ListItem component="button">
//             <ListItemIcon><PieChart /></ListItemIcon>
//             <ListItemText primary="Patient Monitoring Data" />
//           </ListItem>
//           <ListItem component="button">
//             <ListItemIcon><Map /></ListItemIcon>
//             <ListItemText primary="Reports and Insights" />
//           </ListItem>
//         </List>
//       </Drawer>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         {/* Header */}
//         <AppBar position="static">
//           <Toolbar>
//             <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
//               <Menu />
//             </IconButton>
//             <Typography variant="h6" sx={{ flexGrow: 1 }}>Health Dashboard</Typography>
//             <InputBase placeholder="Search…" sx={{ background: "white", padding: "5px 10px", borderRadius: "5px", marginRight: 2 }} />
//             <IconButton color="inherit"><Badge badgeContent={3} color="error"><Notifications /></Badge></IconButton>
//             <IconButton color="inherit"><AccountCircle /></IconButton>
//           </Toolbar>
//         </AppBar>

//         {/* Dashboard Cards */}
//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//               <Typography variant="h6">Total Patients</Typography>
//               <Typography variant="h4">{healthData.length}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//               <Typography variant="h6">Average BMI</Typography>
//                 <Typography variant="h4">
//                   {healthData.length > 0
//                     ? (healthData.reduce((sum, entry) => sum + entry.BMI, 0) / healthData.length).toFixed(2)
//                     : 0}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Average Blood Pressure</Typography>
//                 <Typography variant="h4">
//                   {healthData.length > 0
//                     ? `${(
//                         healthData.reduce((sum, entry) => sum + entry.ap_hi, 0) / healthData.length
//                       ).toFixed(1)}/${(
//                         healthData.reduce((sum, entry) => sum + entry.ap_lo, 0) / healthData.length
//                       ).toFixed(1)}`
//                     : "0/0"}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Average Glucose</Typography>
//                 <Typography variant="h4">
//                   {healthData.length > 0
//                     ? (healthData.reduce((sum, entry) => sum + entry.gluc, 0) / healthData.length).toFixed(2)
//                     : 0}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
 
//         {/* Charts Section */}
//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           {/* Line Chart (Glucose Trends) */}
//           <Grid item xs={10} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>Glucose Trends</Typography>
//                 <Line data={lineChartData} />
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Donut Chart (BMI Categories) - Placed to the right of the line chart
//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>BMI Categories</Typography>
//                 <Doughnut data={donutChartData} />
//               </CardContent>
//             </Card>
//           </Grid> */}

//           {/* Bar Chart (Cholesterol Levels) - Placed below the line chart */}
//           <Grid item xs={10} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>Cholesterol Levels</Typography>
//                 <Bar data={barChartData} />
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>


//         {/* Heatmap and Tables Section */}
//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           <Grid item xs={12} md={6}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>Health Data Heatmap</Typography>
//                 {/* Implement your Heatmap component here */}
//                 <Paper elevation={3} sx={{ height: 300 }}>
//                   {/* Heatmap visualization */}
//                 </Paper>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>Table 1</Typography>
//                 {/* Implement your table here */}
//                 <Paper elevation={3}>
//                   {/* Table content */}
//                 </Paper>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>Table 2</Typography>
//                 {/* Implement your table here */}
//                 <Paper elevation={3}>
//                   {/* Table content */}
//                 </Paper>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }