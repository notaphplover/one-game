import { AppBar, Toolbar, IconButton, Grid, Typography, MenuItem, Menu } from '@mui/material';
import { LogoutOutlined, MenuOutlined } from '@mui/icons-material';

export const Navbar = ({drawerWidth = 240}) => {
  return (
    <AppBar
        position='fixed'
        sx={{bgcolor:"primary.main"}}
    >   
        <Toolbar> 
            <IconButton
                edge='start'
                sx={{mr: 2, color:'primary.white'}}
            > 
              <MenuOutlined fontSize='large'/> 
            </IconButton>

            <Grid 
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                 <Typography variant='h6' noWrap component='div'>{`Cornie's Game`}</Typography> 

                <IconButton sx={{color: 'primary.white'}}>
                    <LogoutOutlined fontSize='large'/>
                </IconButton>

            </Grid>
        </Toolbar>

    </AppBar>
  )
}
