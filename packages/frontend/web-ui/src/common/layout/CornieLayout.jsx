import { Box } from '@mui/material';
import { Footer, Navbar } from '../components';

export const CornieLayout = ({ children }) => {
  return (
    <Box className="bkg-layout">
      <Navbar />

      {children}

      <Footer />
    </Box>
  );
};
