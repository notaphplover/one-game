import { Box, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { getSlug } from '../helpers/getSlug';
import { NavbarPageName } from '../models/NavbarPageName';

export interface NavbarMenuParams {
  auth: AuthenticatedAuthState | null;
  onLogout: (event: React.FormEvent) => void;
  setUserMenuAnchorNav: React.Dispatch<
    React.SetStateAction<(EventTarget & Element) | null>
  >;
  userMenuAnchorNav: (EventTarget & Element) | null;
}

const buildCloseUserMenu = (params: NavbarMenuParams) => () => {
  params.setUserMenuAnchorNav(null);
};

const NavbarUserMenuItems = (params: NavbarMenuParams): React.JSX.Element => {
  if (params.auth === null) {
    return (
      <Box>
        <MenuItem
          className="navbar-menu-item"
          key={NavbarPageName.login}
          onClick={buildCloseUserMenu(params)}
        >
          <Link className="navbar-link" to={getSlug(NavbarPageName.login)}>
            {NavbarPageName.login}
          </Link>
        </MenuItem>
        <MenuItem
          className="navbar-menu-item"
          key={NavbarPageName.register}
          onClick={buildCloseUserMenu(params)}
        >
          <Link className="navbar-link" to={getSlug(NavbarPageName.register)}>
            {NavbarPageName.register}
          </Link>
        </MenuItem>
      </Box>
    );
  }

  return (
    <Box>
      <MenuItem
        className="navbar-menu-item"
        key={NavbarPageName.user}
        onClick={buildCloseUserMenu(params)}
      >
        <Link className="navbar-link" to={getSlug(NavbarPageName.user)}>
          {NavbarPageName.user}
        </Link>
      </MenuItem>
      <MenuItem
        className="navbar-menu-item"
        key={NavbarPageName.logout}
        onClick={buildCloseUserMenu(params)}
      >
        <Link
          className="navbar-link"
          onClick={params.onLogout}
          to={getSlug(NavbarPageName.logout)}
        >
          {NavbarPageName.logout}
        </Link>
      </MenuItem>
    </Box>
  );
};

export const NavbarUserMenu = (params: NavbarMenuParams): React.JSX.Element => {
  const isNavBarOpen = (): boolean => params.userMenuAnchorNav !== null;

  const handleCloseNavMenu = () => {
    params.setUserMenuAnchorNav(null);
  };

  return (
    <Menu
      className="menu-navbar"
      id="menu-appbar"
      anchorEl={params.userMenuAnchorNav}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      keepMounted
      transformOrigin={{
        horizontal: 'left',
        vertical: 'top',
      }}
      open={isNavBarOpen()}
      onClose={handleCloseNavMenu}
    >
      <NavbarUserMenuItems {...params} />
    </Menu>
  );
};
