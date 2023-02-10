import { Box, Grid, Typography } from '@mui/material'
import * as React from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { createProject, getUserProjects } from '../../api/projects'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import { useNotification } from '../../hooks/useNotification'

const validationSchema = Yup.object().shape({
	title: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Title is required'),
	description: Yup.string(),
})

const CreateProject = () => {
	const { showNotif } = useNotification()

	const {
		user: [user],
		projects: [projects, setProjects],
	} = useAppStore()

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
		},
		onSubmit: values => {
			if (!user || !user.uid) return
			const adminId = user.uid

			const project = {
				...values,
				adminId,
			}
			createProject(project)
				.then(() => {
					getUserProjects(adminId).then(projects => {
						setProjects(projects)
					})
				})
				.catch(err => {
					showNotif(err, 'error')

				})
		},
		validationSchema,
	})

	return (
		<>
			<TitleBar title={`Create Project`} description={''} />

			<Box sx={{ width: 0.75, mt: 4 }}>
				<Box
					sx={{
						ml: 4,
					}}
				>
					<Grid container columnSpacing={2} rowSpacing={2}>
						<form onSubmit={formik.handleSubmit}>
							<Grid item xs={6}>
								<label htmlFor='title'>Title</label>
								<input
									id='title'
									name='title'
									type='text'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.title}
								/>
								{formik.touched.title && formik.errors.title ? (
									<div>{formik.errors.title}</div>
								) : null}
							</Grid>
							<Grid item xs={6}>
								<label htmlFor='description'>Description</label>
								<textarea
									id='description'
									name='description'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.description}
									rows={4}
									cols={50}
								/>
							</Grid>
							<button type='submit'>Submit</button>
						</form>
					</Grid>
				</Box>
			</Box>
		</>
	)
}

export default CreateProject
