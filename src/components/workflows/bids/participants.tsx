import AddIcon from '@mui/icons-material/Add';
import { Alert, AlertProps, Box, Button, Snackbar } from '@mui/material';
import { DataGrid, GridApiRef, GridColDef, GridRowsProp, GridSelectionModel, GridToolbarContainer } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BIDSDatabase, Participant } from '../../../api/types';

interface Props {
	selectedBidsDatabase?: BIDSDatabase;
	setBidsDatabases: React.Dispatch<React.SetStateAction<BIDSDatabase[] | undefined>>;
	handleSelectParticipant: (selected: Participant) => void;
	selectedParticipant?: Participant
}

const Participants = ({ selectedBidsDatabase, setBidsDatabases, handleSelectParticipant, selectedParticipant }: Props): JSX.Element => {
	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
	const [rows, setRows] = useState<GridRowsProp>([])
	const [snackbar, setSnackbar] = React.useState<Pick<
		AlertProps,
		'children' | 'severity'
	> | null>(null);
	const apiRef = useRef<GridApiRef>(null);
	const navigate = useNavigate()

	useEffect(() => {
		if (selectedParticipant) {
			const s = [selectedParticipant.participant_id] as GridSelectionModel
			setSelectionModel(s)
		}
	}, [selectedParticipant])

	useEffect(() => {
		const rows = selectedBidsDatabase?.Participants?.map(p => ({
			id: p.participant_id,
			age: p.age,
			sex: p.sex,
			...p
		})) || []

		setRows(rows)
	}, [selectedBidsDatabase, setRows])

	useEffect(() => {
		if (selectionModel.length === 0) return

		const selected = selectedBidsDatabase?.Participants?.find(b => b.participant_id === selectionModel[0])
		if (selected)
			handleSelectParticipant(selected)

	}, [selectionModel, setSelectionModel])


	const constantsColumns = ['participant_id', 'age', 'sex']
	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: 'id',
			width: 320,
			editable: true,
			renderCell: (params: any) => {
				// This is a hack to assign access to the internal Grid API
				apiRef.current = params.api;
				return params.value
			}
		}, {
			field: 'age',
			headerName: 'age',
			width: 320,
			editable: true
		},
		{
			field: 'sex',
			headerName: 'sex',
			width: 320,
			editable: true
		},
		...(selectedBidsDatabase?.Participants?.reduce((a, c) =>
			Array.from(new Set([...a, ...Object.keys(c)])), [])
			.filter((key: string) => !constantsColumns.includes(key))
			.map((key: string) => ({
				field: key,
				headerName: key,
				width: 320,
				editable: true
			})) || {})

	];

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	function generateString(length: number) {
		let result = ' ';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	const handleCreateParticipant = () => {
		const id = generateString(5);
		apiRef?.current?.updateRows([{ id, isNew: true }]);
		apiRef.current.setRowMode(id, 'edit');
		// Wait for the grid to render with the new row
		setTimeout(() => {
			apiRef.current.scrollToIndexes({
				rowIndex: apiRef.current.getRowsCount() - 1,
			});
			apiRef.current.setCellFocus(id, 'id');
		});
	}

	const onRowEditCommit = (id: GridRowId) => {
		const model = apiRef?.current.getEditRowsModel(); // This object contains all rows that are being edited
		const newRow: { [key: string]: { value: string | number } } = model[id]
		newRow['participant_id'] = { value: id };

		// console.log(apiRef.current.getRowModels());
		const newParticipant = Object.keys(newRow)
			.map(k => ({
				[k]: newRow[k].value || 'n/a'
			}))
			.reduce((p, c) => Object.assign(p, c), {})

		const isEditingExistingParticipant = rows.find(r => r.participant_id === id)
		if (isEditingExistingParticipant) {
			setRows(previousRows => ([
				...previousRows.map(p =>
					p.participant_id === id ? newParticipant : p
				)
			]))

			// setBidsDatabases(b => ([
			// 	...b.map(p =>
			// 		p.id === id ? newDb : p
			// 	)
			// ]))
		} else {
			setRows(previousRows => ([
				...previousRows,
				newParticipant
			]))
			const newSelectedBidsDatabase = {
				...selectedBidsDatabase,
				Participants: [
					...selectedBidsDatabase?.Participants,
					newParticipant
				]
			}

			setBidsDatabases(previousBidsDatabases => ([
				...previousBidsDatabases.map(b => b.id === newSelectedBidsDatabase.id ?
					newSelectedBidsDatabase : b)
			]))

			// setBidsDatabases(b => ([
			// 	...(b || []),
			// 	newDb
			// ]))
		}

		apiRef.current.setRowMode(id, 'view');
		handleSelectParticipant(newParticipant)

		// createBIDSDatabase({ path: newRow.Name.value as string, database })
		setSnackbar({ children: 'Participant successfully saved', severity: 'success' });

	}

	return (
		<>
			<Box sx={{ mt: 2 }}>

				<Box sx={{ height: 400, width: '100%' }}>
					<DataGrid
						onSelectionModelChange={(newSelectionModel) => {
							setSelectionModel(newSelectionModel);
						}}
						onRowEditCommit={onRowEditCommit}
						selectionModel={selectionModel}
						rows={rows}
						columns={columns}
						pageSize={100}
						rowsPerPageOptions={[100]}
						editMode="row"
						components={{
							Toolbar: () =>
								<GridToolbarContainer>
									<Button
										color="primary"
										size='small'
										sx={{ mt: 0.5, mb: 0.5 }}
										startIcon={<AddIcon />}
										onClick={handleCreateParticipant}
										variant={'outlined'}
									>
										Create Participant
									</Button>
								</GridToolbarContainer>,
						}}
					/>
					{!!snackbar && (
						<Snackbar open onClose={() => setSnackbar(null)} autoHideDuration={6000}>
							<Alert {...snackbar} onClose={() => setSnackbar(null)} />
						</Snackbar>
					)}
				</Box>
			</Box >
		</>
	)
}
Participants.displayName = 'Participants'

export default Participants
