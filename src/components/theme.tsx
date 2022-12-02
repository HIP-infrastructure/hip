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

const nameToColor = (name: string, hexOpacity = '33') => {
	let hash = 0
	let i

	/* eslint-disable no-bitwise */
	for (i = 0; i < name.length; i += 1) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash)
	}

	let color = '#'

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff
		color += `00${value.toString(16)}`.substr(-2)
	}
	/* eslint-enable no-bitwise */

	return `${color}${hexOpacity}, ${color}${hexOpacity}`
}

export { Theme as default, nameToColor }
