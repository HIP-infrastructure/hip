import * as React from 'react'
import { Add, Edit } from '@mui/icons-material'
import {
	Box,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { writeParticipantsTSV } from '../../api/bids'
import { BIDSDataset, Participant } from '../../api/types'
import { useAppStore } from '../../Store'
import CreateField from '../UI/createField'
import CreateParticipant from './CreateParticipant'
import ParticipantInfo from './ParticipantInfo'
import { useNotification } from '../../hooks/useNotification'

const Participants = ({
	dataset,
	setDataset,
}: {
	dataset?: BIDSDataset
	setDataset: React.Dispatch<React.SetStateAction<BIDSDataset | undefined>>
}): JSX.Element => {
	const { showNotif } = useNotification()
	const [rows, setRows] = useState<Participant[]>([])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [participantEditId, setParticipantEditId] = useState<string>()
	const [selectedSubject, setSelectedSubject] = useState<string>()
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
	}, [dataset?.Participants])

	useEffect(() => {
		if (dataset?.Participants) setRows(dataset.Participants)
	}, [dataset?.Participants, setRows])

	useEffect(() => {
		if (participantEditId) setIsCreateDialogOpen(true)
	}, [participantEditId])

	const handleCreateField = ({ key }: { key: string }) => {
		if (key) {
			const keys = [...fields, key]
			setFields(keys)

			if (dataset?.Participants) {
				const participants = dataset.Participants.map(participant => ({
					...participant,
					[key]: participant[key] ?? 'n/a',
				}))

				if (dataset.Path) {
					writeParticipantsTSV(user?.uid, dataset.Path, {
						Participants: dataset.Participants,
					})
						.then(() => {
							dataset.Participants = participants
							setRows(dataset.Participants)
							showNotif('New field saved. Participants updated', 'success')
						})
						.catch(() => {
							showNotif('New field not saved', 'error')
						})
				}
			}
		}
	}

	const handleCloseCreateParticipant = (participant: Participant | undefined) => {
		if (dataset && participant) {
			const exists =
				dataset?.Participants?.map(p => p.participant_id).includes(
					participant.participant_id
				) || false

			const participants = exists
				? dataset.Participants?.map(p =>
						participant.participant_id === p.participant_id
							? participant
							: p
					) // eslint-disable-line no-mixed-spaces-and-tabs
				: [...(dataset.Participants || []), participant]

			if (participants)
				setDataset({
					...dataset,
					Participants: participants,
				})
		}
		setParticipantEditId(undefined)
		setIsCreateDialogOpen(!isCreateDialogOpen)
	}

	const handleEditParticipant = (id: string) => {
		setParticipantEditId(id)
		setIsCreateDialogOpen(true)
	}

	const columns = [
		...(dataset?.Participants?.reduce(
			(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
			[] as string[]
		).map((key: string) => ({
			key,
			name: key,
		})) || []),
	]

	return (
		<>
			<CreateParticipant
				dataset={dataset}
				participantEditId={participantEditId}
				open={isCreateDialogOpen}
				handleClose={handleCloseCreateParticipant}
			/>
			<Box sx={{ mt: 2 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'start',
					}}
				>
					<Typography variant='h6'>Participants</Typography>
					<Button
						color='primary'
						size='small'
						sx={{ m: 2 }}
						startIcon={<Add />}
						onClick={() => {
							setParticipantEditId(undefined)
							setIsCreateDialogOpen(true)
						}}
						variant='contained'
					>
						Add new Participant
					</Button>
					<CreateField handleCreateField={handleCreateField} />
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '16px 16px',
						mt: 2,
					}}
				>
					<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
						<TableContainer sx={{ maxHeight: 440 }}>
							<Table stickyHeader size='small' aria-label='Participants table'>
								<TableHead>
									<TableRow>
										<TableCell></TableCell>
										{columns.map(c => (
											<TableCell key={c.name}>{c.name}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map(row => (
										<TableRow
											hover
											role='checkbox'
											onClick={() => setSelectedSubject(row.participant_id)}
											key={row.participant_id}
										>
											<TableCell padding='checkbox'>
												<IconButton
													color='primary'
													aria-label='edit'
													onClick={() =>
														handleEditParticipant(row.participant_id)
													}
												>
													<Edit />
												</IconButton>
											</TableCell>
											{Object.keys(row).map(key => (
												<TableCell key={key}>{row[key]}</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
					<Box
						elevation={2}
						component={Paper}
						sx={{
							overflow: 'auto',
							p: 1,
							flex: '1 1',
						}}
					>
						<ParticipantInfo subject={selectedSubject} dataset={dataset} />
					</Box>
				</Box>
			</Box>
		</>
	)
}

Participants.displayName = 'Participants'

export default Participants
