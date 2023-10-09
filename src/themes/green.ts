import {ThemeOptions} from '@mui/material/styles';

export const GreenTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#464ce8',
        },
        background: {
            default: "linear-gradient(to top left, #004804, #007902) no-repeat fixed",
            paper: '#004804',
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