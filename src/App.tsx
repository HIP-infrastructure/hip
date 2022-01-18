import React from 'react'
import { ROUTE_PREFIX, SPACES_NAV } from './constants'

import { Routes, Route, Outlet } from "react-router-dom";

import { useAppStore } from './store/appProvider'
import Session from './components/session'
import { Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";


import CssBaseline from '@mui/material/CssBaseline';
import { Box, Tab, Tabs, FormControlLabel, Switch } from '@mui/material';
import { DRAWER_WIDTH } from './constants'
import Navigation from './components/navigation'

import Sessions from './components/sessions'
import Data from './components/data'

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
	const { debug: [debug, setDebug] } = useAppStore()
	const [selectedSpace, setSelectedSpace] = React.useState(0)
	const navigate = useNavigate();

	React.useEffect(() => {
		navigate(SPACES_NAV[selectedSpace].route)
	}, [selectedSpace])


	return (
		<Box
			component='main'
			sx={{ display: 'flex' }}>
			<CssBaseline />
			<Box sx={{ margin: '32px' }}>
				<Box>
					{/* <Alert severity="success" color="info">
						This is a success alert — check it out!
					</Alert> */}
				</Box>
				<Box sx={{ display: 'flex', marginBottom: '16px' }} >
					<Tabs
						value={selectedSpace}
						onChange={(_, value) => setSelectedSpace(value)}
						sx={{ flex: 1 }}
					>
						{SPACES_NAV.map(n => <Tab label={n.label} key={n.route} />)}
					</Tabs >

					<FormControlLabel
						control={<Switch
							checked={debug}
							onChange={() => setDebug(!debug)} />}
						label="Debug" />
				</Box>

				<Box sx={{ display: 'flex' }}>
					<Box sx={{ minWidth: DRAWER_WIDTH }}>
						<Navigation parentRoute={SPACES_NAV[selectedSpace].route} />
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							minWidth: '960px'
						}}>
						<Outlet />
					</Box>
				</Box >

			</Box>
			<Box
				component="footer"
				sx={{ ...footerStyle }}>
				<p>HIP {new Date().getFullYear()}</p>
			</Box>
		</Box>
	)
}

const App = () =>
	<Routes>
		<Route path={`${ROUTE_PREFIX}/`} element={<Layout />}>
			<Route path={'private'} element={<Outlet />}>
				<Route index element={<Sessions />} />
				<Route path={'sessions'} element={<Sessions />} />
				<Route path={'data'} element={<Data />} />
			</Route>
			<Route path={'collaborative'} element={<Outlet />}>
				<Route index element={<Sessions />} />
				<Route path={'sessions'} element={<Sessions />} />
				<Route path={'data'} element={<Data />} />
			</Route>
			<Route
				path="*"
				element={
					<main style={{ padding: "1rem" }}>
						<p>Not found</p>
					</main>
				}
			/>
		</Route>
		<Route path={`${ROUTE_PREFIX}/sessions/:id`} element={<Session />} />
	</Routes>

export default App
