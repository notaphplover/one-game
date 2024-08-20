import {
  AccountCircleOutlined,
  AppRegistrationOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { Box, Button, Menu, MenuItem } from '@mui/material';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { getSlug } from '../helpers/getSlug';
import { PageName } from '../models/PageName';

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
          key={PageName.login}
          onClick={buildCloseUserMenu(params)}
        >
          <Button
            component="a"
            className="navbar-link"
            href={getSlug(PageName.login)}
            startIcon={<LoginOutlined />}
          >
            LOGIN
          </Button>
        </MenuItem>
        <MenuItem
          className="navbar-menu-item"
          key={PageName.register}
          onClick={buildCloseUserMenu(params)}
        >
          <Button
            component="a"
            className="navbar-link"
            href={getSlug(PageName.register)}
            startIcon={<AppRegistrationOutlined />}
          >
            REGISTER
          </Button>
        </MenuItem>
      </Box>
    );
  }

  return (
    <Box>
      <MenuItem
        className="navbar-menu-item"
        key={PageName.userMe}
        onClick={buildCloseUserMenu(params)}
      >
        <Button
          component="a"
          className="navbar-link"
          href={getSlug(PageName.userMe)}
          startIcon={<AccountCircleOutlined />}
        >
          PROFILE
        </Button>
      </MenuItem>
      <MenuItem
        className="navbar-menu-item"
        key={PageName.home}
        onClick={buildCloseUserMenu(params)}
      >
        <Button
          component="a"
          className="navbar-link"
          href={getSlug(PageName.home)}
          onClick={params.onLogout}
          startIcon={<LogoutOutlined />}
        >
          LOGOUT
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
