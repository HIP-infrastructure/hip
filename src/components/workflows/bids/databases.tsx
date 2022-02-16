import { Alert, Box, Button, CircularProgress, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridCellParams, GridRowsProp, GridRowParams, GridSelectionModel } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BIDSDatabase, BIDSDatabaseResponse } from '../../../api/types';

const columns: GridColDef[] = [
	{
		field: 'Name',
		headerName: 'Name',
		width: 320,
	},
	{
		field: 'Participants',
		headerName: 'Participants',
		type: 'number',
		sortable: false,
		width: 160,
	},
	{
		field: 'Browse',
		headerName: 'Browse',
		sortable: false,
		renderCell: (params: { value: string }) => (
			<Link
				target="_blank"
				href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${params.value}`}
			>
				Browse
			</Link>
		),
		width: 150
	},
	{
		field: 'Authors',
		headerName: 'Authors',
		sortable: false,
		renderCell: (params: { value: string[] | undefined }) =>
			`${params.value?.toString()}`
		,
		width: 320
	},
	{
		field: 'BIDSVersion',
		headerName: 'BIDS Version',
		width: 150,
	},
	{
		field: 'Path',
		headerName: 'Path',
		sortable: false,
		width: 320
	},

];

interface Props {
	bidsDatabases?: BIDSDatabaseResponse;
	handleSelectDatabase: (selected: BIDSDatabase) => void;
	selectedDatabase?: BIDSDatabase
}

const Databases = ({ bidsDatabases, handleSelectDatabase, selectedDatabase }: Props): JSX.Element => {
	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
	const [rows, setRows] = useState<any>([])
	const navigate = useNavigate()

	useEffect(() => {
		if (selectedDatabase) {
			const s = [selectedDatabase.id] as GridSelectionModel
			setSelectionModel(s)
		}
	}, [selectedDatabase])

	useEffect(() => {
		const selected = bidsDatabases?.data?.find(b => b.id === selectionModel[0])
		if (selected)
			handleSelectDatabase(selected)

	}, [selectionModel, setSelectionModel])

	useEffect(() => {
		setRows(bidsDatabases?.data?.map(db => ({
			Browse: db.path,
			id: db.path,
			Name: db.Name,
			Authors: db.Authors,
			Participants: db.participants && db.participants.length,
			Licence: db.Licence,
			BIDSVersion: db.BIDSVersion,
			Path: db.path,
		})) || [])
	}, [bidsDatabases])


	const handleCreateDatabase = () => {
		const newBidsDatabase = ({
			id: '',
			path: '',
			Name: '',
			BIDSVersion: '',
			Licence: '',
			Authors: [],
			Acknowledgements: '',
			HowToAcknowledge: '',
			Funding: [],
			ReferencesAndLinks: [],
			DatasetDOI: '',
			participants: [],
			Browse: ''
		})
		setRows(r => [newBidsDatabase, ...r])
	}

	return (
		<>

			{bidsDatabases?.error &&
				<Alert sx={{ mt: 1, mb: 1 }} severity="error">{bidsDatabases.error.message}</Alert>
			}

			<Box sx={{ mt: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant='h6'>
						BIDS Databases{' '}
						{!bidsDatabases?.data &&
							!bidsDatabases?.error &&
							<CircularProgress size={16} />}
					</Typography>
					<Button
						disabled={!bidsDatabases?.data}
						sx={{ mt: 2, mb: 2 }}
						variant='outlined'
						onClick={handleCreateDatabase}
					>
						Create BIDS Database
					</Button>
				</Box>
				<Box sx={{ height: 400, width: '100%' }}>
					<DataGrid
						onSelectionModelChange={(newSelectionModel) => {
							setSelectionModel(newSelectionModel);
						}}
						selectionModel={selectionModel}
						rows={rows}
						columns={columns}
						pageSize={100}
						rowsPerPageOptions={[100]}
						editMode="row"
						isCellEditable={((params: GridCellParams<any, any, any>) => true)} />
				</Box>
			</Box >
		</>
	)
}

Databases.displayName = 'Databases'

export default Databases
