import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#37474f',
        },
        secondary: {
            main: '#7697A8'
        }
    },
});

const Theme = ({ children }: { children: JSX.Element }) =>
    <ThemeProvider theme={theme} >
        {children}
    </ThemeProvider>

export default Theme
