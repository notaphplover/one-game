import { Box } from '@mui/material';
import React from 'react';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { NavbarWithAuth } from '../components/NavbarWithAuth';

function getLayoutBoxClassName(params: CornieLayoutParams): string {
  const layoutBoxClassNames = ['bkg-layout'];

  if (params.withFooter === true) {
    const additionalClass =
      params.withNavBar ?? false ? 'fixed-navbar-footer' : 'fixed-footer';

    layoutBoxClassNames.push(additionalClass);
  }

  return layoutBoxClassNames.join(' ');
}

interface CornieLayoutParams {
  children: React.JSX.Element | React.JSX.Element[];
  id?: string;
  withFooter?: boolean;
  withNavBar?: boolean;
}

export const CornieLayout = (params: CornieLayoutParams): React.JSX.Element => {
  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  let navbar: React.JSX.Element | undefined;

  if (auth !== null) {
    navbar = params.withNavBar ?? false ? <NavbarWithAuth /> : undefined;
  } else {
    navbar = params.withNavBar ?? false ? <Navbar /> : undefined;
  }
  const footer = params.withFooter ?? false ? <Footer /> : undefined;

  return (
    <Box
      component="div"
      className={getLayoutBoxClassName(params)}
      id={params.id}
    >
      {navbar}

      <article>{params.children}</article>

      {footer}
    </Box>
  );
};
