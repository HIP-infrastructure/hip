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

interface ICreateDataset {
	participantEditId?: string
	open: boolean
	handleClose: () => void
}

const CreateParticipant = ({
	participantEditId,
	open,
	handleClose,
}: ICreateDataset) => {
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
		selectedBidsDataset: [selectedBidsDataset, setSelectedBidsDataset],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		selectedParticipants: [_selectedParticipants, setSelectedParticipants],
	} = useAppStore()

	useEffect(() => {
		if (selectedBidsDataset?.participants) {
			const one = JSON.parse(
				JSON.stringify(selectedBidsDataset.participants)
			).pop()
			if (one) {
				const participantFields = Object.keys(one)
				setFields(participantFields)
			}
		}
	}, [selectedBidsDataset])

	useEffect(() => {
		if (selectedBidsDataset?.participants && participantEditId) {
			const participant = selectedBidsDataset?.participants.find(
				p => p.participant_id === participantEditId
			)
			if (participant) {
				setEditParticipant(participant)
			}
		}
	}, [participantEditId, selectedBidsDataset])

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
								!selectedBidsDataset?.Name ||
								!selectedBidsDataset?.path
							) {
								showNotif('Participant not saved', 'error')
								return
							}

							const { participant_id, ...other } = values
							const subEditClinicalDto: EditSubjectClinicalDto = {
								owner: user.uid,
								dataset: selectedBidsDataset.Name,
								path: selectedBidsDataset.path,
								subject: `${participant_id}`.replace('sub-', ''),
								clinical: { ...other },
							}
							subEditClinical(subEditClinicalDto)
								.then(() => {
									if (
										user.uid &&
										selectedBidsDataset &&
										selectedBidsDataset.path
									) {
										getParticipants(selectedBidsDataset.path, user.uid).then(
											data => {
												setSelectedBidsDataset({
													...selectedBidsDataset,
													// in case user added a new participant and is editing others
													participants: selectedBidsDataset?.participants?.map(
														p => {
															const id = data.find(
																d => d.participant_id === p.participant_id
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
								.catch(() => {
									showNotif('Participant not saved', 'error')
									setSubmitted(false)
								})
						} else {
							setSelectedParticipants([values])

							const nextParticipants = [
								...(selectedBidsDataset?.participants || []),
								values,
							]
							if (nextParticipants && selectedBidsDataset)
								setSelectedBidsDataset({
									...selectedBidsDataset,
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

								<CreateField
									handleCreateField={({ key }) => {
										if (key) {
											const nextParticipants =
												selectedBidsDataset?.participants?.map(p => ({
													...p,
													[key]: '',
												}))

											if (nextParticipants && selectedBidsDataset)
												setSelectedBidsDataset({
													...selectedBidsDataset,
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
