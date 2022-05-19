import { Add } from '@mui/icons-material'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import {
	DataGrid,
	GridColumns,
	GridRowsProp,
	GridSelectionModel,
	GridToolbarContainer,
	GridRowId,
} from '@mui/x-data-grid'
import React, { useEffect, useRef, useState } from 'react'
import { subEditClinical } from '../../../api/bids'
import {
	BIDSDatabase,
	EditSubjectClinicalDto,
	GridApiRef,
	Participant,
} from '../../../api/types'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'
import CreateField from '../../UI/createField'
import CreateParticipant from './forms/CreateParticipant'

const Participants = (): JSX.Element => {
	const { showNotif } = useNotification()
	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
	const [rows, setRows] = useState<GridRowsProp>([])
	const apiRef = useRef<GridApiRef | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [participantCreated, setParticipantCreated] = useState(false)
	const {
		containers: [containers],
		user: [user, setUser],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		participants: [participants, setParticipants],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
		selectedFiles: [selectedFiles, setSelectedFiles],
	} = useAppStore()

	useEffect(() => {
		if (participants) setRows(participants)
	}, [participants, setRows])

	const constantsColumns = ['participant_id', 'age', 'sex']
	const columns: GridColumns = [
		{
			field: 'participant_id',
			headerName: 'participant_id',
			flex: 0.5,
			editable: false,
			renderCell: (params: any) => {
				// This is a hack to assign access to the internal Grid API
				apiRef.current = params.api
				return params.value
			},
		},
		{
			field: 'age',
			headerName: 'age',
			flex: 0.5,
			editable: true,
		},
		{
			field: 'sex',
			headerName: 'sex',
			flex: 0.5,
			editable: true,
		},
		...(participants
			?.reduce(
				(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
				[] as string[]
			)
			.filter((key: string) => !constantsColumns.includes(key))
			.map((key: string) => ({
				field: key,
				headerName: key,
				flex: 0.5,
				editable: true,
			})) || []),
	]

	const handleCreateParticipant = () => {
		setIsModalOpen(true)
	}

	const onRowEditCommit = async (id: GridRowId) => {
		const model = apiRef?.current?.getEditRowsModel() // This object contains all rows that are being edited
		const clinical = Object.entries(model[id]).reduce(
			(a, [k, v]) => ({ ...a, [k]: v.value }),
			{}
		)

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
			subject: `${id}`.replace('sub-', ''),
			clinical,
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
						Participants {!participants && <CircularProgress size={16} />}
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
						// experimentalFeatures={{ newEditingApi: true }}
						getRowId={params => params?.participant_id}
						onRowEditCommit={onRowEditCommit}
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
										Add new Participant
									</Button>
									<CreateField
										handleCreateField={({ key }) => {
											if (key) {
												const nextParticipants = participants?.map(p => ({
													...p,
													[key]: '',
												}))

												if (nextParticipants) setParticipants(nextParticipants)
											}
										}}
									/>
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
				setParticipantCreated={setParticipantCreated}
			/>
		</>
	)
}
Participants.displayName = 'Participants'

export default Participants
