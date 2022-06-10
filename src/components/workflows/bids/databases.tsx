import React, { useEffect, useState } from 'react'
import DataGrid from 'react-data-grid'

import { Add } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Link,
	Typography,
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'

import { getBidsDatabases } from '../../../api/bids'
import { BIDSDatabase } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import CreateDatabase from './forms/CreateDatabase'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

const Databases = (): JSX.Element => {
	const { trackEvent } = useMatomo()

	const [rows, setRows] = useState<BIDSDatabase[]>([])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [dataBaseCreated, setDatabaseCreated] = useState(false)
	const {
		user: [user],
		bIDSDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		selectedParticipants: [_selectedParticipants, setSelectedParticipants],
		selectedFiles: [_selectedFiles, setSelectedFiles],
	} = useAppStore()

	useEffect(() => {
		if (bidsDatabases?.data) setRows(bidsDatabases?.data)
	}, [bidsDatabases])

	useEffect(() => {
		if (selectedBidsDatabase) {
			setSelectedFiles([])
			setSelectedParticipants([])
		}
	}, [selectedBidsDatabase])

	useEffect(() => {
		if (dataBaseCreated) {
			setBidsDatabases(undefined)
			getBidsDatabases(user?.uid)
				.then(data => {
					if (data) {
						setBidsDatabases({ data })
					}
				})
				.catch(error => {
					setBidsDatabases({ error })
				})
			setDatabaseCreated(false)
		}
	}, [dataBaseCreated])

	function rowKeyGetter(row: BIDSDatabase) {
		return row.id
	}

	const columns = [
		{
			key: 'select-row',
			name: '',
			minWidth: 50,
			maxWidth: 50,
			resizable: false,
			sortable: false,
			frozen: true,
			formatter: ({
				row,
				isCellSelected,
			}: {
				row: BIDSDatabase
				isCellSelected: boolean
			}) => {
				if (isCellSelected) {
					setSelectedBidsDatabase(row)
					trackEvent({ 
						category: 'bids', 
						action: 'select-database' 
					})
				}

				const isSelected = isCellSelected || selectedBidsDatabase?.id === row.id

				return <Checkbox checked={isSelected} />
			},
		},
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

	return (
		<>
			<Box sx={{ mt: 2 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography variant='h6'>
						BIDS Databases {!bidsDatabases && <CircularProgress size={16} />}
					</Typography>
					{bidsDatabases?.error && (
						<Alert severity='error'>{bidsDatabases?.error.message}</Alert>
					)}
					<Button
						color='primary'
						size='small'
						sx={{ mt: 0.5, mb: 2 }}
						startIcon={<Add />}
						onClick={() => setIsCreateDialogOpen(true)}
						variant={'contained'}
					>
						Create BIDS Database
					</Button>
				</Box>

				<DataGrid
					rowClass={row =>
						row.id === selectedBidsDatabase?.id ? 'selected-row' : ''
					}
					columns={columns}
					rows={rows}
					rowKeyGetter={rowKeyGetter}
				/>
			</Box>
			<CreateDatabase
				open={isCreateDialogOpen}
				handleClose={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
				setDatabaseCreated={setDatabaseCreated}
			/>
		</>
	)
}

Databases.displayName = 'Databases'

export default Databases
