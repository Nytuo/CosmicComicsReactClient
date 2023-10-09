import {ThemeOptions} from '@mui/material/styles';

export const BlueTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#464ce8',
        },
        background: {
            default: "linear-gradient(to top left, #001450, #004bff) no-repeat fixed",
            paper: '#001450',
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