import { Add, Edit } from '@mui/icons-material'
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Participant } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import CreateParticipant from './forms/CreateParticipant'
import ParticipantInfo from './participantInfo'

const Participants = (): JSX.Element => {
	const [rows, setRows] = useState<Participant[]>([])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [participantEditId, setParticipantEditId] = useState<string>()
	const [selectedSubject, setSelectedSubject] = useState<string>()
	const {
		selectedBidsDataset: [selectedBidsDataset],
	} = useAppStore()

	useEffect(() => {
		if (selectedBidsDataset?.participants)
			setRows(selectedBidsDataset.participants)
	}, [selectedBidsDataset, setRows])

	const handleEditParticipant = (id: string) => {
		setParticipantEditId(id)
	}

	useEffect(() => {
		if (participantEditId) setIsCreateDialogOpen(true)
	}, [participantEditId])

	const columns = [
		...(selectedBidsDataset?.participants
			?.reduce(
				(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
				[] as string[]
			)
			.map((key: string) => ({
				key,
				name: key,
			})) || []),
	]

	return (
		<>
			<Box sx={{ mt: 2 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography variant='h6'>
						Participants{' '}
						{!selectedBidsDataset && <CircularProgress size={16} />}
					</Typography>
					<Box sx={{ flex: '1 0' }} />
				</Box>
				<Box sx={{ display: 'flex', gap: '1em', mr: 2 }}>
					<Box sx={{ flex: 2 }}>
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
					<Box sx={{ flex: '1 0' }}>
						<Typography
							sx={{ mt: 1, mb: 2 }}
							variant='body2'
							color='text.secondary'
						>
							Subject description
						</Typography>
						<ParticipantInfo subject={selectedSubject} />
					</Box>
				</Box>
			</Box>
			<CreateParticipant
				participantEditId={participantEditId}
				open={isCreateDialogOpen}
				handleClose={() => {
					setParticipantEditId(undefined)
					setIsCreateDialogOpen(!isCreateDialogOpen)
				}}
			/>
		</>
	)
}

Participants.displayName = 'Participants'

export default Participants
