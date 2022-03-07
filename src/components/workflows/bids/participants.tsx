import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material'
import { Alert, AlertProps, Box, Button, Snackbar } from '@mui/material'
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
	MuiEvent,
} from '@mui/x-data-grid'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BIDSDatabase, GridApiRef, Participant } from '../../../api/types'

interface Props {
	selectedBidsDatabase?: BIDSDatabase
	setBidsDatabases: React.Dispatch<
		React.SetStateAction<BIDSDatabase[] | undefined>
	>
	handleSelectParticipant: (selected: Participant) => void
	selectedParticipant?: Participant
}

const Participants = ({
	selectedBidsDatabase,
	setBidsDatabases,
	handleSelectParticipant,
	selectedParticipant,
}: Props): JSX.Element => {
	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
	const [rows, setRows] = useState<GridRowsProp>([])
	const [snackbar, setSnackbar] = React.useState<Pick<
		AlertProps,
		'children' | 'severity'
	> | null>(null)
	const apiRef = useRef<GridApiRef>(null)
	const navigate = useNavigate()

	useEffect(() => {
		if (selectedParticipant) {
			const s = [selectedParticipant.participant_id] as GridSelectionModel
			setSelectionModel(s)
		}
	}, [selectedParticipant])

	useEffect(() => {
		const rows =
			selectedBidsDatabase?.Participants?.map(p => ({
				id: p.participant_id,
				age: p.age,
				sex: p.sex,
				...p,
			})) || []

		setRows(rows)
	}, [selectedBidsDatabase, setRows])

	useEffect(() => {
		if (selectionModel.length === 0) return

		const selected = selectedBidsDatabase?.Participants?.find(
			b => b.participant_id === selectionModel[0]
		)
		if (selected) handleSelectParticipant(selected)
	}, [selectionModel, setSelectionModel])

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

	const handleSaveClick = (id: number) => async (event: any) => {
		event.stopPropagation()
		// Wait for the validation to run
		const isValid = await apiRef?.current?.commitRowChange(id)
		if (isValid) {
			apiRef?.current?.setRowMode(id, 'view')
			const row = apiRef?.current?.getRow(id)
			apiRef?.current?.updateRows([{ ...row, isNew: false }])

			setSnackbar({
				children: 'Participant successfully saved',
				severity: 'success',
			})
		}
	}

	const handleDeleteClick = (id: number) => (event: any) => {
		event.stopPropagation()
		apiRef?.current?.updateRows([{ id, _action: 'delete' }])

		setSnackbar({
			children: 'Participant successfully deleted',
			severity: 'success',
		})
	}

	const handleCancelClick = (id: number) => (event: any) => {
		event.stopPropagation()
		apiRef?.current?.setRowMode(id, 'view')

		const row = apiRef?.current?.getRow(id)
		if (row!.isNew) {
			apiRef?.current?.updateRows([{ id, _action: 'delete' }])
		}
	}

	const constantsColumns = ['participant_id', 'age', 'sex']
	const columns: GridColumns = [
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 120,
			cellClassName: 'actions',
			getActions: ({ id }: { id: any }) => {
				const isInEditMode = apiRef?.current?.getRowMode(id) === 'edit'

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							key={`save-${id}`}
							icon={<Save />}
							label='Save'
							onClick={handleSaveClick(id)}
							color='primary'
						/>,
						<GridActionsCellItem
							key={`cancel-${id}`}
							icon={<Cancel />}
							label='Cancel'
							className='textPrimary'
							onClick={handleCancelClick(id)}
							color='inherit'
						/>,
					]
				}

				return [
					<GridActionsCellItem
						icon={<Edit />}
						key={`edit-${id}`}
						label='Edit'
						className='textPrimary'
						onClick={handleEditClick(id)}
						color='inherit'
					/>,
					<GridActionsCellItem
						icon={<Delete />}
						key={`delete-${id}`}
						label='Delete'
						onClick={handleDeleteClick(id)}
						color='inherit'
					/>,
				]
			},
		},
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
		...(selectedBidsDatabase?.Participants?.reduce(
			(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
			[]
		)
			.filter((key: string) => !constantsColumns.includes(key))
			.map((key: string) => ({
				field: key,
				headerName: key,
				width: 320,
				editable: true,
			})) || {}),
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
		const id = generateString(5)
		apiRef?.current?.updateRows([{ id, isNew: true }])
		apiRef?.current?.setRowMode(id, 'edit')
		// Wait for the grid to render with the new row
		setTimeout(() => {
			apiRef?.current?.scrollToIndexes({
				rowIndex: apiRef?.current?.getRowsCount() - 1,
			})
			apiRef?.current?.setCellFocus(id, 'id')
		})
	}

	// const onRowEditCommit = (id: GridRowId) => {
	// 	const model = apiRef?.current.getEditRowsModel(); // This object contains all rows that are being edited
	// 	const newRow: { [key: string]: { value: string | number } } = model[id]
	// 	newRow['participant_id'] = { value: id };

	// 	// console.log(apiRef?.current?.getRowModels());
	// 	const newParticipant = Object.keys(newRow)
	// 		.map(k => ({
	// 			[k]: newRow[k].value || 'n/a'
	// 		}))
	// 		.reduce((p, c) => Object.assign(p, c), {})

	// 	const isEditingExistingParticipant = rows.find(r => r.participant_id === id)
	// 	if (isEditingExistingParticipant) {
	// 		setRows(previousRows => ([
	// 			...previousRows.map(p =>
	// 				p.participant_id === id ? newParticipant : p
	// 			)
	// 		]))

	// 		// setBidsDatabases(b => ([
	// 		// 	...b.map(p =>
	// 		// 		p.id === id ? newDb : p
	// 		// 	)
	// 		// ]))
	// 	} else {
	// 		setRows(previousRows => ([
	// 			...previousRows,
	// 			newParticipant
	// 		]))
	// 		const newSelectedBidsDatabase = {
	// 			...selectedBidsDatabase,
	// 			Participants: [
	// 				...selectedBidsDatabase?.Participants,
	// 				newParticipant
	// 			]
	// 		}

	// 		setBidsDatabases(previousBidsDatabases => ([
	// 			...previousBidsDatabases.map(b => b.id === newSelectedBidsDatabase.id ?
	// 				newSelectedBidsDatabase : b)
	// 		]))

	// 		// setBidsDatabases(b => ([
	// 		// 	...(b || []),
	// 		// 	newDb
	// 		// ]))
	// 	}

	// 	apiRef?.current?.setRowMode(id, 'view');
	// 	handleSelectParticipant(newParticipant)

	// 	// createBIDSDatabase({ path: newRow.Name.value as string, database })
	// 	setSnackbar({ children: 'Participant successfully saved', severity: 'success' });

	// }

	return (
		<>
			<Box sx={{ mt: 2 }}>
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
					{!!snackbar && (
						<Snackbar
							open
							onClose={() => setSnackbar(null)}
							autoHideDuration={6000}
						>
							<Alert {...snackbar} onClose={() => setSnackbar(null)} />
						</Snackbar>
					)}
				</Box>
			</Box>
		</>
	)
}
Participants.displayName = 'Participants'

export default Participants
