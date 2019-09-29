// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { createMuiTheme } from '@material-ui/core/styles';
import { blue, pink }     from '@material-ui/core/colors';



export const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const theme = createMuiTheme({
    palette: isDark ? {
        type: 'dark',
        primary: {
            main: blue[500],
        },
        secondary: {
            main: pink[500],
        },
    } : {
        type: 'light',
        primary: {
            main: blue[500],
        },
        secondary: {
            main: pink[500],
        },
    },
});
