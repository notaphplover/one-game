import { CssBaseline, ThemeProvider } from '@mui/material';
import { cornieTheme } from './';

export const CornieAppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={cornieTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
