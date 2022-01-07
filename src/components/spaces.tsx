import React from 'react'
import Sessions from './sessions'
import Apps from './apps'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material';

const Spaces = (): JSX.Element => <Box
	sx={{
		display: 'flex',
	}}>

	<Outlet />
	<Box>
		<h2>Applications</h2>
		<Apps />
	</Box>
	<Box
		sx={{
			display: 'flex',
			flexDirection: 'column',
			minWidth: '960px'
		}}>
		<Sessions />
	</Box>
</Box >

export default Spaces
