import { Theme } from '@emotion/react';
import {
  createTheme,
  PaletteOptions,
  SimplePaletteColorOptions,
} from '@mui/material/styles';

interface CorniePaletteOptions extends PaletteOptions {
  primary: SimplePaletteColorOptions;
  secondary: SimplePaletteColorOptions;
}

const corniePalette: CorniePaletteOptions = {
  primary: {
    contrastText: '#fff',
    dark: '#631976',
    light: '#a44fbb',
    main: '#8e24aa',
  },
  secondary: {
    contrastText: '#000',
    dark: '#a359b0',
    light: '#ee99fc',
    main: '#ea80fc',
  },
};

export const cornieTheme: Theme = createTheme({
  components: {
    MuiFormLabel: {
      defaultProps: {
        style: {
          color: corniePalette.secondary.dark,
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        style: {
          color: corniePalette.secondary.dark,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'inherit',
            },
          },
        },
      },
    },
  },
  palette: corniePalette,
});
