import { createTheme } from '@mui/material/styles';

/** @type {import("@mui/material/styles").PaletteOptions } */
const corniePalette = {
  primary: {
    white: '#fff',
    light: '#a44fbb',
    main: '#8e24aa',
    dark: '#631976',
    contrastText: '#fff',
  },
  secondary: {
    light: '#ee99fc',
    main: '#ea80fc',
    dark: '#a359b0',
    contrastText: '#000',
  },
};

export const cornieTheme = createTheme({
  palette: corniePalette,
  components: {
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
  },
});
