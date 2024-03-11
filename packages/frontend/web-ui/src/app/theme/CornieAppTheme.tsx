import { CssBaseline, ThemeProvider } from '@mui/material';
import { cornieTheme } from './cornieTheme';
import React from 'react';

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
