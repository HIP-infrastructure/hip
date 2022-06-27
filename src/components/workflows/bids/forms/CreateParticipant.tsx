import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField,
	Typography,
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { getParticipants, subEditClinical } from '../../../../api/bids'
import { EditSubjectClinicalDto, Participant } from '../../../../api/types'
import { useNotification } from '../../../../hooks/useNotification'
import { useAppStore } from '../../../../store/appProvider'
import CreateField from '../../../UI/createField'

type IField = Record<string, string>

const validationSchema = Yup.object().shape({
	participant_id: Yup.string().required('ID is required'),
	// age: Yup.string().required('Age is required'),
	// sex: Yup.string().required('Sex is required'),
})

interface ICreateDatabase {
	participantEditId?: string
	open: boolean
	handleClose: () => void
}

const CreateParticipant = ({
	participantEditId,
	open,
	handleClose,
}: ICreateDatabase) => {
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
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		selectedParticipants: [_selectedParticipants, setSelectedParticipants],
	} = useAppStore()

	useEffect(() => {
		if (selectedBidsDatabase?.participants) {
			const one = JSON.parse(
				JSON.stringify(selectedBidsDatabase.participants)
			).pop()
			if (one) {
				const participantFields = Object.keys(one)
				setFields(participantFields)
			}
		}
	}, [selectedBidsDatabase])

	useEffect(() => {
		if (selectedBidsDatabase?.participants && participantEditId) {
			const participant = selectedBidsDatabase?.participants.find(
				p => p.participant_id === participantEditId
			)
			if (participant) {
				setEditParticipant(participant)
			}
		}
	}, [participantEditId])

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
							if (
								!user?.uid ||
								!selectedBidsDatabase?.Name ||
								!selectedBidsDatabase?.path
							) {
								showNotif('Participant not saved', 'error')
								return
							}

							const { participant_id, ...other } = values
							const subEditClinicalDto: EditSubjectClinicalDto = {
								owner: user.uid,
								database: selectedBidsDatabase.Name,
								path: selectedBidsDatabase.path,
								subject: `${participant_id}`.replace('sub-', ''),
								clinical: { ...other },
							}
							subEditClinical(subEditClinicalDto)
								.then(() => {
									if (
										user.uid &&
										selectedBidsDatabase &&
										selectedBidsDatabase.path
									) {
										getParticipants(selectedBidsDatabase.path, user.uid).then(
											data => {
												setSelectedBidsDatabase({
													...selectedBidsDatabase,
													// in case user added a new participant and is editing others
													participants: selectedBidsDatabase?.participants?.map(
														p => {
															const id = data.find(
																d => (d.participant_id === p.participant_id)
															)

															return id ? id : p
														}
													),
												})

												showNotif('Participant saved', 'success')

												resetForm()
												handleClose()
												setSubmitted(false)
											}
										)
									}
								})
								.catch(error => {
									console.log(error)
									showNotif('Participant not saved', 'error')
									setSubmitted(false)
								})
						} else {
							setSelectedParticipants([values])

							const nextParticipants = [
								...(selectedBidsDatabase?.participants || []),
								values,
							]
							if (nextParticipants && selectedBidsDatabase)
								setSelectedBidsDatabase({
									...selectedBidsDatabase,
									participants: nextParticipants,
								})

							showNotif('Participant created.', 'success')

							resetForm()
							setSubmitted(false)
							handleClose()
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
														(touched as IField)[field] &&
														(errors as IField)[field]
															? true
															: false
													}
													helperText={
														(touched as IField)[field] &&
														(errors as IField)[field]
															? (errors as IField)[field]
															: null
													}
												/>
											</Grid>
										)
									})}
								</Grid>

								<CreateField
									handleCreateField={({ key }) => {
										if (key) {
											const nextParticipants =
												selectedBidsDatabase?.participants?.map(p => ({
													...p,
													[key]: '',
												}))

											if (nextParticipants && selectedBidsDatabase)
												setSelectedBidsDatabase({
													...selectedBidsDatabase,
													participants: nextParticipants,
												})

											if (editMode) {
												setFields(f => [...f, key])
											}
										}
									}}
								/>
							</DialogContent>

							<DialogActions>
								<Button
									disabled={submitted}
									color='error'
									onClick={handleClose}
								>
									Close
								</Button>
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
