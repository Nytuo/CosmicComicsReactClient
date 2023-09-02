import { ThemeOptions } from '@mui/material/styles';

export const LightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#CCCDCE',
    },
    secondary: {
      main: '#464ce8',
    },
    background: {
      default: "linear-gradient(to top left, #c4c4c4, #ffffff) no-repeat fixed",
      paper: '#ffffff',
    },
    error: {
      main: '#c62828',
    },
    warning: {
      main: '#f57c00',
    },
    info: {
      main: '#0277bd',
    },
    success: {
      main: '#1b5e20',
    },
    divider: 'rgba(39,39,39,0.12)',
  },
};