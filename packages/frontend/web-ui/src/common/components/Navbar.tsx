import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logout from '../../app/store/actions/logout';
import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { getSlug } from '../helpers/getSlug';
import { NavbarPageName } from '../models/NavbarPageName';
import { NavbarOptions } from './NavbarOptions';
import { NavbarUserMenu } from './NavbarUserMenu';

export const Navbar = (): React.JSX.Element => {
  const [anchorNav, setAnchorNav] = useState<(EventTarget & Element) | null>(
    null,
  );

  const handleOpenNavMenu: React.MouseEventHandler = (
    event: React.MouseEvent,
  ) => {
    setAnchorNav(event.currentTarget);
  };

  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(logout());
    navigate(getSlug(NavbarPageName.logout), {
      replace: true,
    });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            className="logo-cornie-navbar-text"
            variant="h6"
            noWrap
            component="a"
            href="/"
          >
            CORNIE
          </Typography>

          <Box className="navbar-options-menu-icon">
            <IconButton
              size="large"
              aria-label="account-current-user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <Avatar />
            </IconButton>

            <NavbarUserMenu
              auth={auth}
              onLogout={onLogout}
              setUserMenuAnchorNav={setAnchorNav}
              userMenuAnchorNav={anchorNav}
            />
          </Box>

          <NavbarOptions auth={auth} onLogout={onLogout} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
