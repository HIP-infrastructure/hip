import * as React from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './components/About'
import Admin from './components/Admin'
import Apps from './components/apps'
import Dataset from './components/BIDS/Dataset'
import Datasets from './components/BIDS/Datasets'
import Centers from './components/Centers/Centers'
import CollaborativeData from './components/collab/data'
import CollaborativeSessions from './components/collab/sessions'
import CollaborativeWorkflows from './components/collab/workflows'
import Dashboard from './components/Dashboard/Dashboard'
import DashboardOutlet from './components/Dashboard/index'
import Documentation from './components/documentation'
import PublicSessions from './components/public/sessions'
import PublicWorkflows from './components/public/workflows'
import Session from './components/session'
import Sessions from './components/sessions'
import Navigation from './components/Sidebar'
import Workflows from './components/workflows'
import BidsBrowser from './components/workflows/bids/browser'
import BidsConverter from './components/workflows/bids/converter'
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
	// const [mobileOpen, setMobileOpen] = React.useState(false)

	// const handleDrawerToggle = () => {
	// 	setMobileOpen(!mobileOpen)
	// }

	return (
		<Box component='main' sx={{ display: 'flex', width: 'inherit' }}>
			<CssBaseline />
			{process.env.REACT_APP_HOSTNAME !== 'thehip.app' && (
				<Typography
					sx={{
						position: 'absolute',
						top: '8px',
						right: '200px',
						color: '#FA6812',
						zIndex: '10000',
						transform: 'translateX(-50%)',
					}}
					variant='h6'
				>
					{process.env.REACT_APP_HOSTNAME}
				</Typography>
			)}
			<Box
				component='nav'
				sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
			>
				{isSmUp ? null : (
					<Navigation
					// open={mobileOpen}
					// onClose={handleDrawerToggle}
					/>
				)}
				<Navigation />
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
			<Route path={'admin'} element={<Admin />} />
			<Route path={'private'} element={<DashboardOutlet />}>
				<Route index element={<DashboardOutlet />} />
				<Route path={':id'} element={<Dashboard />} />
				<Route path={':id/sessions'} element={<Sessions />} />
				<Route path={':id/datasets'} element={<Outlet />}>
					<Route index element={<Datasets />} />
					<Route path={':datasetId'} element={<Dataset />} />
				</Route>
				<Route path={':id/workflows'} element={<Outlet />}>
					<Route index element={<Workflows />} />
					<Route path={'bidsimport'} element={<BidsConverter />} />
					<Route path={'bidssearch'} element={<BidsBrowser />} />
				</Route>
				<Route path={'centers'} element={<Centers />} />
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
