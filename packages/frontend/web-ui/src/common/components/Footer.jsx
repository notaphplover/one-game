import { Box, Grid, Slider } from '@mui/material';

export const Footer = () => {
  return (
      <Grid 
          container
          component="footer"
          sx={{ mt: 6, backgroundColor: 'primary.dark' }}
      >

        <Grid item
          sx={{
              width: '80%',
              //backgroundColor: '#fff', 
              padding: 4, 
              borderRadius: 2
          }}
        >

        </Grid>

      </Grid>
  )
}
