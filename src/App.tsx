import React from 'react'
import { ROUTE_PREFIX, SPACES_NAV, DRAWER_WIDTH } from './constants'
import { Routes, Route, Outlet } from "react-router-dom";
import { useAppStore } from './store/appProvider'
import Session from './components/session'
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { Alert, Box, Tab, Tabs, FormControlLabel, Switch, useMediaQuery, useTheme } from '@mui/material';
import Navigation from './components/navigation'

import Sessions from './components/sessions'
import Data from './components/data'
import Apps from './components/apps'
import Workflows from './components/workflows';
import Documentation from './components/documentation';
import Dashboard from './components/dashboard';
import BidsConverter from './components/bidsConvert';

import './App.css'
export interface Space {
	label: string;
	route: string;
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
	const { debug: [debug, setDebug] } = useAppStore()
	const [selectedSpace, setSelectedSpace] = React.useState(0)
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const navigate = useNavigate();
	const theme = useTheme();
	const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

	React.useEffect(() => {
		navigate(SPACES_NAV[selectedSpace].route)
	}, [selectedSpace])

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<Box component='main' sx={{ display: 'flex', width: 'fit-content' }}>
			<CssBaseline />
			<Box
				component="nav"
				sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
			>
				{isSmUp ? null : (
					<Navigation
						space={SPACES_NAV[selectedSpace]}
						PaperProps={{ style: { width: DRAWER_WIDTH } }}
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
					/>
				)}
				<Navigation
					space={SPACES_NAV[selectedSpace]}
					PaperProps={{ style: { width: DRAWER_WIDTH } }}
					sx={{ display: { sm: 'block', xs: 'none' } }}
				/>
			</Box>
			<Box sx={{ margin: '32px' }}>
				<Box>
					{/* <Alert severity="success" color="info">
						This is a success alert — check it out!
					</Alert> */}
				</Box>
				<Box sx={{ display: 'flex', marginBottom: '8px' }} >
					<Tabs
						value={selectedSpace}
						onChange={(_, value) => setSelectedSpace(value)}
						sx={{ flex: 1, mb: 4 }}
					>
						{SPACES_NAV.map(n => <Tab label={n.label} key={n.route} />)}
					</Tabs >

					<FormControlLabel
						control={<Switch
							checked={debug}
							onChange={() => setDebug(!debug)} />}
						label="Debug" />
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						minWidth: '960px'
					}}>
					<Outlet />
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
			<Route path={`${ROUTE_PREFIX}/dashboard`} element={<Dashboard />} />
			<Route path={`${ROUTE_PREFIX}/documentation`} element={<Documentation />} />
			<Route path={'private'} element={<Outlet />}>
				<Route index element={<Sessions />} />
				<Route path={'sessions'} element={<Sessions />} />
				<Route path={'data'} element={<Data />} />
				<Route path={'workflows'} element={<Outlet />}>
					<Route index element={<Workflows />} />
					<Route path={'bids'} element={<BidsConverter />} />
				</Route>
				<Route path={'apps'} element={<Apps />} />
			</Route>
			<Route path={'collaborative'} element={<Outlet />}>
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
