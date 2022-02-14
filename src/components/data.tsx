import { Alert, Box, CircularProgress, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBids } from '../api/gatewayClientAPI'
import { BIDSDatabaseResponse } from '../api/types';
import TitleBar from './UI/titleBar';


// interface ExtendedBIDSDatabase extends BIDSDatabase {
// 	[key: string]: string[] | string | number
// }

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

// https://hip.local/apps/files/?dir=


const Data = (): JSX.Element => {
	const [bidsDatabase, setBidsDatabase] = useState<BIDSDatabaseResponse>()
	const navigate = useNavigate()

	useEffect(() => {
		getBids().then(r => {
			setBidsDatabase(r)
		})
	}, [])

	const rows = bidsDatabase?.data?.map(db => ({
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
			<TitleBar title='Data' />

			{bidsDatabase?.error &&
				<Alert severity="error">{bidsDatabase.error.message}</Alert>
			}

			<Box sx={{ mt: 2 }}>
				<Typography variant="h6">
					Private Data
				</Typography>
				<Typography variant="subtitle2">
					Browse your data in <Link underline="always" href="/apps/files/" >
						NextCloud Browser
					</Link>
				</Typography>
			</Box>

			<Box sx={{ mt: 2 }}>
				<Typography variant='h6'>
					BIDS Databases{' '}
					{!bidsDatabase?.data &&
						!bidsDatabase?.error &&
						<CircularProgress size={16} />}
				</Typography>

				<Box sx={{ height: 500, width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={100}
						rowsPerPageOptions={[100]}
						disableSelectionOnClick
					/>
				</Box>
			</Box >
		</>
	)
}

export default Data
