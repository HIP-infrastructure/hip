import React, { useEffect, useState } from 'react'
import { Add } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
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
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { queryBidsDatasets } from '../../../api/bids'
import { BIDSDataset } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import CreateDataset from './forms/CreateDataset'

const Datasets = (): JSX.Element => {
	const [rows, setRows] = useState<BIDSDataset[]>([])
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasetCreated, setDatasetCreated] = useState(false)
	const {
		user: [user],
		BIDSDatasets: [bidsDatasets, setBidsDatasets],
		selectedBidsDataset: [selectedBidsDataset, setSelectedBidsDataset],
		selectedParticipants: [_selectedParticipants, setSelectedParticipants],
		selectedFiles: [_selectedFiles, setSelectedFiles],
	} = useAppStore()

	useEffect(() => {
		if (bidsDatasets?.data) setRows(bidsDatasets?.data)
	}, [bidsDatasets])

	useEffect(() => {
		if (selectedBidsDataset) {
			setSelectedFiles(undefined)
			setSelectedParticipants([])
		}
	}, [selectedBidsDataset, setSelectedFiles, setSelectedParticipants])

	useEffect(() => {
		if (datasetCreated) {
			queryBidsDatasets(user?.uid || '')
				.then(data => {
					if (data) {
						setBidsDatasets({ data })
					}
				})
				.catch(error => {
					setBidsDatasets({ error })
				})
			setDatasetCreated(false)
		}
	}, [datasetCreated, user?.uid])

	return (
		<>
			<CreateDataset
				open={isCreateDialogOpen}
				handleClose={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
				setDatasetCreated={setDatasetCreated}
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
						flex: 1,
					}}
				>
					<TableContainer sx={{ maxHeight: 440 }}>
						<Table stickyHeader size='small' aria-label='BIDS Datasets tables'>
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
										onClick={() => setSelectedBidsDataset(row)}
									>
										<TableCell padding='checkbox'>
											<Checkbox
												color='primary'
												checked={row.id === selectedBidsDataset?.id}
												onChange={() => {
													setSelectedBidsDataset(row)
												}}
												inputProps={{
													'aria-label': 'select dataset',
												}}
											/>
										</TableCell>
										<TableCell>{row.Name}</TableCell>
										<TableCell>{row.ParticipantsCount}</TableCell>
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
						{!bidsDatasets && <CircularProgress sx={{ m: 2 }} size={16} />}
						{bidsDatasets?.error && (
							<Alert sx={{ m: 2 }} severity='error'>
								{bidsDatasets?.error}
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
						Create BIDS Dataset
					</Button>
				</Paper>
				<Box sx={{ flex: '1 0' }}>
					<Typography
						sx={{ mt: 1, mb: 2 }}
						variant='body2'
						color='text.secondary'
					>
						Dataset description
					</Typography>
					<Paper
						sx={{
							flex: 1,
						}}
					>
						{selectedBidsDataset && (
							<>
								<CardContent>
									<Typography gutterBottom variant='h6' component='div'>
										<strong>Dataset name:</strong> {selectedBidsDataset?.Name}
									</Typography>
									<Typography sx={{ mb: 1.5 }} color='text.secondary'>
										<strong>Authors:</strong>{' '}
										{selectedBidsDataset?.Authors?.toString()}
									</Typography>
									<Typography variant='body1'>
										<strong>Number of participants</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{selectedBidsDataset?.ParticipantsCount}
									</Typography>
									<Typography variant='body1'>
										<strong>Version</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{selectedBidsDataset?.BIDSVersion}
									</Typography>
									<Typography variant='body1'>
										<strong>License</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{(selectedBidsDataset?.License &&
											selectedBidsDataset.License) ||
											'n/a'}
									</Typography>
									<Typography variant='body1'>
										<strong>Acknowledgements</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{(selectedBidsDataset?.Acknowledgements &&
											selectedBidsDataset.Acknowledgements) ||
											'n/a'}
									</Typography>
									<Typography variant='body1'>
										<strong>How To Acknowledge</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{(selectedBidsDataset?.HowToAcknowledge &&
											selectedBidsDataset.HowToAcknowledge) ||
											'n/a'}
									</Typography>
									<Typography variant='body1'>
										<strong>Funding</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{(selectedBidsDataset?.Funding &&
											selectedBidsDataset.Funding.toString()) ||
											'n/a'}
									</Typography>
									<Typography variant='body1'>
										<strong>References and Links</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{(selectedBidsDataset?.ReferencesAndLinks &&
											selectedBidsDataset.ReferencesAndLinks.toString()) ||
											'n/a'}
									</Typography>
									<Typography variant='body1'>
										<strong>DOI</strong>
									</Typography>
									<Typography gutterBottom variant='body1'>
										{(selectedBidsDataset?.DatasetDOI &&
											selectedBidsDataset.DatasetDOI) ||
											'n/a'}
									</Typography>
									<Typography variant='body1'>
										<strong>Files</strong>
									</Typography>
									<Box>
										<Link
											target='_blank'
											href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${selectedBidsDataset?.Path}`}
										>
											{selectedBidsDataset?.Path}
										</Link>
									</Box>
								</CardContent>
								<CardActions></CardActions>
							</>
						)}
					</Paper>
				</Box>
			</Box>
		</>
	)
}

Datasets.displayName = 'Datasets'

export default Datasets
