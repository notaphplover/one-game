import { Box } from '@mui/material';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import React from 'react';

function getLayoutBoxClassName(params: CornieLayoutParams): string {
  let layoutBoxClassNames = ['bkg-layout'];

  if (params.withFooter) {
    const additionalClass = params.withNavBar
      ? 'fixed-navbar-footer'
      : 'fixed-footer';

    layoutBoxClassNames.push(additionalClass);
  }

  return layoutBoxClassNames.join(' ');
}

interface CornieLayoutParams {
  children: React.JSX.Element[];
  withFooter?: boolean;
  withNavBar?: boolean;
}

export const CornieLayout = (params: CornieLayoutParams): React.JSX.Element => {
  const navbar = params.withNavBar ? <Navbar /> : undefined;
  const footer = params.withFooter ? <Footer /> : undefined;

  return (
    <Box className={getLayoutBoxClassName(params)}>
      {navbar}

      <article>{params.children}</article>

      {footer}
    </Box>
  );
};
