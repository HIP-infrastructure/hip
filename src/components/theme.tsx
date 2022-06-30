import * as React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
	palette: {
		primary: {
			main: '#0095a8',
		},
		secondary: {
			main: '#37474f',
		},
	},
})

const Theme = ({ children }: { children: JSX.Element }) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default Theme
