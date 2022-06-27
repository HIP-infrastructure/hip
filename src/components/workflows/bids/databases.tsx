import { Add } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme,
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import { getBidsDatabases } from '../../../api/bids'
import { BIDSDatabase } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import CreateDatabase from './forms/CreateDatabase'

const Databases = (): JSX.Element => {
	const { breakpoints } = useTheme()

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
			setSelectedFiles(undefined)
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

	return (
		<>
			<CreateDatabase
				open={isCreateDialogOpen}
				handleClose={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
				setDatabaseCreated={setDatabaseCreated}
			/>
			<Box
				sx={{
					display: 'flex',
					gap: '1em',
					width: 'inherit',
					mr: 2,
				}}
			>
				<Paper
					sx={{
						width: 'calc(100vw - 640px - 240px)',
					}}
				>
					<TableContainer sx={{ maxHeight: 440 }}>
						<Table stickyHeader size='small' aria-label='BIDS Databases tables'>
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell sx={{ width: 320 }}>Name</TableCell>
									<TableCell>Participants</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map(row => (
									<TableRow
										hover
										role='checkbox'
										tabIndex={-1}
										key={row.id}
										onClick={() => setSelectedBidsDatabase(row)}
									>
										<TableCell padding='checkbox'>
											<Checkbox
												color='primary'
												checked={row.id === selectedBidsDatabase?.id}
												onChange={() => {
													setSelectedBidsDatabase(row)
												}}
												inputProps={{
													'aria-label': 'select database',
												}}
											/>
										</TableCell>
										<TableCell>{row.Name}</TableCell>
										<TableCell>{row.participants?.length}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						{!bidsDatabases && <CircularProgress sx={{ m: 2 }} size={16} />}

						{bidsDatabases?.error && (
							<Alert sx={{ m: 2 }} severity='error'>
								{bidsDatabases?.error.message}
							</Alert>
						)}
					</Box>
					<Button
						color='primary'
						size='small'
						sx={{ m: 2 }}
						startIcon={<Add />}
						onClick={() => setIsCreateDialogOpen(true)}
						variant={'contained'}
					>
						Create BIDS Database
					</Button>
				</Paper>
				<Card sx={{ width: 480 }}>
					{selectedBidsDatabase && (
						<>
							<CardContent>
								<Typography gutterBottom variant='h6' component='div'>
									{selectedBidsDatabase?.Name}
								</Typography>
								<Typography sx={{ mb: 1.5 }} color='text.secondary'>
									{selectedBidsDatabase?.Authors?.toString()}
								</Typography>
								<Typography variant='body1'>
									<strong>Number of participants</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{selectedBidsDatabase?.participants?.length}
								</Typography>
								<Typography variant='body1'>
									<strong>Version</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{selectedBidsDatabase?.BIDSVersion}
								</Typography>
								<Typography variant='body1'>
									<strong>License</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{(selectedBidsDatabase?.License &&
										selectedBidsDatabase.License) ||
										'n/a'}
								</Typography>
								<Typography variant='body1'>
									<strong>Acknowledgements</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{(selectedBidsDatabase?.Acknowledgements &&
										selectedBidsDatabase.Acknowledgements) ||
										'n/a'}
								</Typography>
								<Typography variant='body1'>
									<strong>How To Acknowledge</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{(selectedBidsDatabase?.HowToAcknowledge &&
										selectedBidsDatabase.HowToAcknowledge) ||
										'n/a'}
								</Typography>
								<Typography variant='body1'>
									<strong>Funding</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{(selectedBidsDatabase?.Funding &&
										selectedBidsDatabase.Funding.toString()) ||
										'n/a'}
								</Typography>
								<Typography variant='body1'>
									<strong>References and Links</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{(selectedBidsDatabase?.ReferencesAndLinks &&
										selectedBidsDatabase.ReferencesAndLinks.toString()) ||
										'n/a'}
								</Typography>
								<Typography variant='body1'>
									<strong>DOI</strong>
								</Typography>
								<Typography gutterBottom variant='body1'>
									{(selectedBidsDatabase?.DatasetDOI &&
										selectedBidsDatabase.DatasetDOI) ||
										'n/a'}
								</Typography>
								<Typography variant='body1'>
									<strong>Files</strong>
								</Typography>
								<Box>
									<Link
										target='_blank'
										href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${selectedBidsDatabase?.path}`}
									>
										{selectedBidsDatabase?.path}
									</Link>
								</Box>
							</CardContent>
							<CardActions></CardActions>
						</>
					)}
				</Card>
			</Box>
		</>
	)
}

Databases.displayName = 'Databases'

export default Databases
