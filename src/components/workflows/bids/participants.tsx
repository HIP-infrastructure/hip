import { Add } from '@mui/icons-material'
import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography,
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { subEditClinical } from '../../../api/bids'
import {
	BIDSDatabase,
	EditSubjectClinicalDto,
	Participant,
} from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import CreateField from '../../UI/createField'
import CreateParticipant from './forms/CreateParticipant'
import DataGrid from 'react-data-grid'
import { useNotification } from '../../../hooks/useNotification'

const Participants = (): JSX.Element => {
	const { showNotif } = useNotification()
	const [rows, setRows] = useState<Participant[]>([])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [_participantCreated, setParticipantCreated] = useState(false)
	const {
		user: [user],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
	} = useAppStore()

	useEffect(() => {
		if (selectedBidsDatabase?.participants)
			setRows(selectedBidsDatabase.participants)
	}, [selectedBidsDatabase, setRows])

	const editor = ({
		row,
		column,
		onRowChange,
		onClose,
	}: {
		row: Participant
		column: { key: string }
	}) => {
		return (
			<TextField
				value={row[column.key]}
				onChange={event => {
					onRowChange({ ...row, [column.key]: event.target.value })
				}}
				onBlur={() => onClose(true)}
				onKeyPress={event => {
					console.log(`Pressed keyCode ${event.key}`)
					if (event.key === '0') {
						// Do code here
						event.preventDefault()

						if (
							!user?.uid ||
							!selectedBidsDatabase?.Name ||
							!selectedBidsDatabase?.path
						) {
							return
						}

						const subEditClinicalDto: EditSubjectClinicalDto = {
							owner: user.uid,
							database: selectedBidsDatabase.Name,
							path: selectedBidsDatabase.path,
							subject: `${row.participant_id}`.replace('sub-', ''),
							clinical: { ...row, [column.key]: event.target.value },
						}

						subEditClinical(subEditClinicalDto)
							.then(data => {
								console.log(data)
								showNotif('Participant saved', 'success')
							})
							.catch(error => {
								console.log(error)
								showNotif('Participant not saved', 'error')
							})
					}
				}}
			/>
		)
	}

	const constantsColumns = ['participant_id', 'age', 'sex']
	const columns = [
		{
			key: 'participant_id',
			name: 'participant_id',
			resizable: true,
			frozen: true,
		},
		{
			key: 'age',
			name: 'age',
		},
		{
			key: 'sex',
			name: 'sex',
		},
		...(selectedBidsDatabase?.participants
			?.reduce(
				(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
				[] as string[]
			)
			.filter((key: string) => !constantsColumns.includes(key))
			.map((key: string) => ({
				key,
				name: key,
				resizable: true,
			})) || []),
	]

	function rowKeyGetter(row: Participant) {
		return row.participant_id
	}

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
					<Button
						color='primary'
						size='small'
						sx={{ mt: 0.5, mb: 0.5 }}
						startIcon={<Add />}
						onClick={() => setIsCreateDialogOpen(true)}
						variant='contained'
					>
						Add new Participant
					</Button>
					<CreateField
						handleCreateField={({ key }) => {
							if (key) {
								const nextParticipants =
									selectedBidsDatabase?.participants?.map(p => ({
										...p,
										[key]: '',
									}))

								if (nextParticipants)
									setSelectedBidsDatabase({
										...selectedBidsDatabase,
										participants: nextParticipants,
									})
							}
						}}
					/>
				</Box>
				<DataGrid columns={columns} rows={rows} rowKeyGetter={rowKeyGetter} />
			</Box>
			<CreateParticipant
				open={isCreateDialogOpen}
				handleClose={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
				setParticipantCreated={setParticipantCreated}
			/>
		</>
	)
}
Participants.displayName = 'Participants'

export default Participants
