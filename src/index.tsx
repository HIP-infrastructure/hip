import { SnackbarProvider } from 'notistack'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'

import { createInstance, MatomoProvider } from '@jonkoops/matomo-tracker-react'
import { CheckCircle, Error, Info, Warning } from '@mui/icons-material'
import { Slide } from '@mui/material'

import App from './App'
import Theme from './components/theme'
import { AppStoreProvider } from './store/appProvider'

// import reportWebVitals from './reportWebVitals'

const iconsStyle = {
	icon: {
		mr: 1,
	},
}

const MatomoInstance = ({ children }: { children: JSX.Element }) => {
	const MATOMO_URL_BASE = process.env.REACT_APP_MATOMO_URL_BASE || 'https://stats.humanbrainproject.eu/'
	const MATOMO_SITE_ID = process.env.REACT_APP_MATOMO_SITE_ID || '28'
	const matomoInstance =
		process.env.NODE_ENV === 'development' &&
		MATOMO_URL_BASE &&
		MATOMO_SITE_ID &&
		createInstance({
			urlBase: MATOMO_URL_BASE,
			siteId: parseInt(MATOMO_SITE_ID),
			linkTracking: true,
			configurations: {
				disableCookies: true,
			},
		})

	if (matomoInstance)
		return <MatomoProvider value={matomoInstance}>{children}</MatomoProvider>

	return children
}

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

const container = document.getElementById('hip-root')
const root = createRoot(container!)

root.render(
	// <React.StrictMode>
	<AppStoreProvider>
		<MatomoInstance>
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
		</MatomoInstance>
	</AppStoreProvider>
	// </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// if (process.env.NODE_ENV === "development")
// reportWebVitals(console.log)
