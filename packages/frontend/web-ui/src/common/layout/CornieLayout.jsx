import { Box } from '@mui/material';
import { Footer, Navbar } from '../components';

export const CornieLayout = ({ children }) => {
  return (
    <Box sx={{ bgcolor: 'secondary.light' }}>
      <Navbar />

      {children}

      <Footer />
    </Box>
  );
};
