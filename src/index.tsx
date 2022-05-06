import {
	CheckCircle, Error, Info, Warning
} from '@mui/icons-material'
import { SnackbarProvider } from 'notistack'
import React, { lazy, Suspense, useEffect } from 'react';

import ReactDOM from 'react-dom'
import { BrowserRouter, useLocation } from 'react-router-dom'
import App from './App'
import Theme from './components/theme'
import { AppStoreProvider } from './store/appProvider'
import { Slide } from '@mui/material';
// import reportWebVitals from './reportWebVitals'

const iconsStyle = {
	icon: {
	  mr: 1,
	},
  };

const DebugRouter = ({ children }: { children: JSX.Element }) => {
	const location = useLocation()

	if (process.env.NODE_ENV === 'development') {
		/* eslint-disable no-console */
		console.log(
			`Route: ${location.pathname}${location.search}, State: ${JSON.stringify(
				location.state
			)}`
		)
		/* eslint-enable no-console */
	}

	return children
}

ReactDOM.render(
	<React.StrictMode>
		<AppStoreProvider>
			<BrowserRouter>
				<DebugRouter>
					<Theme>
						<SnackbarProvider
							maxSnack={3}
							autoHideDuration={4000}
							TransitionComponent={Slide}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
							iconVariant={{
								success: <CheckCircle sx={{ ...iconsStyle.icon }} />,
								error: <Error sx={{ ...iconsStyle.icon }} />,
								warning: <Warning sx={{ ...iconsStyle.icon }} />,
								info: <Info sx={{ ...iconsStyle.icon }} />,
							}}
						>
							<App />
						</SnackbarProvider>
					</Theme>
				</DebugRouter>
			</BrowserRouter>
		</AppStoreProvider>
	</React.StrictMode>,
	document.getElementById('hip-root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// if (process.env.NODE_ENV === "development")
	// reportWebVitals(console.log)
