import React from 'react'
import Sessions from './sessions'
import Apps from './apps'
import WebdavForm from './webdavLoginForm'
import { useAppStore } from '../store/appProvider'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material';

const Spaces = (): JSX.Element => {
	const {
		showWedavForm: [showWedavForm, setShowWedavForm],
	} = useAppStore()

	return (
		<Box
			sx={{
				display: 'flex',
			}}>
			{/* <Dialog
				header='Data access'
				visible={showWedavForm}
				onHide={() => setShowWedavForm(false)}
			>
				<WebdavForm />
			</Dialog> */}
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
	)
}

export default Spaces
