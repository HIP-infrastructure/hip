import { Add, Edit } from '@mui/icons-material'
import {
	Box,
	Button, IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { BIDSDataset, Participant } from '../../api/types'
import CreateParticipant from './CreateParticipant'
import ParticipantInfo from './ParticipantInfo'
import * as React from 'react'

const Participants = ({ dataset }: { dataset?: BIDSDataset }): JSX.Element => {
	const [rows, setRows] = useState<Participant[]>([])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [participantEditId, setParticipantEditId] = useState<string>()
	const [selectedSubject, setSelectedSubject] = useState<string>()

	useEffect(() => {
		if (dataset?.Participants) setRows(dataset.Participants)
	}, [dataset, setRows])

	const handleEditParticipant = (id: string) => {
		setParticipantEditId(id)
		setIsCreateDialogOpen(true)
	}

	useEffect(() => {
		if (participantEditId) setIsCreateDialogOpen(true)
	}, [participantEditId])

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
				handleClose={() => {
					setParticipantEditId(undefined)
					setIsCreateDialogOpen(!isCreateDialogOpen)
				}}
			/>
			<Box sx={{ mt: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
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
						<ParticipantInfo subject={selectedSubject} dataset={dataset}/>
					</Box>
				</Box>
			</Box>
		</>
	)
}

Participants.displayName = 'Participants'

export default Participants
