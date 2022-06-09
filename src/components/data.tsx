import { Alert, Box, CircularProgress, Link, Typography } from '@mui/material'
import React from 'react'
import { useAppStore } from '../store/appProvider'
import TitleBar from './UI/titleBar'
import DataGrid from 'react-data-grid'
import { BIDSDatabase } from '../api/types'

const Data = (): JSX.Element => {
	const {
		bIDSDatabases: [bidsDatabases],
	} = useAppStore()

	const columns = [
		{
			key: 'Name',
			name: 'Name',
			resizable: true,
			frozen: true,
			width: 200,
		},
		{
			key: 'participants',
			name: 'Participants',
			formatter(props: any) {
				return <>{props.row.participants.length}</>
			},
		},
		{
			key: 'Authors',
			name: 'Authors',
			resizable: true,
		},
		{
			key: 'BIDSVersion',
			name: 'Version',
		},
		{
			key: 'path',
			name: 'Path',
			resizable: true,
			formatter: (props: any) => {
				return (
					<Link
						target='_blank'
						href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${props.row.path}`}
					>
						{props.row.path}
					</Link>
				)
			},
		},
		{
			key: 'Licence',
			name: 'Licence',
			resizable: true,
		},
		{
			key: 'Acknowledgements',
			name: 'Acknowledgements',
			resizable: true,
		},
		{
			key: 'HowToAcknowledge',
			name: 'How To Acknowledge',
			resizable: true,
		},
		{
			key: 'Funding',
			name: 'Funding',
			resizable: true,
		},
		{
			key: 'ReferencesAndLinks',
			name: 'References And Links',
			resizable: true,
		},
		{
			key: 'DatasetDOI',
			name: 'datasetDOI',
			resizable: true,
		},
	]

	function rowKeyGetter(row: BIDSDatabase) {
		return row.id
	}

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
			</Box>

			<Box sx={{ mt: 2 }}>
				<Typography variant='h6'>
					BIDS Databases {!bidsDatabases && <CircularProgress size={16} />}
				</Typography>

				{bidsDatabases?.data && (
					<DataGrid
						columns={columns}
						rows={bidsDatabases?.data}
						rowKeyGetter={rowKeyGetter}
					/>
				)}
			</Box>
		</>
	)
}

export default Data
