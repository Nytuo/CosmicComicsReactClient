import { ThemeOptions } from '@mui/material/styles';

export const SithTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#464ce8',
    },
    background: {
      default: "url('https://cdn-images-1.medium.com/max/2000/1*KrfOi7vg-5Dz-hGifK8ynA.gif') center/cover no-repeat fixed",
      paper: '#c62828',
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