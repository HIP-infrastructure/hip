import { Alert, Box, CircularProgress, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store/appProvider'
import TitleBar from './UI/titleBar'

// interface ExtendedBIDSDatabase extends BIDSDatabase {
// 	[key: string]: string[] | string | number
// }

const columns: GridColDef[] = [
	{
		field: 'Name',
		headerName: 'Name',
		width: 320,
	},
	// {
	// 	field: 'Participants',
	// 	headerName: 'Participants',
	// 	type: 'number',
	// 	sortable: false,
	// 	width: 160,
	// },
	// {
	// 	field: 'Browse',
	// 	headerName: 'Browse',
	// 	sortable: false,
	// 	renderCell: (params: { value: string }) => (
	// 		<Link
	// 			target='_blank'
	// 			href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${params.value}`}
	// 		>
	// 			Browse
	// 		</Link>
	// 	),
	// 	width: 150,
	// },
	{
		field: 'Authors',
		headerName: 'Authors',
		sortable: false,
		renderCell: (params: { value: string[] | undefined }) =>
			`${params.value?.toString()}`,
		width: 320,
	},
	{
		field: 'BIDSVersion',
		headerName: 'BIDS Version',
		width: 150,
	},
	// {
	// 	field: 'Path',
	// 	headerName: 'Path',
	// 	sortable: false,
	// 	width: 320,
	// },
]

// https://hip.local/apps/files/?dir=

const Data = (): JSX.Element => {
	const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0)
	const {
		containers: [containers],
		user: [user, setUser],
		bIDSDatabases: [bidsDatabases, setBidsDatabases]
	} = useAppStore()
	
	return (
		<>
			<TitleBar title='Data' />

			{bidsDatabases?.error && bidsDatabases?.error && (
					<Alert severity='error'>{bidsDatabases?.error.message}</Alert>
				)}

			<Box sx={{ mt: 2 }}>
				<Typography variant='h6'>Private Data</Typography>
				<Typography variant='subtitle2'>
					Browse your data in{' '}
					<Link underline='always' href='/apps/files/'>
						NextCloud Browser
					</Link>
				</Typography>
				{/* <Box sx={{
                    width: '960',
                    border: 1,
                    borderColor: 'grey.300',
                    overflowY: 'auto',
                    p: 1
                }}>
                    <FileBrowser
                        nodesPanes={filesPanes}
                        handleSelectedPath={handleSelectedPath}
                    >

                    </FileBrowser>
                </Box> */}
			</Box>

			<Box sx={{ mt: 2 }}>
				<Typography variant='h6'>
					BIDS Databases{' '}
					{!bidsDatabases && (
						<CircularProgress size={16} />
					)}
				</Typography>

				<Box sx={{ height: 500, width: '100%' }}>
					<DataGrid
						getRowId={(params) => params.Name}
						rows={bidsDatabases?.data || []}
						columns={columns}
						pageSize={100}
						rowsPerPageOptions={[100]}
						disableSelectionOnClick
					/>
				</Box>
			</Box>
		</>
	)
}

export default Data
