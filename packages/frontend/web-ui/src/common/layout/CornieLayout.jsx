import { Box } from '@mui/material';
import { Footer, Navbar } from '../components';

export const CornieLayout = ({ children }) => {
  return (
    <Box className="bkg-layout">
      <Navbar />

      <article>{children}</article>

      <Footer />
    </Box>
  );
};
