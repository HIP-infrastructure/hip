import {
	Alert,
	Box,
	Button,
	Step,
	StepLabel,
	Stepper,
	Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getBids } from '../../../api/gatewayClientAPI'
import { BIDSDatabase, File as IFile, Participant } from '../../../api/types'
import TitleBar from '../../UI/titleBar'
import Databases from './databases'
import Files from './files'
import Participants from './participants'
import Summary from './summary'

const steps = ['BIDS Database', 'Participant', 'Files', 'Summary']
const boxStyle = {
	border: 1,
	borderColor: 'grey.400',
	p: 2,
	mr: 1,
	display: 'flex',
	flex: '1 0 auto',
	flexFlow: 'column',
}
const BidsConverter = () => {
	const [activeStep, setActiveStep] = useState(2)
	const [bidsDatabases, setBidsDatabases] = useState<BIDSDatabase[]>()
	const [selectedBidsDatabase, setSelectedBidsDatabase] =
		useState<BIDSDatabase>()
	const [selectedParticipant, setSelectedParticipant] = useState<Participant>()
	const [selectedFiles, setSelectedFiles] = useState<IFile[]>()
	const [error, setError] = useState<Error>()

	useEffect(() => {
		getBids().then(r => {
			const db = r.data

			if (r.error) setError(r.error)

			if (db) setBidsDatabases(db)
		})
	}, [])

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1)
	}

	const handleReset = () => {
		setActiveStep(0)
	}

	const StepNavigation = ({
		activeStep,
		disabled = false,
	}: {
		activeStep: number
		disabled?: boolean
	}) => (
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
				<Button
					sx={{ mr: 1 }}
					variant='contained'
					disabled={disabled}
					onClick={handleNext}
				>
					{activeStep === steps.length - 1 ? 'Convert' : 'Next'}
				</Button>
			</Box>
		</>
	)

	const Title = ({ activeStep }: { activeStep: number }) => (
		<Typography sx={{ mt: 2, mb: 1 }}>{steps[activeStep]}</Typography>
	)

	return (
		<>
			<TitleBar title='Bids Converter' />

			<Box sx={{ width: '100%', mt: 3 }}>
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => {
						const stepProps: { completed?: boolean } = {}
						const labelProps: {
							optional?: React.ReactNode
						} = {}
						return (
							<Step key={label} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						)
					})}
				</Stepper>

				{activeStep === 0 && (
					<>
						<Box
							sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}
						>
							<Box sx={boxStyle}>
								<Typography variant='subtitle1' sx={{ mb: 1 }}>
									<strong>Select a BIDS Database, or create a new one</strong>
								</Typography>
								{error && (
									<Alert sx={{ mt: 1, mb: 1 }} severity='error'>
										{error.message}
									</Alert>
								)}
								<Databases
									bidsDatabases={bidsDatabases}
									setBidsDatabases={setBidsDatabases}
									handleSelectDatabase={setSelectedBidsDatabase}
									selectedDatabase={selectedBidsDatabase}
								/>
								<StepNavigation
									disabled={!selectedBidsDatabase}
									activeStep={activeStep}
								/>
							</Box>
						</Box>
					</>
				)}

				{activeStep === 1 && (
					<>
						<Box
							sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}
						>
							<Box sx={boxStyle}>
								<Typography variant='subtitle1' sx={{ mb: 1 }}>
									<strong> Select a Participant or create a new one</strong>
								</Typography>
								<Participants
									selectedBidsDatabase={selectedBidsDatabase}
									setBidsDatabases={setBidsDatabases}
									handleSelectParticipant={setSelectedParticipant}
									selectedParticipant={selectedParticipant}
								/>
								<StepNavigation
									disabled={!selectedParticipant}
									activeStep={activeStep}
								/>
							</Box>
						</Box>
					</>
				)}
				{activeStep === 2 && (
					<>
						<Box
							sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}
						>
							<Box sx={boxStyle}>
								<Typography variant='subtitle1' sx={{ mb: 1 }}>
									<strong>Select files, modalities and entities</strong>
								</Typography>
								<Files
									selectedBidsDatabase={selectedBidsDatabase}
									selectedParticipant={selectedParticipant}
									selectedFiles={selectedFiles}
									handleSelectFiles={setSelectedFiles}
								/>
								<StepNavigation activeStep={activeStep} />
							</Box>
							<Box
								sx={{ display: 'flex', flexDirection: 'column', columnGap: 2 }}
							></Box>
						</Box>
					</>
				)}

				{activeStep === 3 && (
					<>
						<Box
							sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}
						>
							<Box sx={boxStyle}>
								<Typography variant='subtitle1' sx={{ mb: 1 }}>
									<strong> BIDS Conversion Summary</strong>
								</Typography>
								{selectedFiles &&
									<Summary
										selectedBidsDatabase={selectedBidsDatabase}
										selectedParticipant={selectedParticipant}
										selectedFiles={selectedFiles}
									/>}
								<StepNavigation activeStep={activeStep} />
							</Box>
							<Box
								sx={{ display: 'flex', flexDirection: 'column', columnGap: 2 }}
							></Box>
						</Box>
					</>
				)}
			</Box>
		</>
	)
}

BidsConverter.displayName = 'BidsConverter'

export default BidsConverter
