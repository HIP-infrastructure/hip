import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Grid, TextField } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { createBidsDataset } from '../../api/bids'
import { CreateBidsDatasetDto, IError } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'

const validationSchema = Yup.object().shape({
	Name: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Name is required'),
	BIDSVersion: Yup.string().required('BIDS Version is required'),
})

const initialValues = {
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

interface ICreateDataset {
	setDatasetCreated: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateDataset = ({ setDatasetCreated }: ICreateDataset) => {
	const { showNotif } = useNotification()
	const [submitted, setSubmitted] = useState(false)
	const {
		user: [user],
	} = useAppStore()

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={async (values, { resetForm }) => {
				if (user && user.uid) {
					setSubmitted(true)
					const createBidsDatasetDto: CreateBidsDatasetDto = {
						owner: user.uid,
						parent_path: '',
						DatasetDescJSON: {
							Name: values.Name,
							BIDSVersion: values.BIDSVersion,
							License: values.License,
							Authors: values.Authors.split(','),
							Acknowledgements: values.Acknowledgements,
							HowToAcknowledge: values.HowToAcknowledge,
							Funding: values.Funding?.split(','),
							ReferencesAndLinks: values.ReferencesAndLinks?.split(','),
							DatasetDOI: values.DatasetDOI,
						},
					}
					const cd = await createBidsDataset(createBidsDatasetDto)

					if ((cd as IError).statusCode) {
						showNotif((cd as IError).message, 'error')
						setSubmitted(false)

						return
					}

					resetForm()
					setSubmitted(false)
					showNotif('Dataset created. Wait for reload', 'success')
					setDatasetCreated(true)
				}
			}}
		>
			{({ errors, handleChange, handleBlur, touched, values }) => {
				return (
					<Form>
						<Grid container columnSpacing={2} rowSpacing={2}>
							<Grid item xs={6}>
								<TextField
									disabled={submitted}
									size='small'
									fullWidth
									name='Name'
									label='Name'
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
							<Grid item xs={6}>
								<TextField
									disabled={true}
									size='small'
									fullWidth
									name='BIDSVersion'
									label='BIDSVersion'
									value={values.BIDSVersion}
									onChange={handleChange}
									error={
										touched.BIDSVersion && errors.BIDSVersion ? true : false
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
									disabled={submitted}
									size='small'
									fullWidth
									name='License'
									label='License'
									value={values.License}
									onChange={handleChange}
									error={touched.License && errors.License ? true : false}
									helperText={
										touched.License && errors.License ? errors.License : null
									}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									disabled={submitted}
									size='small'
									fullWidth
									name='Authors'
									label='Authors'
									value={values.Authors}
									onChange={handleChange}
									error={touched.Authors && errors.Authors ? true : false}
									helperText={
										touched.Authors && errors.Authors
											? errors.Authors
											: 'Separate authors by a comma'
									}
								/>
							</Grid>

							<Grid item xs={6}>
								<TextField
									disabled={submitted}
									size='small'
									fullWidth
									name='Acknowledgements'
									label='Acknowledgements'
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
									disabled={submitted}
									size='small'
									fullWidth
									name='HowToAcknowledge'
									label='HowToAcknowledge'
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
									disabled={submitted}
									size='small'
									fullWidth
									name='Funding'
									label='Funding'
									value={values.Funding}
									onChange={handleChange}
									error={touched.Funding && errors.Funding ? true : false}
									helperText={
										touched.Funding && errors.Funding
											? errors.Funding
											: 'Separate fundings by a comma'
									}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									disabled={submitted}
									size='small'
									fullWidth
									name='ReferencesAndLinks'
									label='ReferencesAndLinks'
									value={values.ReferencesAndLinks}
									onChange={handleChange}
									error={
										touched.ReferencesAndLinks && errors.ReferencesAndLinks
											? true
											: false
									}
									helperText={
										touched.ReferencesAndLinks && errors.ReferencesAndLinks
											? errors.ReferencesAndLinks
											: 'Separate links by a comma'
									}
								/>
							</Grid>

							<Grid item xs={6}>
								<TextField
									disabled={submitted}
									size='small'
									fullWidth
									name='DatasetDOI'
									label='DatasetDOI'
									value={values.DatasetDOI}
									onChange={handleChange}
									error={touched.DatasetDOI && errors.DatasetDOI ? true : false}
									helperText={
										touched.DatasetDOI && errors.DatasetDOI
											? errors.DatasetDOI
											: 'Digital Object Identifier'
									}
								/>
							</Grid>

							<Grid item xs={6}>
								<LoadingButton
									color='primary'
									type='submit'
									loading={submitted}
									loadingPosition='start'
									startIcon={<Save />}
									variant='contained'
								>
									Save
								</LoadingButton>
							</Grid>
						</Grid>
					</Form>
				)
			}}
		</Formik>
	)
}

export default CreateDataset
