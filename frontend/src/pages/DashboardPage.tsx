import { Box, Typography } from "@mui/material";

const DashboardPage = () => {
  return (
    <Box sx={{backgroundColor: "primary.main"}}>
      <Typography variant="h4">Це Головна сторінка (Dashboard)</Typography>
      <Typography>Тут будуть компоненти з графіками та історією.</Typography>
    </Box>
  );
};

export default DashboardPage;