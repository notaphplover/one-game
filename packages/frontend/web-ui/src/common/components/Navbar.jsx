import { useState } from 'react';
import { Link, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
  Grid,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { VideogameAssetRounded } from '@mui/icons-material';

const pages = ['ABOUT US', 'REGISTER', 'LOGIN'];

export const Navbar = () => {
  const [anchorNav, setAnchorNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };

  const directTo = (page) => {
    return page === 'REGISTER'
      ? '/auth/register'
      : page === 'LOGIN'
        ? '/auth/login'
        : '/about';
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account-current-user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <VideogameAssetRounded />
            </IconButton>

            <Menu
              className="menu_navbar"
              id="menu-appbar"
              anchorEl={anchorNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'flex', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  className="navbar-menu-item"
                  key={page}
                  onClick={handleCloseNavMenu}
                >
                  <Link
                    className="navbar_link"
                    component={RouterLink}
                    to={directTo(page)}
                  >
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            className="logo-cornie-navbar-text"
            variant="h6"
            noWrap
            component="a"
            href="/"
          >
            CORNIE
          </Typography>

          <Box
            justifyContent="flex-end"
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >
            {pages.map((page) => (
              <Button
                component="a"
                href={directTo(page)}
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
