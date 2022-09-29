import * as React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// See https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=37474f&secondary.color=0277BD

const colors = {
	primary: '#0277bd',
	secondary: '#37474f',
}

const theme = createTheme({
	palette: {
		primary: {
			main: colors.primary,
		},
		secondary: {
			main: colors.secondary,
		},
	},
	components: {
		MuiButton: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					display: 'flex',
					flexDirection: 'column',
				},
			},
		},
	},
})

const Theme = ({ children }: { children: JSX.Element }) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default Theme
