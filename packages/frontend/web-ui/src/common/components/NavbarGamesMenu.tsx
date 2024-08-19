import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Menu, MenuItem } from '@mui/material';

import { getSlug } from '../helpers/getSlug';
import { NavbarPageName } from '../models/NavbarPageName';

export interface NavbarGamesMenuParams {
  setGamesMenuAnchorNav: React.Dispatch<
    React.SetStateAction<(EventTarget & Element) | null>
  >;
  gamesMenuAnchorNav: (EventTarget & Element) | null;
}

const buildCloseMenu = (params: NavbarGamesMenuParams) => () => {
  params.setGamesMenuAnchorNav(null);
};

const NavbarGamesMenuItems = (
  params: NavbarGamesMenuParams,
): React.JSX.Element => {
  return (
    <Box>
      <MenuItem
        className="navbar-menu-item"
        key={NavbarPageName.createGame}
        onClick={buildCloseMenu(params)}
      >
        <Button
          component="a"
          className="navbar-link"
          href={getSlug(NavbarPageName.createGame)}
          startIcon={<AddIcon />}
        >
          {NavbarPageName.createGame}
        </Button>
      </MenuItem>
    </Box>
  );
};

export const NavbarGamesMenu = (
  params: NavbarGamesMenuParams,
): React.JSX.Element => {
  const isNavBarOpen = (): boolean => params.gamesMenuAnchorNav !== null;

  const handleCloseNavMenu = () => {
    params.setGamesMenuAnchorNav(null);
  };

  return (
    <Menu
      className="menu-navbar"
      id="games-menu-appbar"
      anchorEl={params.gamesMenuAnchorNav}
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
      <NavbarGamesMenuItems {...params} />
    </Menu>
  );
};
