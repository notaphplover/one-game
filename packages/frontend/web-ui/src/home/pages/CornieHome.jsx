import { Box, Container, Grid, Typography } from '@mui/material';
import { CornieLayout } from '../../common/layout/CornieLayout';

export const CornieHome= () => {
  return (
    <CornieLayout >
       
       <Grid container
              sx={{margin: '0 auto', maxWidth: '1200px'}}>
            
            <Box component="span" sx={{ p: 10, color: 'primary.dark'}}>
                <Typography variant="h3" component="h3" 
                    sx={{textAlign: 'center', lineHeight: 2, fontWeight: 'bold'}}>Welcome to Cornie's Game</Typography> 
                <Grid container spacing={3}
                  direction="row"
                  justifyContent="space-between"
                >

                  <Grid item md={4} xs={12} sx={{p: 1, mt: 2}}>
                    <img src="src/home/images/unicorn.avif" 
                         loading="lazy"
                         alt="Cornie Unicorn"
                         width = "320" 
                         height = "450" />
                  </Grid>
                  <Grid item md={8} xs={12} sx={{p: 1, mt: 2}}>
                    <Typography component="p" sx={{textAlign: 'justify', lineHeight: 2}}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy 
                        text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has 
                        survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was 
                        popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop 
                        publishing software like Aldus PageMaker including versions of Lorem Ipsum.<br />
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy 
                        text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has 
                        survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was 
                        popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop 
                        publishing software like Aldus PageMaker including versions of Lorem Ipsum.<br />
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy 
                        text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has 
                        survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was 
                        popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop 
                        publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Typography>
                  </Grid>
                </Grid>
            </Box>

        </Grid>

    </CornieLayout>
  )
};
