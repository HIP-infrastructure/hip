import React from 'react'
import Spaces from './components/spaces'
import { useAppStore } from './store/appProvider'
import { Routes, Route } from "react-router-dom";
import Data from './components/data'
import { Box, Tab, Tabs, FormControlLabel, Switch } from '@mui/material';
import BIDSConverterForm from './components/convert'
import { ROUTE_PREFIX } from './constants'
import CssBaseline from '@mui/material/CssBaseline';
import { APP_MARGIN_TOP } from './constants'

const Home = (): JSX.Element => {
	const { debug: [debug, setDebug] } = useAppStore()
	const [selectedSpace, setSelectedSpace] = React.useState(0)

	return (
		<Box
			component='main'
			className='hip'
			sx={{
				marginTop: APP_MARGIN_TOP,
				display: 'flex',
				backgroundColor: 'lime'
			}}>
			<CssBaseline />
			<Box
				component='section'
				sx={{ display: 'flex' }}>
				<Box
					component='nav'
					className='hip__nav'
					sx={{
						width: '200px',
						padding: '1em',
						backgroundColor: 'aquamarine'
					}} />
				<Box
					className='spaces'
					sx={{
						display: 'flex',
						flex: 1,
						backgroundColor: 'azure'
					}}
				>
					<div>
						<Box
							className='spaces__nav'
							sx={{
								display: 'flex',
								backgroundColor: 'deepPink'
							}}
						>
							<Tabs
								value={selectedSpace}
								onChange={(_, value) => setSelectedSpace(value)}
								sx={{
									flex: 1
								}}
							>
								<Tab label="Private" />
								<Tab label="Collaborative" />
								<Tab label="Public" />
							</Tabs >

							<FormControlLabel
								control={<Switch checked={debug}
									onChange={() => setDebug(!debug)} />}
								label="Debug" />
						</Box>
						<div className='space'>
							<Spaces />
						</div>
					</div>
				</Box>
			</Box>
			<Box
				component="footer"
				sx={{
					position: 'fixed',
					width: '100vw',
					bottom: 0,
					left: 0,
					textAlign: 'center',
					padding: 0,
					margin: 0,
				}}>
				<p>HIP {new Date().getFullYear()}</p>
			</Box>
		</Box>
	)
}

const App = () => <>
	<Routes>
		<Route path={`${ROUTE_PREFIX}/`} element={<Home />}>
			<Route path={`${ROUTE_PREFIX}/`} element={<Data />} />
			<Route path={`${ROUTE_PREFIX}/workflows`} element={<BIDSConverterForm />} />
		</Route>
	</Routes></>

export default App
