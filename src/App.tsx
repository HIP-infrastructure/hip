import React from 'react'
import { ROUTE_PREFIX, TAB_NAMES } from './constants'

import { Routes, Route, Link } from "react-router-dom";

import Spaces from './components/spaces'
import { useAppStore } from './store/appProvider'
import Session from './components/session'

import CssBaseline from '@mui/material/CssBaseline';
import { Box, Tab, Tabs, FormControlLabel, Switch } from '@mui/material';

const footerStyle = {
	position: 'fixed',
	width: '100vw',
	bottom: 0,
	left: 0,
	textAlign: 'center',
	padding: 0,
	margin: 0,
}

const Home = (): JSX.Element => {
	const { debug: [debug, setDebug] } = useAppStore()
	const [selectedSpace, setSelectedSpace] = React.useState(0)

	return (
		<Box
			component='main'
			sx={{ display: 'flex' }}>
			<CssBaseline />
			<Box
				component='section'
				sx={{ display: 'flex' }}>
				<Box
					component='nav'
					sx={{ width: '200px', padding: '1em' }}
				/>
				<Box
					sx={{ display: 'flex', flex: 1 }}
				>
					<Box>
						<Box
							sx={{ display: 'flex', marginBottom: '16px' }}
						>
							<Tabs
								value={selectedSpace}
								onChange={(_, value) => setSelectedSpace(value)}
								sx={{ flex: 1 }}
							>
								{TAB_NAMES.map(n => <Tab label={n} />)}
							</Tabs >

							<FormControlLabel
								control={<Switch
									checked={debug}
									onChange={() => setDebug(!debug)} />}
								label="Debug" />
						</Box>
						<Spaces />
					</Box>
				</Box>
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
	<>
		<Link to={`${ROUTE_PREFIX}/sessions/session-423`}>Route</Link>

		<Routes>
			<Route path={`${ROUTE_PREFIX}/`} element={<Home />}>
			</Route>
			<Route path={`${ROUTE_PREFIX}/sessions/:id`} element={<Session />} />
			<Route
				path="*"
				element={
					<main style={{ padding: "1rem" }}>
						<p>There's nothing here!</p>
					</main>
				}
			/>
		</Routes>
	</>


export default App
