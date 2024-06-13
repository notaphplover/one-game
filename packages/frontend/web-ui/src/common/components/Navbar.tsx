import {
  AccountCircleOutlined,
  AppRegistrationOutlined,
  LoginOutlined,
  LogoutOutlined,
  VideogameAssetRounded,
} from '@mui/icons-material';
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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logout from '../../app/store/actions/logout';
import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';

enum NavbarPageName {
  login = 'LOGIN',
  register = 'REGISTER',
  user = 'USER',
  logout = 'LOGOUT',
}

const NAVBAR_PAGE_NAME_TO_PAGE_SLUG_MAP: { [TPage in NavbarPageName]: string } =
  {
    [NavbarPageName.login]: '/auth/login',
    [NavbarPageName.register]: '/auth/register',
    [NavbarPageName.user]: '/user',
    [NavbarPageName.logout]: '/',
  };

function getSlug(page: NavbarPageName): string {
  return NAVBAR_PAGE_NAME_TO_PAGE_SLUG_MAP[page];
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

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box className="navbar-options-menu-icon">
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
                horizontal: 'left',
                vertical: 'bottom',
              }}
              keepMounted
              transformOrigin={{
                horizontal: 'left',
                vertical: 'top',
              }}
              open={Boolean(anchorNav)}
              onClose={handleCloseNavMenu}
            >
              {auth === null ? (
                <Box>
                  <MenuItem
                    className="navbar-menu-item"
                    key={NavbarPageName.login}
                    onClick={handleCloseNavMenu}
                  >
                    <Link
                      className="navbar_link"
                      to={getSlug(NavbarPageName.login)}
                    >
                      {NavbarPageName.login}
                    </Link>
                  </MenuItem>
                  <MenuItem
                    className="navbar-menu-item"
                    key={NavbarPageName.register}
                    onClick={handleCloseNavMenu}
                  >
                    <Link
                      className="navbar_link"
                      to={getSlug(NavbarPageName.register)}
                    >
                      {NavbarPageName.register}
                    </Link>
                  </MenuItem>
                </Box>
              ) : (
                <Box>
                  <MenuItem
                    className="navbar-menu-item"
                    key={NavbarPageName.user}
                    onClick={handleCloseNavMenu}
                  >
                    <Link
                      className="navbar_link"
                      to={getSlug(NavbarPageName.user)}
                    >
                      {NavbarPageName.user}
                    </Link>
                  </MenuItem>
                  <MenuItem
                    className="navbar-menu-item"
                    key={NavbarPageName.logout}
                    onClick={handleCloseNavMenu}
                  >
                    <Button
                      type="button"
                      className="navbar_link_button"
                      onClick={onLogout}
                    >
                      {NavbarPageName.logout}
                    </Button>
                  </MenuItem>
                </Box>
              )}
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

          <Box className="navbar-options-menu">
            {auth === null ? (
              <>
                <Button
                  component="a"
                  className="navbar-option"
                  href={getSlug(NavbarPageName.login)}
                  startIcon={<LoginOutlined />}
                >
                  {NavbarPageName.login}
                </Button>
                <Button
                  component="a"
                  className="navbar-option"
                  href={getSlug(NavbarPageName.register)}
                  startIcon={<AppRegistrationOutlined />}
                >
                  {NavbarPageName.register}
                </Button>
              </>
            ) : (
              <>
                <Button
                  component="a"
                  className="navbar-option"
                  href={getSlug(NavbarPageName.user)}
                  startIcon={<AccountCircleOutlined />}
                >
                  {NavbarPageName.user}
                </Button>
                <Button
                  type="button"
                  className="navbar-option"
                  startIcon={<LogoutOutlined />}
                  onClick={onLogout}
                >
                  {NavbarPageName.logout}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
