import * as React from 'react'
import { Box, Typography } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import AppList from './components/Documentation/AppList'
import Dataset from './components/UI/BIDS/Dataset'
import CenterDatasets from './components/Center/Datasets'
import PublicDatasets from './components/Public/Datasets'
import Centers from './components/Centers'
import CenterWorkspace from './components/Center/Workspace'
import About from './components/Documentation/About'
import CreateProject from './components/Projects/Create'
import ProjectWorkspace from './components/Project/Workspace'
import ProjectDataset from './components/Project/Dataset'
import Projects from './components/Projects'
import Desktop from './components/Desktop/Desktop'
import CenterDesktops from './components/Center/Desktops'
import ProjectDesktops from './components/Project/Desktops'
import Navigation from './components/Sidebar'
import { ROUTE_PREFIX } from './constants'
import { isLoggedIn } from './api/gatewayClientAPI'
import { useNotification } from './hooks/useNotification'
import Project from './components/Project/index'
import Files from './components/Project/Files'
import MyFiles from './components/Center/Files'
import GettingStarted from './components/Documentation/GettingStarted'
import TransferData from './components/Project/TransferData'

export interface Space {
	label: string
	route: string
}

const devNameStyle = {
	position: 'fixed',
	top: '8px',
	right: '200px',
	color: '#F5B800',
	zIndex: '10000',
	transform: 'translateX(-50%)',
}

const Layout = (): JSX.Element => {
	const { showNotif } = useNotification()

	React.useEffect(() => {
		const interval = setInterval(() => {
			isLoggedIn().catch(error => {
				showNotif(
					'You have been logged out, please refresh your browser',
					'warning'
				)
			})
		}, 30 * 1000)
		return () => clearInterval(interval)
	}, [showNotif])

	return (
		<Box component='main' sx={{ display: 'flex', width: 'inherit' }}>
			<CssBaseline />
			{process.env.REACT_APP_HOSTNAME !== 'thehip.app' && (
				<Typography sx={devNameStyle} variant='h6'>
					{process.env.REACT_APP_HOSTNAME}
				</Typography>
			)}
			<Navigation />
			<Box sx={{ m: 4, pl: 1, width: 'inherit' }}>
				<Outlet />
			</Box>
		</Box>
	)
}

const App = () => (
	<Routes>
		<Route path={`${ROUTE_PREFIX}/`} element={<Layout />}>
			<Route index element={<GettingStarted />} />
			<Route path={'apps'} element={<AppList />} />
			<Route path={'about'} element={<About />} />
			<Route path={'centers'} element={<Outlet />}>
				<Route index element={<Centers />} />
				<Route path={':centerId'} element={<CenterWorkspace />} />
				<Route path={':centerId/desktops'} element={<CenterDesktops />} />
				<Route path={':centerId/files'} element={<MyFiles />} />
				<Route path={':centerId/datasets'} element={<Outlet />}>
					<Route index element={<CenterDatasets />} />
					<Route path={':datasetId'} element={<Dataset />} />
				</Route>
			</Route>
			<Route path={'projects'} element={<Outlet />}>
				<Route index element={<Projects />} />
				<Route path={'create'} element={<CreateProject />} />
				<Route path={':projectId'} element={<Project />}>
					<Route index element={<ProjectWorkspace />} />
					<Route path={'desktops'} element={<ProjectDesktops />} />
					<Route path={'transfer'} element={<TransferData />} />
					<Route path={'metadata'} element={<Files />} />
					<Route path={'datasets'} element={<Outlet />}>
						<Route index element={<ProjectDataset />} />
						<Route path={':datasetId'} element={<ProjectDataset />} />
					</Route>
				</Route>
			</Route>
			<Route path={'public'} element={<PublicDatasets />}></Route>
			<Route
				path='*'
				element={
					<main style={{ padding: '1rem' }}>
						<p>Not found</p>
					</main>
				}
			/>
		</Route>
		<Route path={`${ROUTE_PREFIX}/desktops/:id`} element={<Desktop />} />
	</Routes>
)

export default App
