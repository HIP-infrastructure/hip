import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Grid, TextField, Typography, Hidden } from '@mui/material'
import { Form, Formik } from 'formik'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { createProject } from '../../api/projects'
import { ROUTE_PREFIX } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import TitleBar from '../UI/titleBar'

const validationSchema = Yup.object().shape({
	title: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Title is required'),
	description: Yup.string(),
	Name: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Name is required'),
	BIDSVersion: Yup.string().required('BIDS Version is required'),
})

const initialValues = {
	title: '',
	description: '',
	Name: '',
	BIDSVersion: '1.1.4',
	License: '',
	Authors: '',
	Acknowledgements: '',
	HowToAcknowledge: '',
	Funding: '',
	ReferencesAndLinks: '',
	DatasetDOI: '',
}

const CreateProject = () => {
	const { showNotif } = useNotification()
	const navigate = useNavigate()
	const { trackEvent } = useMatomo()
	const {
		user: [user],
		userProjects: [_, setUserProjects], // eslint-disable-line
	} = useAppStore()
	const [submitting, setSubmitting] = React.useState(false)
	const [isLoading, setIsLoading] = React.useState(false)

	return (
		<>
			<TitleBar
				title={`Create Project`}
				description={
					'A project is a collaborative workspace where your data is privately stored and cannot be downloaded by other users. Users can run Desktop apps on the data and share the results with other users.'
				}
			/>

			<Box sx={{ width: 0.75, mt: 4 }}>
				<Box sx={{ ml: 4 }}>
					<Grid container columnSpacing={2} rowSpacing={2}>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={async (values, { resetForm }) => {
								if (!user || !user.uid) return

								setSubmitting(true)
								setIsLoading(true)

								const adminId = user.uid
								const { title, description, ...datasetDescription } = values
								const project = {
									adminId,
									title,
									description,
									datasetDescription: {
										...datasetDescription,
										Authors: datasetDescription.Authors.split(','),
										Funding: datasetDescription.Funding.split(','),
										ReferencesAndLinks:
											datasetDescription.ReferencesAndLinks.split(','),
									},
								}

								const futureName = `HIP-${title.replace(/[^a-zA-Z0-9]+/g, '-')}`

								trackEvent({
									category: 'Project',
									action: 'Create a project',
									name: `project/${futureName}`,
								})

								createProject(project)
									.then(projects => {
										setSubmitting(false)
										resetForm()
										setIsLoading(false)
										if (projects) setUserProjects(projects)
										showNotif('Project created', 'success')
										navigate(`${ROUTE_PREFIX}/projects/${futureName}`)
									})
									.catch(err => {
										showNotif(err, 'error')
									})
							}}
						>
							{({ errors, handleChange, handleBlur, touched, values }) => {
								return (
									<Form>
										<Grid container columnSpacing={2} rowSpacing={2}>
											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													id='title'
													fullWidth
													name='title'
													label='Project Title'
													type='text'
													value={values.title}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.title && errors.title ? true : false}
													helperText={
														touched.title && errors.title
															? errors.title
															: 'Title is required'
													}
												/>
												<TextField
													disabled={submitting}
													size='small'
													multiline
													id='description'
													fullWidth
													name='description'
													label='Project Description'
													type='text'
													minRows={3}
													value={values.description}
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</Grid>

											<Grid item xs={12}>
												<Typography variant='h6' sx={{ mt: 4, mb: 2 }}>
													Dataset
												</Typography>
											</Grid>

											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='Name'
													label='Dataset Name'
													value={values.Name}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.Name && errors.Name ? true : false}
													helperText={
														touched.Name && errors.Name
															? errors.Name
															: 'Name is required'
													}
												/>
											</Grid>
											
											<Hidden xsDown smDown>
											<Grid item xs={6}>
												<TextField
													disabled={true}
													size='small'
													fullWidth
													name='BIDSVersion'
													label='Dataset BIDSVersion'
													value={values.BIDSVersion}
													onChange={handleChange}
													error={
														touched.BIDSVersion && errors.BIDSVersion
															? true
															: false
													}
													helperText={
														touched.BIDSVersion && errors.BIDSVersion
															? errors.BIDSVersion
															: `Latest BIDS version is ${initialValues.BIDSVersion}`
													}
												/>
											</Grid>

											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='License'
													label='Dataset License'
													value={values.License}
													onChange={handleChange}
													error={
														touched.License && errors.License ? true : false
													}
													helperText={
														touched.License && errors.License
															? errors.License
															: null
													}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='Authors'
													label='Dataset Authors'
													value={values.Authors}
													onChange={handleChange}
													error={
														touched.Authors && errors.Authors ? true : false
													}
													helperText={
														touched.Authors && errors.Authors
															? errors.Authors
															: 'Separate authors by a comma'
													}
												/>
											</Grid>

											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='Acknowledgements'
													label='Dataset Acknowledgements'
													value={values.Acknowledgements}
													onChange={handleChange}
													error={
														touched.Acknowledgements && errors.Acknowledgements
															? true
															: false
													}
													helperText={
														touched.Acknowledgements && errors.Acknowledgements
															? errors.Acknowledgements
															: null
													}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='HowToAcknowledge'
													label='HowToAcknowledge Dataset'
													value={values.HowToAcknowledge}
													onChange={handleChange}
													error={
														touched.HowToAcknowledge && errors.HowToAcknowledge
															? true
															: false
													}
													helperText={
														touched.HowToAcknowledge && errors.HowToAcknowledge
															? errors.HowToAcknowledge
															: null
													}
												/>
											</Grid>

											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='Funding'
													label='Dataset Funding'
													value={values.Funding}
													onChange={handleChange}
													error={
														touched.Funding && errors.Funding ? true : false
													}
													helperText={
														touched.Funding && errors.Funding
															? errors.Funding
															: 'Separate fundings by a comma'
													}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='ReferencesAndLinks'
													label='Dataset ReferencesAndLinks'
													value={values.ReferencesAndLinks}
													onChange={handleChange}
													error={
														touched.ReferencesAndLinks &&
														errors.ReferencesAndLinks
															? true
															: false
													}
													helperText={
														touched.ReferencesAndLinks &&
														errors.ReferencesAndLinks
															? errors.ReferencesAndLinks
															: 'Separate links by a comma'
													}
												/>
											</Grid>

											<Grid item xs={6}>
												<TextField
													disabled={submitting}
													size='small'
													fullWidth
													name='DatasetDOI'
													label='Dataset DOI'
													value={values.DatasetDOI}
													onChange={handleChange}
													error={
														touched.DatasetDOI && errors.DatasetDOI
															? true
															: false
													}
													helperText={
														touched.DatasetDOI && errors.DatasetDOI
															? errors.DatasetDOI
															: 'Digital Object Identifier'
													}
												/>
											</Grid>
											</Hidden>
										</Grid>

										<Grid item xs={12} sx={{ mt: 2 }}>
											<LoadingButton
												color='primary'
												type='submit'
												loading={isLoading}
												loadingPosition='start'
												startIcon={<Save />}
												variant='contained'
											>
												Create
											</LoadingButton>
										</Grid>
									</Form>
								)
							}}
						</Formik>
					</Grid>
				</Box>
			</Box>
		</>
	)
}

export default CreateProject
