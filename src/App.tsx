import * as React from 'react'
import { Box, Typography } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './components/About'
import Admin from './components/Admin'
import Apps from './components/apps'
import Dataset from './components/BIDS/Dataset'
import Datasets from './components/BIDS/Datasets'
import Centers from './components/Centers'
import Dashboard from './components/Dashboard/Dashboard'
import DashboardOutlet from './components/Dashboard/index'
import DataBrowser from './components/Data'
import Documentation from './components/documentation'
import CreateProject from './components/Projects/Create'
import ProjectDashboard from './components/Project/Dashboard'
import ProjectData from './components/Project/Data'
import ProjectDataset from './components/Project/Dataset'
import ProjectDatasets from './components/Project/Datasets'
import Projects from './components/Projects'
import Session from './components/session'
import Sessions from './components/sessions'
import Navigation from './components/Sidebar'
import { ROUTE_PREFIX } from './constants'

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

const Layout = (): JSX.Element => (
	<Box component='main' sx={{ display: 'flex', width: 'inherit' }}>
		<CssBaseline />
		{process.env.REACT_APP_HOSTNAME !== 'thehip.app' && (
			<Typography
				sx={{
					position: 'fixed',
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
		<Navigation />
		<Box sx={{ m: 4, pl: 1, width: 'inherit' }}>
			<Outlet />
		</Box>
		<Box component='footer' sx={{ ...footerStyle }}>
			<p>HIP {new Date().getFullYear()}</p>
		</Box>
	</Box>
)

const App = () => (
	<Routes>
		<Route path={`${ROUTE_PREFIX}/`} element={<Layout />}>
			<Route index element={<About />} />
			<Route path={'apps'} element={<Apps />} />
			<Route path={'documentation'} element={<Documentation />} />
			<Route path={'admin'} element={<Admin />} />
			<Route path={'private'} element={<Outlet />}>
				<Route index element={<Centers />} />
				<Route path={':id'} element={<Dashboard />} />
				<Route path={':id/sessions'} element={<Sessions domain={'center'} />} />
				<Route path={':id/datasets'} element={<Outlet />}>
					<Route index element={<Datasets />} />
					<Route path={':datasetId'} element={<Dataset />} />
				</Route>
				<Route path={':id/data'} element={<DataBrowser />} />
			</Route>
			<Route path={'collaborative'} element={<Outlet />}>
				<Route index element={<Projects />} />
				<Route path={'create'} element={<CreateProject />} />
				<Route path={':id'} element={<ProjectDashboard />} />
				<Route path={':id/sessions'} element={<Sessions domain={'collab'} />} />
				<Route path={':id/datasets'} element={<Outlet />}>
					<Route index element={<ProjectDatasets />} />
					<Route path={':datasetId'} element={<ProjectDataset />} />
				</Route>
				<Route path={':id/data'} element={<ProjectData />} />
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
