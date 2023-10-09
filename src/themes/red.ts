import {ThemeOptions} from '@mui/material/styles';

export const RedTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#464ce8',
        },
        background: {
            default: 'linear-gradient(to top left, #570000, #ad0000) no-repeat fixed',
            paper: '#570000',
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