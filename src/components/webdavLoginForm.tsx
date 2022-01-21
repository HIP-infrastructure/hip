import React from 'react'
import { useFormik } from 'formik'
import { Box, Button, Input, Typography } from '@mui/material'
import { useAppStore } from '../store/appProvider'
interface UserData {
	login: string
	password: string
}

const WebdavForm = (): JSX.Element => {
	const {
		user: [user, setUser],
	} = useAppStore()

	const formik = useFormik({
		initialValues: {
			login: '',
			password: '',
		},
		onSubmit: (data: UserData) => {
			setUser({ ...user, password: data.password })
		},
	})

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Typography gutterBottom variant="h6" noWrap component="div">
					Data access
				</Typography>
				<Typography gutterBottom variant="subtitle1" component="div">
					For security reasons, we need your credentials for every data access
				</Typography>
				<Box>
					<Input
						id="login"
						disableUnderline
						onChange={formik.handleChange}
						value={user?.uid}
						disabled
						placeholder="Login"
					/>
				</Box>
				<Box>
					<Input
						id="password"
						type="password"
						disableUnderline
						onChange={formik.handleChange}
						value={formik.values.password}
						placeholder="Password"
						autoFocus />
				</Box>
				<Box sx={{ pt: 2 }}>
					<Button type='submit' variant="text" >Submit</Button>
				</Box>
			</form>
		</>
	)
}

export default WebdavForm
