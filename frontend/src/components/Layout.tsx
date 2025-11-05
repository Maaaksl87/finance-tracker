// frontend/src/components/Layout/Layout.tsx

import { Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar, // Важливо для відступу
} from "@mui/material";

// Іконки
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import SmartToyIcon from "@mui/icons-material/SmartToy";


const DRAWER_WIDTH = 210; // ширина sidebar

const Layout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* 1. SIDEBAR (DRAWER) */}
      <Drawer
        variant="permanent" // Завжди видимий
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5", // Трохи інший фон
          },
        }}
      >
        {/* Toolbar додає потрібний відступ зверху, 
            щоб контент не залазив під Appbar (який ми можемо додати пізніше) */}
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {/* Тут ми будемо мапити наші посилання */}
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* <DashboardIcon /> */}
                </ListItemIcon>
                <ListItemText primary="Головна" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* <BarChartIcon /> */}
                </ListItemIcon>
                <ListItemText primary="Звіти" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* <SmartToyIcon /> */}
                </ListItemIcon>
                <ListItemText primary="AI-помічник" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* 2. ОСНОВНИЙ КОНТЕНТ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Займає весь простір, що залишився
          p: 3, // Внутрішній відступ (padding)
          backgroundColor: "#fff",
          minHeight: "100vh", // На всю висоту екрану
        }}
      >
        {/* Toolbar для відступу, такий самий як у Drawer */}
        <Toolbar />

        {/* Сюди 'react-router-dom' буде рендерити нашу сторінку 
            (DashboardPage, AiPage і т.д.) */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;