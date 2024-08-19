import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logout from '../../app/store/actions/logout';
import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { getSlug } from '../helpers/getSlug';
import { NavbarPageName } from '../models/NavbarPageName';
import { NavbarGamesMenu } from './NavbarGamesMenu';
import { NavbarOptions } from './NavbarOptions';
import { NavbarUserMenu } from './NavbarUserMenu';

export const Navbar = (): React.JSX.Element => {
  const [gamesMenuAnchorNav, setGamesMenuAnchorNav] = useState<
    (EventTarget & Element) | null
  >(null);
  const [userMenuAnchorNav, setUserMenuAnchorNav] = useState<
    (EventTarget & Element) | null
  >(null);

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

          <NavbarOptions
            auth={auth}
            setGamesMenuAnchorNav={setGamesMenuAnchorNav}
            setUserMenuAnchorNav={setUserMenuAnchorNav}
          />
        </Toolbar>
        <NavbarGamesMenu
          setGamesMenuAnchorNav={setGamesMenuAnchorNav}
          gamesMenuAnchorNav={gamesMenuAnchorNav}
        />
        <NavbarUserMenu
          auth={auth}
          onLogout={onLogout}
          setUserMenuAnchorNav={setUserMenuAnchorNav}
          userMenuAnchorNav={userMenuAnchorNav}
        />
      </Container>
    </AppBar>
  );
};
