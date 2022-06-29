import React, { useState } from 'react'

import {
	Box,
	Button,
	Step,
	StepButton,
	Stepper,
	Typography,
} from '@mui/material'

import { getBidsDatabases, importSubject } from '../../../api/bids'
import { CreateSubjectDto } from '../../../api/types'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'
import TitleBar from '../../UI/titleBar'
import Databases from './databases'
import Files from './files'
import Participants from './participants'
import Summary from './summary'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

const boxStyle = {
	border: 1,
	borderColor: 'grey.400',
	p: 2,
	mr: 1,
	display: 'flex',
	flex: '1 0 auto',
	flexFlow: 'column',
}

const steps = ['BIDS Database', 'Participants', 'Files', 'Summary']

const BidsConverter = () => {
	const { trackEvent } = useMatomo()

	const { showNotif } = useNotification()
	const [activeStep, setActiveStep] = useState(0)
	const [response, setResponse] = useState<{
		error?: Error
		data?: CreateSubjectDto
	}>()
	const {
		user: [user],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		bIDSDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase],
		selectedParticipants: [selectedParticipants],
		selectedFiles: [selectedFiles],
	} = useAppStore()

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1)
	}

	const handleStep = (step: number) => () => {
		setActiveStep(step)
	}

	const handleImportSubject = async () => {
		if (!user?.uid && !selectedBidsDatabase?.path) {
			showNotif('No database selected', 'error')
			return
		}

		const subjects = selectedParticipants?.map(s => {
			const { participant_id, ...other } = s

			return {
				...other,
				sub: participant_id.replace('sub-', ''),
			}
		})

		const createSubjectDto: Partial<CreateSubjectDto> = {
			owner: user?.uid,
			database: selectedBidsDatabase?.Name,
			path: selectedBidsDatabase?.path,
			files: selectedFiles,
			subjects,
		}

		handleNext()
		trackEvent({
			category: 'bids',
			action: 'import',
		})

		setResponse(undefined)
		importSubject(createSubjectDto as CreateSubjectDto)
			.then(data => {
				showNotif('Subject imported', 'success')
				setResponse({ data })

				// reload databases
				getBidsDatabases(user?.uid)
					.then(data => {
						if (data) {
							setBidsDatabases({ data })
						}
					})
					.catch(error => {
						setBidsDatabases({ error })
					})
			})
			.catch(error => {
				showNotif('Subject importation failed', 'error')
				setResponse({ error })

				// FIXME:
				// Actually, from the API, it's not clear if it failed, so
				// reload databases anyway
				getBidsDatabases(user?.uid)
					.then(data => {
						if (data) {
							setBidsDatabases({ data })
						}
					})
					.catch(error => {
						setBidsDatabases({ error })
					})
			})
	}

	const StepNavigation = ({
		activeStep,
		disabled = false,
	}: {
		activeStep: number
		disabled?: boolean
	}) => {
		return (
			<>
				<Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
					<Button
						variant='contained'
						disabled={activeStep === 0 || activeStep === 3}
						onClick={handleBack}
						sx={{ mr: 1 }}
					>
						Back
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />
					{activeStep !== 2 && activeStep < 3 && (
						<Button
							sx={{ mr: 1 }}
							variant='contained'
							disabled={disabled}
							onClick={handleNext}
						>
							Next
						</Button>
					)}
					{activeStep === 2 && (
						<Button
							sx={{ mr: 1 }}
							variant='contained'
							disabled={disabled}
							onClick={handleImportSubject}
						>
							Import
						</Button>
					)}
				</Box>
			</>
		)
	}

	return (
		<>
			<TitleBar
				title='BIDS Importer'
				description={'Import uploaded data into a BIDS database'}
			/>

			<Box sx={{ width: '100%', mt: 3 }}>
				<Stepper
					nonLinear
					activeStep={activeStep}
					sx={{
						boxSizing: 'initial !important',
					}}
				>
					{steps.map((label, index) => {
						const stepProps: { completed?: boolean } = {}
						const labelProps: {
							optional?: React.ReactNode
						} = {}
						return (
							<Step key={label} {...stepProps}>
								<StepButton
									color='inherit'
									disabled={
										!selectedBidsDatabase || (index === 3 && !selectedFiles)
									}
									onClick={handleStep(index)}
									{...labelProps}
								>
									{label}
								</StepButton>
							</Step>
						)
					})}
				</Stepper>

				{activeStep === 0 && (
					<Box sx={{ mt: 2 }}>
						<StepNavigation
							disabled={!selectedBidsDatabase}
							activeStep={activeStep}
						/>
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>Select or create a BIDS Database</strong>
							</Typography>

							<Databases />
						</Box>
					</Box>
				)}

				{activeStep === 1 && (
					<Box sx={{ mt: 2 }}>
						<StepNavigation
							disabled={!selectedBidsDatabase}
							activeStep={activeStep}
						/>
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>Participants in {selectedBidsDatabase?.Name}</strong>
							</Typography>
							<Participants />
						</Box>
					</Box>
				)}
				{activeStep === 2 && (
					<Box sx={{ mt: 2 }}>
						<StepNavigation
							disabled={!selectedBidsDatabase}
							activeStep={activeStep}
						/>
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>Import Files in {selectedBidsDatabase?.Name}</strong>
							</Typography>
							<Files handleImportSubject={handleImportSubject} />
						</Box>
					</Box>
				)}

				{activeStep === 3 && (
					<Box sx={{ mt: 2 }}>
						<StepNavigation activeStep={activeStep} />
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>
									BIDS Importation Summary for {selectedBidsDatabase?.Name}
								</strong>
							</Typography>
							<Summary response={response} />
						</Box>
					</Box>
				)}
			</Box>
		</>
	)
}

BidsConverter.displayName = 'BidsConverter'

export default BidsConverter
