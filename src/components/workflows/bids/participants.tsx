import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material'
import { Alert, AlertProps, Box, Button, CircularProgress, Snackbar, Typography } from '@mui/material'
import {
	DataGrid,
	GridActionsCellItem,
	GridColumns,
	GridEventListener,
	GridEvents,
	GridRowParams,
	GridRowsProp,
	GridSelectionModel,
	GridToolbarContainer,
	MuiEvent
} from '@mui/x-data-grid'
import React, { useEffect, useRef, useState } from 'react'
import { BIDSDatabase, GridApiRef, Participant } from '../../../api/types'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'
import CreateParticipant from './forms/CreateParticipant'

interface Props {
	selectedBidsDatabase?: BIDSDatabase
	setBidsDatabases: React.Dispatch<
		React.SetStateAction<BIDSDatabase[] | undefined>
	>
	handleSelectParticipant: (selected: Participant) => void
	selectedParticipants?: Participant
}

const Participants = (): JSX.Element => {
	const { showNotif } = useNotification()
	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
	const [rows, setRows] = useState<GridRowsProp>([])
	const apiRef = useRef<GridApiRef | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [dataBaseCreated, setDatabaseCreated] = useState(false)
	const {
		containers: [containers],
		user: [user, setUser],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		participants: [participants, setParticipants],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
		selectedFiles: [selectedFiles, setSelectedFiles]
	} = useAppStore()

	useEffect(() => {
		const rows =
			participants?.map(p => ({
				id: p.participant_id,
				age: p.age,
				sex: p.sex,
				...p,
			}))
		if (rows) setRows(rows)
	}, [participants, setRows])

	useEffect(() => {
		console.log(participants)
	}, [participants])

	// useEffect(() => {
	// 	if (selectionModel.length === 0) return

	// 	const selected = participants?.find(
	// 		b => b.participant_id === selectionModel[0]
	// 	)
	// 	if (selected) setSelectedParticipants(selected)
	// }, [selectionModel])


	const constantsColumns = ['participant_id', 'age', 'sex']
	const columns: GridColumns = [
		{
			field: 'id',
			headerName: 'id',
			width: 320,
			editable: true,
			renderCell: (params: any) => {
				// This is a hack to assign access to the internal Grid API
				apiRef.current = params.api
				return params.value
			},
		},
		{
			field: 'age',
			headerName: 'age',
			width: 320,
			editable: true,
		},
		{
			field: 'sex',
			headerName: 'sex',
			width: 320,
			editable: true,
		},
		...(participants?.reduce(
			(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
			[] as string[]
		)
			.filter((key: string) => !constantsColumns.includes(key))
			.map((key: string) => ({
				field: key,
				headerName: key,
				width: 320,
				editable: true,
			})) || []),
	]

	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	function generateString(length: number) {
		let result = ' '
		const charactersLength = characters.length
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}

		return result
	}

	const handleCreateParticipant = () => {
		setIsModalOpen(true)
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
						Participants in {selectedBidsDatabase?.Name} {!participants && <CircularProgress size={16} />}
					</Typography>
				</Box>
				<Box
					sx={{
						height: 500,
						width: '100%',
						'& .actions': {
							color: 'text.secondary',
						},
						'& .textPrimary': {
							color: 'text.primary',
						},
					}}
				>
					<DataGrid
						// getRowId={(params) => params?.participant_id}
						// onSelectionModelChange={newSelectionModel => {
						// 	setSelectionModel(newSelectionModel)
						// }}
						rows={rows}
						columns={columns}
						pageSize={100}
						rowsPerPageOptions={[100]}
						editMode='row'
						components={{
							Toolbar: () => (
								<GridToolbarContainer>
									<Button
										color='primary'
										size='small'
										sx={{ mt: 0.5, mb: 0.5 }}
										startIcon={<Add />}
										onClick={handleCreateParticipant}
										variant={'outlined'}
									>
										Create Participant
									</Button>
								</GridToolbarContainer>
							),
						}}
						componentsProps={{
							toolbar: { apiRef },
						}}
					/>
				</Box>
			</Box>
			<CreateParticipant
				open={isModalOpen}
				handleClose={() => setIsModalOpen(!isModalOpen)}
				setDatabaseCreated={setDatabaseCreated}
			/>
		</>
	)
}
Participants.displayName = 'Participants'

export default Participants
