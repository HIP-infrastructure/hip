import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { Alert, AlertProps, Box, Button, CircularProgress, Link, NativeSelect, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColumns, GridEventListener, GridEvents, GridRenderCellParams, GridRowParams, GridRowsProp, GridSelectionModel, GridToolbarContainer, MuiEvent } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BIDSDatabase, Participant } from '../../../api/types';

interface GridApiRef {
	updateRows: (params: [{ id?: number, isNew?: boolean, _action?: string }]) => void
	setRowMode: (id: number, mode: string) => void
	scrollToIndexes: ({ rowIndex }: { rowIndex: number }) => void
	setCellFocus: (id: number, mode: string) => void
	getRowsCount: (id?: number) => number
	getRow: (id: number) => { isNew?: boolean }
	commitRowChange: (id: number) => void
	getRowMode: (id: number) => string
	getEditRowsModel: () => any
}
interface Props {
	bidsDatabases?: BIDSDatabase[];
	setBidsDatabases: React.Dispatch<React.SetStateAction<BIDSDatabase[] | undefined>>;
	handleSelectDatabase: (selected: BIDSDatabase) => void;
	selectedDatabase?: BIDSDatabase
}

const Databases = ({ bidsDatabases, setBidsDatabases, handleSelectDatabase, selectedDatabase }: Props): JSX.Element => {
	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
	const [rows, setRows] = useState<GridRowsProp>([])
	const [snackbar, setSnackbar] = React.useState<Pick<
		AlertProps,
		'children' | 'severity'
	> | null>(null);
	const apiRef = useRef<GridApiRef>(null);
	const navigate = useNavigate()

	useEffect(() => {
		if (selectedDatabase) {
			const s = [selectedDatabase.id] as GridSelectionModel
			setSelectionModel(s)
		}
	}, [selectedDatabase])

	useEffect(() => {
		const selected = bidsDatabases?.find(b => b.id === selectionModel[0])
		if (selected)
			handleSelectDatabase(selected)

	}, [selectionModel, setSelectionModel])

	useEffect(() => {
		setRows(bidsDatabases?.map(db =>
		({
			Browse: db.Path,
			...db
		})) || [])
	}, [bidsDatabases])


	const handleCreateDatabase = () => {
		const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
		apiRef?.current?.updateRows([{ id, isNew: true }]);
		apiRef?.current?.setRowMode(id, 'edit');
		// Wait for the grid to render with the new row
		setTimeout(() => {
			apiRef?.current?.scrollToIndexes({
				rowIndex: apiRef?.current?.getRowsCount() - 1,
			});
			apiRef?.current?.setCellFocus(id, 'Name');
		});
	}

	const handleRowEditStart = (
		params: GridRowParams,
		event: MuiEvent<React.SyntheticEvent>,
	) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop: GridEventListener<GridEvents.rowEditStop> = (
		params,
		event,
	) => {
		event.defaultMuiPrevented = true;
	};

	const handleCellFocusOut: GridEventListener<GridEvents.cellFocusOut> = (
		params,
		event,
	) => {
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id: number) => (event: any) => {
		event.stopPropagation();
		apiRef?.current?.setRowMode(id, 'edit');
	};

	const handleSaveClick = (id: number) => async (event: any) => {
		event.stopPropagation();
		// Wait for the validation to run
		const isValid = await apiRef?.current?.commitRowChange(id);
		if (isValid) {
			apiRef?.current?.setRowMode(id, 'view');
			const row = apiRef?.current?.getRow(id);
			apiRef?.current?.updateRows([{ ...row, isNew: false }]);

			setSnackbar({ children: 'Database successfully saved', severity: 'success' });

		}
	};

	const handleDeleteClick = (id: number) => (event: any) => {
		event.stopPropagation();
		apiRef?.current?.updateRows([{ id, _action: 'delete' }]);

		setSnackbar({ children: 'Database successfully deleted', severity: 'success' });

	};

	const handleCancelClick = (id: number) => (event: any) => {
		event.stopPropagation();
		apiRef?.current?.setRowMode(id, 'view');

		const row = apiRef?.current?.getRow(id);
		if (row!.isNew) {
			apiRef?.current?.updateRows([{ id, _action: 'delete' }]);
		}
	};

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

	function renderVersionEditCell(props: GridRenderCellParams<string>) {
		const { id, value, api, field } = props;

		const handleChange = async (event: any) => {
			api.setEditCellValue({ id, field, value: event.target.value }, event);
			// Check if the event is not from the keyboard
			// https://github.com/facebook/react/issues/7407
			if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
				// Wait for the validation to run
				const isValid = await api.commitCellChange({ id, field });
				if (isValid) {
					// api.setCellMode(id, field, 'view');
				}
			}
		};

		// const handleRef = (element) => {
		// 	if (element) {
		// 		element.querySelector(`input[value="${value}"]`).focus();
		// 	}
		// };

		return (
			<NativeSelect
				// defaultValue={value}
				value={value}
				onChange={handleChange}
				inputProps={{
					name: 'bIDSVersion',
					id: 'bids-version-select',
				}}
			>
				{Array.from(new Set(bidsDatabases?.data?.map(b => b?.BIDSVersion)))
					.map(version =>
						<option
							value={version}
							key={version}>
							{version}
						</option>)
				}
			</NativeSelect>
		);
	}

	const columns: GridColumns = [
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 120,
			cellClassName: 'actions',
			getActions: ({ id }: { id: any }) => {
				const isInEditMode = apiRef?.current?.getRowMode(id) === 'edit';

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<Save />}
							label="Save"
							onClick={handleSaveClick(id)}
							color="primary"
						/>,
						<GridActionsCellItem
							icon={<Cancel />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							color="inherit"
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<Edit />}
						label="Edit"
						className="textPrimary"
						onClick={handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<Delete />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
		{
			field: 'Browse',
			headerName: 'See Data',
			sortable: false,
			renderCell: (params: any) => {
				// This is a hack to assign access to the internal Grid API
				apiRef.current = params.api;
				return <Link
					target="_blank"
					href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${params.value}`}
				>
					Browse
				</Link>
			}
			,
			width: 96
		},
		{
			field: 'Name',
			headerName: 'Name',
			width: 160,
			editable: true
		},
		{
			field: 'Participants',
			headerName: 'Participants',
			sortable: false,
			align: 'right',
			renderCell: (params: { value: Participant[] | undefined }) =>
				`${params.value?.length || 0}`
			,
			width: 120
		},
		{
			field: 'Authors',
			headerName: 'Authors',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`
			,
			width: 160,
			editable: true
		},
		{
			field: 'BIDSVersion',
			headerName: 'Version',
			width: 96,
			editable: true,
			align: 'right',
			renderEditCell: renderVersionEditCell

		},

		{
			field: 'Licence',
			headerName: 'Licence',
			sortable: false,
			width: 120,
			editable: true
		},
		{
			field: 'Acknowledgements',
			headerName: 'Acknowledgements',
			sortable: false,
			width: 120,
			editable: true
		}
		,
		{
			field: 'HowToAcknowledge',
			headerName: 'How To Acknowledge',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`
			,
			width: 120,
			editable: true
		}
		,
		{
			field: 'Funding',
			headerName: 'Funding',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`
			,
			width: 120,
			editable: true
		}
		,
		{
			field: 'ReferencesAndLinks',
			headerName: 'References And Links',
			sortable: false,
			renderCell: (params: { value: string[] | undefined }) =>
				`${params.value?.toString()}`
			,
			width: 120,
			editable: true
		},
		{
			field: 'DatasetDOI',
			headerName: 'datasetDOI',
			sortable: false,
			width: 120,
			editable: true
		},
		{
			field: 'Path',
			headerName: 'Path',
			sortable: false,
			width: 320,
			editable: false
		},

	];

	return (
		<>


			<Box sx={{ mt: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant='h6'>
						BIDS Databases{' '}
						{!bidsDatabases &&
							<CircularProgress size={16} />}
					</Typography>
				</Box>
				<Box sx={{ height: 500, width: '100%' }}>
					<DataGrid
						onSelectionModelChange={(newSelectionModel) => {
							setSelectionModel(newSelectionModel);
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
						editMode="row"
						components={{
							Toolbar: () =>
								<GridToolbarContainer>
									<Button
										color="primary"
										size='small'
										sx={{ mt: 0.5, mb: 0.5 }}
										startIcon={<Add />}
										onClick={handleCreateDatabase}
										variant={'outlined'}
									>
										Create BIDS Database
									</Button>
								</GridToolbarContainer>,
						}}
						componentsProps={{
							toolbar: { apiRef },
						}}
					// isCellEditable={((params: GridCellParams<any, any, any>) => true)}
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

Databases.displayName = 'Databases'

export default Databases
