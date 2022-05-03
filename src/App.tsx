import { Box, useMediaQuery, useTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Apps from './components/apps'
import CollaborativeData from './components/collab/data'
import CollaborativeSessions from './components/collab/sessions'
import CollaborativeWorkflows from './components/collab/workflows'
import Dashboard from './components/dashboard'
import Data from './components/data'
import Documentation from './components/documentation'
import Navigation from './components/navigation'
import PublicData from './components/public/data'
import PublicSessions from './components/public/sessions'
import PublicWorkflows from './components/public/workflows'
import Session from './components/session'
import Sessions from './components/sessions'
import Spaces from './components/spaces'
import Workflows from './components/workflows'
import BidsConverter from './components/workflows/bids/converter'
import { DRAWER_WIDTH, ROUTE_PREFIX } from './constants'
import { useAppStore } from './store/appProvider'

export interface Space {
	label: string
	route: string
}

const footerStyle = {
	position: 'fixed',
	width: '100vw',
	bottom: 0,
	left: 0,
	textAlign: 'center',
	padding: 0,
	margin: 0,
}

const Layout = (): JSX.Element => {
	const {
		debug: [debug, setDebug],
	} = useAppStore()
	const [mobileOpen, setMobileOpen] = React.useState(false)
	const theme = useTheme()
	const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	return (
		<Box component='main' sx={{ display: 'flex', width: 'inherit' }}>
			<CssBaseline />
			<Box
				component='nav'
				sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
			>
				{isSmUp ? null : (
					<Navigation
						PaperProps={{ style: { width: DRAWER_WIDTH } }}
					// open={mobileOpen}
					// onClose={handleDrawerToggle}
					/>
				)}
				<Navigation PaperProps={{ style: { width: DRAWER_WIDTH } }} />
			</Box>
			<Box sx={{ m: 4, pl: 1, width: 'inherit' }}>
				<Outlet />
			</Box>
			<Box component='footer' sx={{ ...footerStyle }}>
				<p>HIP {new Date().getFullYear()}</p>
			</Box>
		</Box>
	)
}

const App = () => (
	<Routes>
		<Route path={`${ROUTE_PREFIX}/`} element={<Layout />}>
			<Route index element={<Dashboard />} />
			<Route path={'apps'} element={<Apps />} />
			<Route path={'documentation'} element={<Documentation />} />
			<Route path={'private'} element={<Spaces />}>
				<Route index element={<Sessions />} />
				<Route path={'sessions'} element={<Sessions />} />
				<Route path={'data'} element={<Data />} />
				<Route path={'workflows'} element={<Outlet />}>
					<Route index element={<Workflows />} />
					<Route path={'bids'} element={<BidsConverter />} />
				</Route>
			</Route>
			<Route path={'collaborative'} element={<Spaces />}>
				<Route index element={<CollaborativeSessions />} />
				<Route path={'sessions'} element={<CollaborativeSessions />} />
				<Route path={'data'} element={<CollaborativeData />} />
				<Route path={'workflows'} element={<CollaborativeWorkflows />} />
			</Route>
			<Route path={'public'} element={<Spaces />}>
				<Route index element={<PublicSessions />} />
				<Route path={'sessions'} element={<PublicSessions />} />
				<Route path={'data'} element={<PublicData />} />
				<Route path={'workflows'} element={<PublicWorkflows />} />
			</Route>
			<Route
				path='*'
				element={
					<main style={{ padding: '1rem' }}>
						<p>Not found</p>
					</main>
				}
			/>
		</Route>
		<Route path={`${ROUTE_PREFIX}/sessions/:id`} element={<Session />} />
	</Routes>
)

export default App
