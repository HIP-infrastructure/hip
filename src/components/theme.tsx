import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#37474f',
        },
        secondary: {
            main: '#9e9d24'
        }
    },
});

const Theme = ({ children }: { children: JSX.Element }) =>
    <ThemeProvider theme={theme} >
        {children}
    </ThemeProvider>

export default Theme
