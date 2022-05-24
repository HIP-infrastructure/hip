import { Add } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import {
	DataGrid,
	GridColumns,
	GridEventListener,
	GridEvents,
	GridRowParams,
	GridRowsProp,
	GridSelectionModel,
	GridToolbarContainer,
	MuiEvent,
} from '@mui/x-data-grid'
import React, { useEffect, useRef, useState } from 'react'
import { getBidsDatabases, getParticipants } from '../../../api/bids'
import { GridApiRef } from '../../../api/types'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'
import CreateDatabase from './forms/CreateDatabase'

const Databases = (): JSX.Element => {
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
		selectedFiles: [selectedFiles, setSelectedFiles],
	} = useAppStore()

	useEffect(() => {
		if (selectedBidsDatabase) {
			const s = [selectedBidsDatabase.Name] as GridSelectionModel

			setSelectedFiles([])
			setSelectedParticipants([])
			setSelectionModel(s)
		}
	}, [selectedBidsDatabase])

	useEffect(() => {
		if (dataBaseCreated) {
			setBidsDatabases(undefined)
			getBidsDatabases(user?.uid)
				.then(data => {
					if (data) {
						setBidsDatabases({ data })
					}
				})
				.catch(error => {
					setBidsDatabases({ error })
				})
			setDatabaseCreated(false)
		}
	}, [dataBaseCreated])

	useEffect(() => {
		const selected = bidsDatabases?.data?.find(
			b => b.Name === selectionModel[0]
		)
		if (selected?.Name) {
			setSelectedBidsDatabase(selected)

			if (selected?.path && selected.path !== selectedBidsDatabase?.path) {
				setParticipants(null)

				if (user?.uid) {
					getParticipants(selected?.path, user.uid).then(response => {
						setParticipants(response)
					})
				}
			}
		}
	}, [selectionModel])

	useEffect(() => {
		if (bidsDatabases?.data) setRows(bidsDatabases?.data)
	}, [bidsDatabases])

	const handleCreateDatabase = () => {
		setIsModalOpen(true)

		// const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
		// apiRef?.current?.updateRows([{ id, isNew: true }])
		// apiRef?.current?.setRowMode(id, 'edit')
		// // Wait for the grid to render with the new row
		// setTimeout(() => {
		// 	apiRef?.current?.scrollToIndexes({
		// 		rowIndex: apiRef?.current?.getRowsCount() - 1,
		// 	})
		// 	apiRef?.current?.setCellFocus(id, 'Name')
		// })
	}

	const handleRowEditStart = (
		params: GridRowParams,
		event: MuiEvent<React.SyntheticEvent>
	) => {
		event.defaultMuiPrevented = true
	}

	const handleRowEditStop: GridEventListener<GridEvents.rowEditStop> = (
		params,
		event
	) => {
		event.defaultMuiPrevented = true
	}

	const handleCellFocusOut: GridEventListener<GridEvents.cellFocusOut> = (
		params,
		event
	) => {
		event.defaultMuiPrevented = true
	}

	const handleEditClick = (id: number) => (event: any) => {
		event.stopPropagation()
		apiRef?.current?.setRowMode(id, 'edit')
	}

	// const handleSaveClick = (id: number) => async (event: any) => {
	// 	event.stopPropagation()

	// 	// Wait for the validation to run
	// 	const isValid = await apiRef?.current?.commitRowChange(id)
	// 	if (isValid && user?.uid) {
	// 		apiRef?.current?.setRowMode(id, 'view')
	// 		const row = apiRef?.current?.getRow(id) as Record<string, string>
	// 		apiRef?.current?.updateRows([{ ...row, isNew: false }])

	// 		const data: CreateBidsDatabaseDto = {
	// 			owner: user.uid,
	// 			database: row.Name,
	// 			path: row.path,
	// 			DatasetDescJSON: {
	// 				Name: row.Name,
	// 				BIDSVersion: row.BIDSVersion,
	// 				License: row.Licence,
	// 				Authors: [row.Authors],
	// 				Acknowledgements: row.Acknowledgements,
	// 				HowToAcknowledge: row.HowToAcknowledge,
	// 				Funding: row.Funding.split(','),
	// 				ReferencesAndLinks: row.ReferencesAndLinks.split(','),
	// 				DatasetDOI: row.DatasetDOI,
	// 			}
	// 		}

	// 		const db = await createBidsDatabase(data)
	// 		console.log({ db })

	// 		showNotif('Database successfully saved', 'success')
	// 	}
	// }

	// const handleDeleteClick = (id: number) => (event: any) => {
	// 	event.stopPropagation()
	// 	apiRef?.current?.updateRows([{ id, _action: 'delete' }])

	// 	showNotif('Database successfully deleted', 'success')
	// }

	// const handleCancelClick = (id: number) => (event: any) => {
	// 	event.stopPropagation()
	// 	apiRef?.current?.setRowMode(id, 'view')

	// 	const row = apiRef?.current?.getRow(id)
	// 	if (row!.isNew) {
	// 		apiRef?.current?.updateRows([{ id, _action: 'delete' }])
	// 	}
	// }

	// const onRowEditCommit = (id: GridRowId) => {
	// 	const model = apiRef?.current?.getEditRowsModel(); // This object contains all rows that are being edited
	// 	const newRow: { [key: string]: { value: string | string[] | Participant[] } } = model[id]
	// 	newRow['id'] = { value: id as string };

	// 	// console.log(apiRef?.current?.getRowModels());
	// 	const newDb = Object.keys(newRow)
	// 		.map(k => ({
	// 			[k]: newRow[k].value || 'n/a'
	// 		}))
	// 		.reduce((p, c) => Object.assign(p, c), {})

	// 	const isEditingExistingDb = rows.find(r => r.id === id)
	// 	if (isEditingExistingDb) {
	// 		setRows(previousRows => ([
	// 			...previousRows.map(p =>
	// 				p.id === id ? newDb : p
	// 			)
	// 		]))
	// 		setBidsDatabases(b => ([
	// 			...b.map(p =>
	// 				p.id === id ? newDb : p
	// 			)
	// 		]))
	// 	} else {
	// 		setRows(previousRows => ([
	// 			...previousRows,
	// 			newDb
	// 		]))
	// 		setBidsDatabases(b => ([
	// 			...(b || []),
	// 			newDb
	// 		]))
	// 	}

	// 	apiRef?.current?.setRowMode(id as string, 'view');
	// 	handleSelectDatabase(newDb)

	// 	// createBIDSDatabase({ path: newRow.Name.value as string, database })
	// 	setSnackbar({ children: 'Database successfully created', severity: 'success' });

	// }

	// function renderVersionEditCell(props: any) { // props: GridRenderCellParams<string>)
	// 	const { id, value, api, field } = props

	// 	const handleChange = async (event: any) => {

	// 		if (!id || !field) return

	// 		api?.setEditCellValue({ id, field, value: event.target.value }, event)
	// 		// Check if the event is not from the keyboard
	// 		// https://github.com/facebook/react/issues/7407
	// 		if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
	// 			// Wait for the validation to run
	// 			const isValid = await api?.commitCellChange({ id, field })
	// 			if (isValid) {
	// 				// api.setCellMode(id, field, 'view');
	// 			}
	// 		}
	// 	}

	// 	// const handleRef = (element) => {
	// 	// 	if (element) {
	// 	// 		element.querySelector(`input[value="${value}"]`).focus();
	// 	// 	}
	// 	// };

	// 	return (
	// 		<NativeSelect
	// 			// defaultValue={value}
	// 			value={value}
	// 			onChange={handleChange}
	// 			inputProps={{patient
	// 				name: 'bIDSVersion',
	// 				id: 'bids-version-select',
	// 			}}
	// 		>
	// 			{Array.from(new Set(bidsDatabases?.map(b => b?.BIDSVersion))).map(
	// 				version => (
	// 					<option value={version} key={version}>
	// 						{version}
	// 					</option>
	// 				)
	// 			)}
	// 		</NativeSelect>
	// 	)
	// }

	const columns: GridColumns = [
		// {
		// 	field: 'actions',
		// 	type: 'actions',
		// 	headerName: 'Actions',
		// 	width: 120,
		// 	cellClassName: 'actions',
		// 	getActions: ({ id }: { id: any }) => {
		// 		const isInEditMode = apiRef?.current?.getRowMode(id) === 'edit'

		// 		if (isInEditMode) {
		// 			return [
		// 				<GridActionsCellItem
		// 					icon={<Save />}
		// 					key={`save-${id}`}
		// 					label='Save'
		// 					onClick={handleSaveClick(id)}
		// 					color='primary'
		// 				/>,
		// 				<GridActionsCellItem
		// 					icon={<Cancel />}
		// 					key={`cancel-${id}`}
		// 					label='Cancel'
		// 					className='textPrimary'
		// 					onClick={handleCancelClick(id)}
		// 					color='inherit'
		// 				/>,
		// 			]
		// 		}

		// 		return [
		// 			<GridActionsCellItem
		// 				icon={<Edit />}
		// 				key={`edit-${id}`}
		// 				label='Edit'
		// 				className='textPrimary'
		// 				onClick={handleEditClick(id)}
		// 				color='inherit'
		// 			/>,
		// 			<GridActionsCellItem
		// 				icon={<Delete />}
		// 				key={`delete-${id}`}
		// 				label='Delete'
		// 				onClick={handleDeleteClick(id)}
		// 				color='inherit'
		// 			/>,
		// 		]
		// 	},
		// },
		{
			field: 'Name',
			headerName: 'Name',
			flex: 0.5,
			editable: true,
		},
		// {
		// 	field: 'Participants',
		// 	headerName: 'Participants',
		// 	sortable: false,
		// 	align: 'right',
		// 	renderCell: (params: { value: Participant[] | undefined }) =>
		// 		`${params.value?.length || 0}`,
		// 	width: 120,
		// },
		{
			field: 'Authors',
			headerName: 'Authors',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`,
			flex: 0.5,
			editable: true,
		},
		{
			field: 'BIDSVersion',
			headerName: 'Version',
			flex: 0.2,
			editable: true,
			align: 'right',
			// renderEditCell: renderVersionEditCell,
		},
		// {
		// 	field: 'Path',
		// 	headerName: 'Path',
		// 	sortable: false,
		// 	width: 240,
		// 	editable: false,
		// 	renderCell: (params: any) => {
		// 		// This is a hack to assign access to the internal Grid API
		// 		apiRef.current = params.api
		// 		return (
		// 			<Link
		// 				target='_blank'
		// 				href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${params.value}`}
		// 			>
		// 				{params.value}
		// 			</Link>
		// 		)
		// 	},
		// },
		{
			field: 'Licence',
			headerName: 'Licence',
			sortable: false,
			flex: 0.5,
			editable: true,
		},
		{
			field: 'Acknowledgements',
			headerName: 'Acknowledgements',
			sortable: false,
			flex: 0.5,
			editable: true,
		},
		{
			field: 'HowToAcknowledge',
			headerName: 'How To Acknowledge',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`,
			flex: 0.5,
			editable: true,
		},
		{
			field: 'Funding',
			headerName: 'Funding',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`,
			flex: 0.5,
			editable: true,
		},
		{
			field: 'ReferencesAndLinks',
			headerName: 'References And Links',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`,
			flex: 0.5,
			editable: true,
		},
		{
			field: 'DatasetDOI',
			headerName: 'datasetDOI',
			sortable: false,
			flex: 0.5,
			editable: true,
		},
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
						BIDS Databases {!bidsDatabases && <CircularProgress size={16} />}
					</Typography>
					{bidsDatabases?.error && bidsDatabases?.error && (
						<Alert severity='error'>{bidsDatabases?.error.message}</Alert>
					)}
				</Box>
				<Box sx={{ height: 500, width: '100%' }}>
					<DataGrid
						getRowId={params => params.Name}
						onSelectionModelChange={newSelectionModel => {
							setSelectionModel(newSelectionModel)
						}}
						// onRowEditCommit={onRowEditCommit}
						onRowEditStart={handleRowEditStart}
						onRowEditStop={handleRowEditStop}
						onCellFocusOut={handleCellFocusOut}
						selectionModel={selectionModel}
						rows={rows}
						columns={columns}
						// density="compact"
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
										onClick={handleCreateDatabase}
										variant={'outlined'}
									>
										Create BIDS Database
									</Button>
								</GridToolbarContainer>
							),
						}}
						componentsProps={{
							toolbar: { apiRef },
						}}
						// isCellEditable={((params: GridCellParams<any, any, any>) => true)}
					/>
				</Box>
			</Box>
			<CreateDatabase
				open={isModalOpen}
				handleClose={() => setIsModalOpen(!isModalOpen)}
				setDatabaseCreated={setDatabaseCreated}
			/>
		</>
	)
}

Databases.displayName = 'Databases'

export default Databases
