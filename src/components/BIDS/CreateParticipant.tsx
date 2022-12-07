import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Dialog,
	DialogActions,
	DialogContent, DialogTitle, Grid, IconButton, TextField, Typography
} from '@mui/material'
import { Form, Formik } from 'formik'
import * as React from 'react'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
	BIDSDataset, Participant
} from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../store/appProvider'
import CreateField from '../UI/createField'

type IField = Record<string, string>

const validationSchema = Yup.object().shape({
	participant_id: Yup.string().required('ID is required'),
	// age: Yup.string().required('Age is required'),
	// sex: Yup.string().required('Sex is required'),
})

const CreateParticipant = ({ dataset, open, handleClose, participantEditId }: { dataset?: BIDSDataset, 	open: boolean
	handleClose: () => void, participantEditId?: string }) => {
	const { showNotif } = useNotification()
	const [submitted, setSubmitted] = useState(false)
	const [editParticipant, setEditParticipant] = useState<Participant>()
	const [fields, setFields] = useState<string[]>([
		'participant_id',
		'age',
		'sex',
	])
	const {
		user: [user],
	} = useAppStore()

	useEffect(() => {
		if (dataset?.Participants) {
			const firstLine = JSON.parse(JSON.stringify(dataset.Participants)).pop()
			if (firstLine) {
				const participantFields = Object.keys(firstLine)
				setFields(participantFields)
			}
		}
	}, [dataset])

	useEffect(() => {
		if (dataset?.Participants && participantEditId) {
			const participant = dataset?.Participants.find(
				p => p.participant_id === participantEditId
			)
			if (participant) {
				setEditParticipant(participant)
			}
		}
	}, [participantEditId, dataset])

	const editMode = participantEditId !== undefined
	const initialValues = editMode
	? editParticipant
	: fields?.reduce((a, f) => ({ ...a, [f]: '' }), {})
	return (
		<Dialog open={open} sx={{ minWidth: '360' }}>
			<DialogTitle
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant='h6'>
					{editMode ? 'Edit' : 'Create'} Participant
				</Typography>
				<IconButton onClick={handleClose}>
					<Close />
				</IconButton>
			</DialogTitle>

		{initialValues && (
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={async (values, { resetForm }) => {
					setSubmitted(true)

					if (editMode) {
						if (!user?.uid || !dataset?.Name || !dataset?.Path) {
							showNotif('Participant not saved', 'error')
							return
						}

						// const subEditClinicalDto: EditSubjectClinicalDto = {
						// 	owner: user.uid,
						// 	dataset: dataset.Name,
						// 	path: dataset.Path,
						// 	subject: `${participant_id}`.replace('sub-', ''),
						// 	clinical: { ...other },
						// }
						// subEditClinical(subEditClinicalDto)
						// 	.then(() => {
						// 		if (user.uid && dataset && dataset.Path) {
						// 			getParticipants(dataset.Path, user.uid).then(data => {
						// 				setdataset({
						// 					...dataset,
						// 					// in case user added a new participant and is editing others
						// 					Participants: dataset?.Participants?.map(p => {
						// 						const id = data.find(
						// 							d => d.participant_id === p.participant_id
						// 						)

						// 						return id ? id : p
						// 					}),
						// 				})

						// 				showNotif('Participant saved', 'success')

						// 				resetForm()
						// 				setSubmitted(false)
						// 			})
						// 		}
						// 	})
						// 	.catch(() => {
						// 		showNotif('Participant not saved', 'error')
						// 		setSubmitted(false)
						// 	})
					} else {
						// const nextParticipants = [...(dataset?.Participants || []), values]
						// if (nextParticipants && dataset)
						// 	setdataset({
						// 		...dataset,
						// 		Participants: nextParticipants,
						// 	})

						showNotif('Participant created.', 'success')

						resetForm()
						setSubmitted(false)
					}
				}}
			>
				{({ errors, handleChange, touched, values, submitForm }) => (
					<Form>
						<DialogContent dividers>
							<Grid container columnSpacing={2} rowSpacing={2}>
								{fields?.map(field => {
									return (
										<Grid item xs={6} key={field}>
											<TextField
												key={field}
												disabled={
													editMode ? field === 'participant_id' : submitted
												}
												size='small'
												fullWidth
												name={field}
												label={field}
												value={(values as IField)[field]}
												onChange={handleChange}
												error={
													// eslint-disable-next-line @typescript-eslint/no-explicit-any
													(touched as any)[field] && (errors as IField)[field]
														? true
														: false
												}
												helperText={
													// eslint-disable-next-line @typescript-eslint/no-explicit-any
													(touched as any)[field] && (errors as IField)[field]
														? (errors as IField)[field]
														: null
												}
											/>
										</Grid>
									)
								})}
							</Grid>
{/* 
							<CreateField
								handleCreateField={({ key }) => {
									if (key) {
										// const nextParticipants = dataset?.Participants?.map(p => ({
										// 	...p,
										// 	[key]: '',
										// }))

										// if (nextParticipants && dataset)
										// 	setdataset({
										// 		...dataset,
										// 		Participants: nextParticipants,
										// 	})

										if (editMode) {
											setFields(f => [...f, key])
										}
									}
								}}
							/>
*/}
						</DialogContent>

						<DialogActions>
							<LoadingButton
								color='primary'
								onSubmit={submitForm}
								type='submit'
								loading={submitted}
								loadingPosition='start'
								startIcon={<Save />}
								variant='contained'
							>
								Save
							</LoadingButton>
						</DialogActions>
					</Form>
				)}
			</Formik>
		)}
		</Dialog>
	)
}

export default CreateParticipant
