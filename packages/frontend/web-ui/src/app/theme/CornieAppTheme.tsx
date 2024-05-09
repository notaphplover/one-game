import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';

import { cornieTheme } from './cornieTheme';

interface CornieThemeParams {
  children: React.JSX.Element | React.JSX.Element[];
}

export const CornieAppTheme = (param: CornieThemeParams): React.JSX.Element => {
  return (
    <ThemeProvider theme={cornieTheme}>
      <CssBaseline />
      {param.children}
    </ThemeProvider>
  );
};
