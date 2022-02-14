import { Alert, Box, CircularProgress, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowParams, GridSelectionModel } from '@mui/x-data-grid';
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

	const rows = bidsDatabases?.data?.map(db => ({
		id: db.path,
		Name: db.Name,
		Authors: db.Authors,
		Participants: db.participants && db.participants.length,
		Licence: db.Licence,
		BIDSVersion: db.BIDSVersion,
		Path: db.path,
		Browse: db.path
	})) || []

	return (
		<>

			{bidsDatabases?.error &&
				<Alert severity="error">{bidsDatabases.error.message}</Alert>
			}

			<Box sx={{ mt: 2 }}>
				<Typography variant='h6'>
					BIDS Databases{' '}
					{!bidsDatabases?.data &&
						!bidsDatabases?.error &&
						<CircularProgress size={16} />}
				</Typography>

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
					/>
				</Box>
			</Box >
		</>
	)
}

Databases.displayName = 'Databases'

export default Databases
