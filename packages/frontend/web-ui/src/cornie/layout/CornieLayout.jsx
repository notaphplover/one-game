import { Box } from '@mui/material';
import { Footer, Navbar } from '../components';

export const CornieLayout = ({children}) => {
  return (
    <Box sx={{display: 'flex'}}>

      <Navbar />

      <Footer />
      {children}

      
    </Box>
  )
}
