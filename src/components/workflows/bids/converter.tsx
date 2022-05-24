import {
	Box,
	Button,
	Step,
	StepButton,
	Stepper,
	Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { importSubject } from '../../../api/bids'
import { CreateSubjectDto } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import TitleBar from '../../UI/titleBar'
import Databases from './databases'
import Files from './files'
import Participants from './participants'
import Summary from './summary'
import { useNotification } from '../../../hooks/useNotification'

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
	const { showNotif } = useNotification()
	const [activeStep, setActiveStep] = useState(0)
	const [completed, setCompleted] = useState(false)
	const [error, setError] = useState<Error>()
	const {
		containers: [containers],
		user: [user, setUser],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		participants: [participants, setParticipants],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
		selectedFiles: [selectedFiles, setSelectedFiles],
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

	const handleReset = () => {
		setActiveStep(0)
	}

	const handleConvert = async () => {
		if (!user?.uid && !selectedBidsDatabase?.path) {
			showNotif('No database selected', 'error')
			return
		}

		const subjects = selectedParticipants.map(s => {
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

		const newSubject = await importSubject(createSubjectDto as CreateSubjectDto)
		if (newSubject) {
			showNotif('Subject imported', 'success')
			setCompleted(true)
		} else {
			showNotif('Subject importation failed', 'error')
		}
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
				<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
					<Button
						variant='contained'
						disabled={activeStep === 0}
						onClick={handleBack}
						sx={{ mr: 1 }}
					>
						Back
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />
					{activeStep === 2 && (
						<Button
							sx={{ mr: 1 }}
							variant='contained'
							disabled={disabled}
							onClick={handleConvert}
						>
							Convert
						</Button>
					)}
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
				</Box>
			</>
		)
	}

	return (
		<>
			<TitleBar
				title='Bids Converter'
				description={'Import uploaded data into a BIDS database'}
			/>

			<Box sx={{ width: '100%', mt: 3 }}>
				<Stepper nonLinear activeStep={activeStep}>
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
					<Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>Select or create a BIDS Database</strong>
							</Typography>
							{error && showNotif(error.message, 'error')}
							<Databases />
							<StepNavigation
								disabled={!selectedBidsDatabase}
								activeStep={activeStep}
							/>
						</Box>
					</Box>
				)}

				{activeStep === 1 && (
					<Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>Participants in {selectedBidsDatabase?.Name}</strong>
							</Typography>
							<Participants />
							<StepNavigation
								disabled={!selectedBidsDatabase}
								activeStep={activeStep}
							/>
						</Box>
					</Box>
				)}
				{activeStep === 2 && (
					<Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>Import Files in {selectedBidsDatabase?.Name}</strong>
							</Typography>
							<Files />
							<StepNavigation
								disabled={!selectedBidsDatabase || !selectedFiles}
								activeStep={activeStep}
							/>
						</Box>
					</Box>
				)}

				{activeStep === 3 && (
					<Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
						<Box sx={boxStyle}>
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								<strong>
									{' '}
									BIDS Conversion Summary for {selectedBidsDatabase?.Name}
								</strong>
							</Typography>
							<Summary completed={completed} />
							<Participants />
							<StepNavigation activeStep={activeStep} />
						</Box>
					</Box>
				)}
			</Box>
		</>
	)
}

BidsConverter.displayName = 'BidsConverter'

export default BidsConverter
