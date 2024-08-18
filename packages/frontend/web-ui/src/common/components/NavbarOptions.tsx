import {
  AccountCircleOutlined,
  AppRegistrationOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { getSlug } from '../helpers/getSlug';
import { NavbarPageName } from '../models/NavbarPageName';

export interface MenuOptionsParams {
  auth: AuthenticatedAuthState | null;
  onLogout: (event: React.FormEvent) => void;
}

const NavbarOptionsContents = (
  params: MenuOptionsParams,
): React.JSX.Element => {
  if (params.auth === null) {
    return (
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
    );
  }

  return (
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
        onClick={params.onLogout}
      >
        {NavbarPageName.logout}
      </Button>
    </>
  );
};

export const NavbarOptions = (params: MenuOptionsParams): React.JSX.Element => {
  return (
    <Box className="navbar-options-menu">
      <NavbarOptionsContents {...params} />
    </Box>
  );
};
