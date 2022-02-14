import { Alert, Box, Button, CircularProgress, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowParams, GridSelectionModel } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BIDSDatabase, BIDSDatabaseResponse, Participant } from '../../../api/types';

interface Props {
	bidsDatabase?: BIDSDatabase;
	handleSelectParticipant: (selected: Participant) => void;
	selectedParticipant?: Participant
}

const Data = ({ bidsDatabase, handleSelectParticipant, selectedParticipant }: Props): JSX.Element => {
	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
	const navigate = useNavigate()

	useEffect(() => {
		if (selectedParticipant) {
			const s = [selectedParticipant.participant_id] as GridSelectionModel
			setSelectionModel(s)
		}
	}, [selectedParticipant])

	useEffect(() => {
		const selected = bidsDatabase?.participants?.find(b => b.id === selectionModel[0])
		if (selected)
			handleSelectParticipant(selected)

	}, [selectionModel, setSelectionModel])

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: 'id',
			width: 320,
		}, {
			field: 'age',
			headerName: 'age',
			width: 320,
		},
		{
			field: 'sex',
			headerName: 'sex',
			width: 320,
		},
		// {
		// 	field: 'Browse',
		// 	headerName: 'Browse',
		// 	sortable: false,
		// 	renderCell: (params: { value: string }) => (
		// 		<Link
		// 			target="_blank"
		// 			href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${params.value}`}
		// 		>
		// 			Browse
		// 		</Link>
		// 	),
		// 	width: 150
		// },

	];
	const rows = bidsDatabase?.participants?.map(p => ({
		id: p.participant_id,
		age: p.age,
		sex: p.sex
	})) || []

	return (
		<>
			<Box sx={{ mt: 2 }}>
				<Typography variant='h6'>
					BIDS Databases Participants
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
				{/* <Button
					sx={{ mt: 2, p: 1, mr: 1 }}
					onClick={handleNewSubject}
					variant="outlined">New Participant </Button> */}
			</Box >
		</>
	)
}

export default Data
