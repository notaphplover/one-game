import {
  AccountCircleOutlined,
  AppRegistrationOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { Box, Button, Menu, MenuItem } from '@mui/material';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { getSlug } from '../helpers/getSlug';
import { NavbarPageName } from '../models/NavbarPageName';

export interface NavbarUserMenuParams {
  auth: AuthenticatedAuthState | null;
  onLogout: (event: React.FormEvent) => void;
  setUserMenuAnchorNav: React.Dispatch<
    React.SetStateAction<(EventTarget & Element) | null>
  >;
  userMenuAnchorNav: (EventTarget & Element) | null;
}

const buildCloseUserMenu = (params: NavbarUserMenuParams) => () => {
  params.setUserMenuAnchorNav(null);
};

const NavbarUserMenuItems = (
  params: NavbarUserMenuParams,
): React.JSX.Element => {
  if (params.auth === null) {
    return (
      <Box>
        <MenuItem
          className="navbar-menu-item"
          key={NavbarPageName.login}
          onClick={buildCloseUserMenu(params)}
        >
          <Button
            component="a"
            className="navbar-link"
            href={getSlug(NavbarPageName.login)}
            startIcon={<LoginOutlined />}
          >
            {NavbarPageName.login}
          </Button>
        </MenuItem>
        <MenuItem
          className="navbar-menu-item"
          key={NavbarPageName.register}
          onClick={buildCloseUserMenu(params)}
        >
          <Button
            component="a"
            className="navbar-link"
            href={getSlug(NavbarPageName.register)}
            startIcon={<AppRegistrationOutlined />}
          >
            {NavbarPageName.register}
          </Button>
        </MenuItem>
      </Box>
    );
  }

  return (
    <Box>
      <MenuItem
        className="navbar-menu-item"
        key={NavbarPageName.userMe}
        onClick={buildCloseUserMenu(params)}
      >
        <Button
          component="a"
          className="navbar-link"
          href={getSlug(NavbarPageName.userMe)}
          startIcon={<AccountCircleOutlined />}
        >
          {NavbarPageName.userMe}
        </Button>
      </MenuItem>
      <MenuItem
        className="navbar-menu-item"
        key={NavbarPageName.logout}
        onClick={buildCloseUserMenu(params)}
      >
        <Button
          component="a"
          className="navbar-link"
          href={getSlug(NavbarPageName.logout)}
          onClick={params.onLogout}
          startIcon={<LogoutOutlined />}
        >
          {NavbarPageName.logout}
        </Button>
      </MenuItem>
    </Box>
  );
};

export const NavbarUserMenu = (
  params: NavbarUserMenuParams,
): React.JSX.Element => {
  const isNavBarOpen = (): boolean => params.userMenuAnchorNav !== null;

  const handleCloseNavMenu = () => {
    params.setUserMenuAnchorNav(null);
  };

  return (
    <Menu
      className="menu-navbar"
      id="user-menu-appbar"
      anchorEl={params.userMenuAnchorNav}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      keepMounted
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      open={isNavBarOpen()}
      onClose={handleCloseNavMenu}
    >
      <NavbarUserMenuItems {...params} />
    </Menu>
  );
};
