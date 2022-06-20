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
import { useEffect, useReducer, useState } from 'react'
import { Participant } from '../../../api/types'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'
import CreateParticipant from './forms/CreateParticipant'

const Participants = (): JSX.Element => {
	const { showNotif } = useNotification()
	const [_, forceUpdate] = useReducer(x => x + 1, 0)
	const [rows, setRows] = useState<Participant[]>([])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [participantEditId, setParticipantEditId] = useState<string>()
	const [_participantCreated, setParticipantCreated] = useState(false)
	const {
		selectedBidsDatabase: [selectedBidsDatabase],
	} = useAppStore()

	useEffect(() => {
		if (selectedBidsDatabase?.participants)
			setRows(selectedBidsDatabase.participants)
	}, [selectedBidsDatabase, setRows])

	const handleEditParticipant = (id: string) => {
		setParticipantEditId(id)
		forceUpdate()
		setIsCreateDialogOpen(true)
	}

	const columns = [
		...(selectedBidsDatabase?.participants
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
						{!selectedBidsDatabase && <CircularProgress size={16} />}
					</Typography>
					<Box sx={{ flex: '1 0' }} />
				</Box>

				<TableContainer sx={{ maxHeight: 440 }}>
					<Table stickyHeader size='small' aria-label='Participants table'>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								{columns.map(c => (
									<TableCell>{c.name}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(row => (
								<TableRow key={row.participant_id}>
									<TableCell padding='checkbox'>
										<IconButton
											color='primary'
											aria-label='edit'
											onClick={() => handleEditParticipant(row.participant_id)}
										>
											<Edit />
										</IconButton>
									</TableCell>
									{Object.keys(row).map(key => (
										<TableCell>{row[key]}</TableCell>
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
			<CreateParticipant
				participantEditId={participantEditId}
				open={isCreateDialogOpen}
				handleClose={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
				setParticipantCreated={setParticipantCreated}
			/>
		</>
	)
}
Participants.displayName = 'Participants'

export default Participants
