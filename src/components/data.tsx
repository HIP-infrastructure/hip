import { Alert, Box, CircularProgress, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { getBids } from '../api/bids'
import { BIDSDatabase, BIDSDatabaseResponse } from '../api/types'
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
	const [bidsDatabase, setBidsDatabase] = useState<BIDSDatabase[]>()
	const [error, setError] = useState<Error | null>()
	const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0)


	useEffect(() => {
		getBids().then((r: BIDSDatabaseResponse) => {

			if (r.error) {
				setError(error)
				return
			}

			setBidsDatabase(r.data)
		})
		// files('/').then(f => setFilesPanes([f]))
	}, [])

	// const files = async (path: string) => {
	// 	return await getFiles(path)
	// }

	// const handleSelectedPath = async (pathes: string[]) => {
	// 	const path = pathes.join('')
	// 	const result = await files(path)
	// 	setFilesPanes(prev => {
	// 		if (!prev) return [result]

	// 		prev[pathes.length - 1] = result
	// 		prev.splice(pathes.length)

	// 		return prev
	// 	})
	// 	forceUpdate()
	// }



	return (
		<>
			<TitleBar title='Data' />

			{error && (
				<Alert severity='error'>{error.message}</Alert>
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
					{!bidsDatabase && !error && (
						<CircularProgress size={16} />
					)}
				</Typography>

				<Box sx={{ height: 500, width: '100%' }}>
					<DataGrid
						getRowId={(params) => params.Name}
						rows={bidsDatabase || []}
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
