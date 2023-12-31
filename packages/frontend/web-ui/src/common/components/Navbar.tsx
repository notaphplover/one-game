import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import { VideogameAssetRounded } from '@mui/icons-material';

enum PageName {
  aboutUs = 'ABOUT US',
  login = 'LOGIN',
  register = 'REGISTER',
}

const PAGE_NAME_TO_PAGE_SLUG_MAP: { [TPage in PageName]: string } = {
  [PageName.aboutUs]: '/about',
  [PageName.login]: '/auth/login',
  [PageName.register]: '/auth/register',
};

function getSlug(page: PageName): string {
  return PAGE_NAME_TO_PAGE_SLUG_MAP[page];
}

export const Navbar = (): React.JSX.Element => {
  const [anchorNav, setAnchorNav] = useState<(EventTarget & Element) | null>(
    null,
  );

  const handleOpenNavMenu: React.MouseEventHandler = (
    event: React.MouseEvent,
  ) => {
    setAnchorNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
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
              {Object.values(PageName).map((page: PageName) => (
                <MenuItem
                  className="navbar-menu-item"
                  key={page}
                  onClick={handleCloseNavMenu}
                >
                  <Link className="navbar_link" to={getSlug(page)}>
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              ml: 3,
              mr: 5,
              fontFamily: 'Gochi Hand',
              fontWeight: 'bold',
              fontSize: 25,
              letterSpacing: '.3rem',
              color: 'primary.white',
              textDecoration: 'none',
            }}
          >
            CORNIE
          </Typography>

          <Box
            justifyContent="flex-end"
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >
            {Object.values(PageName).map((page: PageName) => (
              <Button
                component="a"
                href={getSlug(page)}
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
