"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Button, Select, MenuItem, FormControl, InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, IconButton, Drawer, 
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    Badge} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { Menu as MenuIcon } from "@mui/icons-material";
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

// Define the PatientScreening type
type PatientScreening = {
  risk_level?: string;
  avg_systolic?: number;
  date?: string;
  facility?: string;
  screenings?: number;
};

export default function ScreeningDashboard() {
  const [data, setData] = useState<PatientScreening[]>([]);
  const [filters, setFilters] = useState({ country: "", facility: "", date: "" });
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/screening-data", { params: filters });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
        {/* <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-indigo-800">Patient Screening Dashboard</h1>
            <IconButton>
            <MenuIcon />
            </IconButton>
        </div> */}


      {/* Side Panel
      <Drawer open={sidePanelOpen} onClose={() => setSidePanelOpen(false)}>
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
      <ListItem component="button" onClick={() => window.location.href = "/dashboard"}>
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
      <div className="flex-1 p-6 space-y-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-indigo-800">Patient Screening Dashboard</h1>
          <IconButton onClick={() => setSidePanelOpen(true)}>
            <MenuIcon />
          </IconButton>
        </div> */}
        <AppBar position="static" sx={{ backgroundColor: "#2514BE" }}>
            <Toolbar>
            {/* <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}> */}
            <IconButton edge="start" color="inherit" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Patient Screening Dashboard</Typography>
            <InputBase placeholder="Search…" sx={{ background: "white", padding: "5px 10px", borderRadius: "5px", marginRight: 2 }} />
            <IconButton color="inherit"><Badge badgeContent={3} color="error"><Notifications /></Badge></IconButton>
            <IconButton color="inherit"><AccountCircle /></IconButton>
          </Toolbar>
        </AppBar>

    {/* Filters */}
      <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          >
            <MenuItem value="Kenya">Kenya</MenuItem>
            <MenuItem value="Tanzania">Tanzania</MenuItem>
            <MenuItem value="Rwanda">Rwanda</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Facility</InputLabel>
          <Select
            value={filters.facility}
            onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
          >
            <MenuItem value="Facility A">Facility A</MenuItem>
            <MenuItem value="Facility B">Facility B</MenuItem>
          </Select>
        </FormControl>
        <input
          type="date"
          className="w-full p-2 border rounded"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          title="Select Date"
          placeholder="Select Date"
        />
      </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-indigo-100">
            <CardContent>
              <h2 className="text-lg font-semibold">Total Screenings</h2>
              <p className="text-2xl">{data.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-100">
            <CardContent>
              <h2 className="text-lg font-semibold">At-Risk Patients</h2>
              <p className="text-2xl text-red-500">{data.filter(d => d.risk_level === "High").length}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-100">
            <CardContent>
              <h2 className="text-lg font-semibold">Average BP Levels</h2>
              <p className="text-2xl">{(data.reduce((sum, d) => sum + (d.avg_systolic ?? 0), 0) / data.length).toFixed(1)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">BP Trends</h2>
              <Line data={{
                labels: data.map(d => d.date),
                datasets: [{ label: "Avg Systolic", data: data.map(d => d.avg_systolic), borderColor: "#ff6384" }]
              }} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Screenings by Facility</h2>
              <Bar data={{
                labels: [...new Set(data.map(d => d.facility))],
                datasets: [{ label: "Total", data: data.map(d => d.screenings), backgroundColor: "#36a2eb" }]
              }} />
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <Button variant="contained" color="primary" onClick={fetchData}>Refresh Data</Button>
      </div>
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardActions } from '@mui/material';
// import { Button } from '@mui/material';
// import { Line, Bar } from "react-chartjs-2";
// import "chart.js/auto";
// import axios from "axios";

// // Define the PatientScreening type
// type PatientScreening = {
//     risk_level?: string;
//     avg_systolic?: number;
//     date?: string;
//     facility?: string;
//     screenings?: number;
//   };

// export default function ScreeningDashboard() {
// //   const [data, setData] = useState([]);
//   const [data, setData] = useState<PatientScreening[]>([]);
//   const [filters, setFilters] = useState({ country: "", facility: "", date: "" });

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get("/api/screening-data", { params: filters });
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-semibold">Patient Screening Dashboard</h1>
      
//       {/* Filters */}
//       <div className="grid grid-cols-3 gap-4">
//         <label>
//           Country
//           <input
//             type="text"
//             placeholder="Country"
//             className="p-2 border rounded"
//             onChange={(e) => setFilters({ ...filters, country: e.target.value })}
//           />
//         </label>
//         <label>
//           Facility
//           <input
//             type="text"
//             placeholder="Facility"
//             className="p-2 border rounded"
//             onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
//           />
//         </label>
//         <label>
//           Date
//           <input
//             type="date"
//             className="p-2 border rounded"
//             onChange={(e) => setFilters({ ...filters, date: e.target.value })}
//           />
//         </label>
//       </div>
      
//       {/* Summary Cards */}
//       <div className="grid grid-cols-3 gap-4">
//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold">Total Screenings</h2>
//             <p className="text-xl">{data.length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold">At-Risk Patients</h2>
//             <p className="text-xl text-red-500">{data.filter(d => d.risk_level === "High").length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold">Average BP Levels</h2>
//             {/* <p className="text-xl">{(data.reduce((sum, d) => sum + d.avg_systolic, 0) / data.length).toFixed(1)}</p> */}
//             <p className="text-xl">{(data.reduce((sum, d) => sum + (d.avg_systolic ?? 0), 0) / data.length).toFixed(1)}</p>
//           </CardContent>
//         </Card>
//       </div>
      
//       {/* Charts */}
//       <div className="grid grid-cols-2 gap-4">
//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold">BP Trends</h2>
//             <Line data={{
//               labels: data.map(d => d.date),
//               datasets: [{ label: "Avg Systolic", data: data.map(d => d.avg_systolic), borderColor: "#ff6384" }]
//             }} />
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             <h2 className="text-lg font-semibold">Screenings by Facility</h2>
//             <Bar data={{
//               labels: [...new Set(data.map(d => d.facility))],
//               datasets: [{ label: "Total", data: data.map(d => d.screenings), backgroundColor: "#36a2eb" }]
//             }} />
//           </CardContent>
//         </Card>
//       </div>
      
//       {/* Refresh Button */}
//       <Button onClick={fetchData}>Refresh Data</Button>
//     </div>
//   );
// }
