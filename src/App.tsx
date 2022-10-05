import * as React from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './components/About'
import Apps from './components/apps'
import CollaborativeData from './components/collab/data'
import CollaborativeSessions from './components/collab/sessions'
import CollaborativeWorkflows from './components/collab/workflows'
import Data from './components/data'
import Documentation from './components/documentation'
import Group from './components/groups/Group'
import Groups from './components/groups/index'
import Navigation from './components/navigation'
import PublicSessions from './components/public/sessions'
import PublicWorkflows from './components/public/workflows'
import Session from './components/session'
import Sessions from './components/sessions'
import Workflows from './components/workflows'
import BidsConverter from './components/workflows/bids/converter'
import BidsBrowser from './components/workflows/bids/browser'
import { DRAWER_WIDTH, ROUTE_PREFIX } from './constants'

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
	// const [mobileOpen, setMobileOpen] = React.useState(false)
	const theme = useTheme()
	const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

	// const handleDrawerToggle = () => {
	// 	setMobileOpen(!mobileOpen)
	// }

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
			<Route index element={<About />} />
			<Route path={'apps'} element={<Apps />} />
			<Route path={'documentation'} element={<Documentation />} />
			<Route path={'private'} element={<Groups />}>
				<Route index element={<Groups />} />
				<Route path={':id'} element={<Group />} />
				<Route path={':id/sessions'} element={<Sessions />} />
				<Route path={':id/data'} element={<Data />} />
				<Route path={':id/workflows'} element={<Outlet />}>
					<Route index element={<Workflows />} />
					<Route path={'bidsimport'} element={<BidsConverter />} />
					<Route path={'bidssearch'} element={<BidsBrowser />} />
				</Route>
			</Route>
			<Route path={'collaborative'} element={<Outlet />}>
				<Route index element={<CollaborativeSessions />} />
				<Route path={'sessions'} element={<CollaborativeSessions />} />
				<Route path={'data'} element={<CollaborativeData />} />
				<Route path={'workflows'} element={<CollaborativeWorkflows />} />
			</Route>
			<Route path={'public'} element={<Outlet />}>
				<Route index element={<PublicSessions />} />
				<Route path={'sessions'} element={<PublicSessions />} />
				<Route path={'data'} element={<Route />} />
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
