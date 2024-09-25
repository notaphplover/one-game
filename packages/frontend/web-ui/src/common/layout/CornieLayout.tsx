import { Box } from '@mui/material';
import React from 'react';

import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

function getLayoutBoxClassName(params: CornieLayoutParams): string {
  const layoutBoxClassNames = ['bkg-layout'];

  if (params.withFooter === true) {
    const additionalClass =
      (params.withNavBar ?? false) ? 'fixed-navbar-footer' : 'fixed-footer';

    layoutBoxClassNames.push(additionalClass);
  }

  return layoutBoxClassNames.join(' ');
}

export interface CornieLayoutParams {
  children: React.JSX.Element | React.JSX.Element[];
  id?: string;
  withFooter?: boolean;
  withNavBar?: boolean;
}

export const CornieLayout = (params: CornieLayoutParams): React.JSX.Element => {
  const navbar = (params.withNavBar ?? false) ? <Navbar /> : undefined;
  const footer = (params.withFooter ?? false) ? <Footer /> : undefined;

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
