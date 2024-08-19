import { AccountCircle } from '@mui/icons-material';
import GamesIcon from '@mui/icons-material/Games';
import { Box, Button } from '@mui/material';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';

export interface MenuOptionsParams {
  auth: AuthenticatedAuthState | null;
  setGamesMenuAnchorNav: (
    value: React.SetStateAction<(EventTarget & Element) | null>,
  ) => void;
  setUserMenuAnchorNav: (
    value: React.SetStateAction<(EventTarget & Element) | null>,
  ) => void;
}

const NavbarOptionsContents = (
  params: MenuOptionsParams,
): React.JSX.Element => {
  const handleOpenGamesMenu: React.MouseEventHandler = (
    event: React.MouseEvent,
  ) => {
    params.setGamesMenuAnchorNav(event.currentTarget);
  };
  const handleOpenUserMenu: React.MouseEventHandler = (
    event: React.MouseEvent,
  ) => {
    params.setUserMenuAnchorNav(event.currentTarget);
  };

  if (params.auth === null) {
    return (
      <>
        <Button
          aria-label="account-menu-button"
          aria-controls="user-menu-appbar"
          aria-haspopup="true"
          className="navbar-option"
          component="button"
          onClick={handleOpenUserMenu}
          startIcon={<AccountCircle />}
        >
          <span className="navbar-option-text">ACCOUNT</span>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        aria-label="games-menu-button"
        aria-controls="games-menu-appbar"
        aria-haspopup="true"
        className="navbar-option"
        component="button"
        onClick={handleOpenGamesMenu}
        startIcon={<GamesIcon />}
      >
        <span className="navbar-option-text">GAMES</span>
      </Button>
      <Button
        aria-label="account-menu-button"
        aria-controls="user-menu-appbar"
        aria-haspopup="true"
        className="navbar-option"
        component="button"
        onClick={handleOpenUserMenu}
        startIcon={<AccountCircle />}
      >
        <span className="navbar-option-text">ACCOUNT</span>
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
