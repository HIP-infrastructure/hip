import { Add } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Link,
	Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getBidsDatabases } from '../../../api/bids'
import { BIDSDatabase } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import CreateDatabase from './forms/CreateDatabase'
import DataGrid from 'react-data-grid'
import Checkbox from '@mui/material/Checkbox'

const Databases = (): JSX.Element => {
	const [rows, setRows] = useState<BIDSDatabase[]>([])
	const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(
		() => new Set()
	)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [dataBaseCreated, setDatabaseCreated] = useState(false)
	const {
		user: [user],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
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
						onClick={() => setIsModalOpen(true)}
						variant={'contained'}
					>
						Create BIDS Database
					</Button>
				</Box>

				<DataGrid
					columns={columns}
					rows={rows}
					rowKeyGetter={rowKeyGetter}
					selectedRows={selectedRows}
					onSelectedRowsChange={props => {
						console.log('onSelectedRowsChange')
						console.log(props)
						setSelectedRows(props)
					}}
					onRowsChange={props => {
						console.log('onRowsChange')
						console.log(props)
						setRows(props)
					}}
				/>
			</Box>
			<CreateDatabase
				open={isModalOpen}
				handleClose={() => setIsModalOpen(!isModalOpen)}
				setDatabaseCreated={setDatabaseCreated}
			/>
		</>
	)
}

Databases.displayName = 'Databases'

export default Databases
