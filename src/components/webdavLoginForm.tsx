import React from 'react'
import { useFormik } from 'formik'
import { Button, Input, Typography } from '@mui/material'
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
				<Typography variant="h6" noWrap component="div">
				Data access
					</Typography>
				<div>
					<Input
						id="login"
						onChange={formik.handleChange}
						value={user?.uid}
						disabled
						placeholder="Login"
						/>
				</div><div>
					<Input
						id="password"
						type="password"
						onChange={formik.handleChange}
						value={formik.values.password}
						placeholder="Password"
						autoFocus />
				</div><div>
					<Button type='submit' variant="text" >Submit</Button>
				</div>
			</form>
		</>
	)
}

export default WebdavForm
