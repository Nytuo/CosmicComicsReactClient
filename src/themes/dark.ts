import {ThemeOptions} from '@mui/material/styles';

export const DarkTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#464ce8',
        },
        background: {
            default: "linear-gradient(to top left, #1c1c1c, #000000) no-repeat fixed",
            paper: '#1c1c1c',
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
        divider: 'rgba(53,53,53,0.6)',
    },
};