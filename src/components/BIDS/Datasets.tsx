import { Add } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Pagination,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { refreshBidsDatasetsIndex, queryBidsDatasets } from '../../api/bids'
import { BIDSDataset } from '../../api/types'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import DatasetCard from './DatasetCard'

const Datasets = () => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasetCreated, setDatasetCreated] = useState(false)
	const [term, setTerm] = useState('*')
	const [numberOfResultsPerPage, setNumberOfResultsPerPage] =
		useState<number>(20)
	const [totalNumberOfDatasets, setTotalNumberOfDatasets] = useState<number>(0)
	const [page, setPage] = useState<number>(1)
	const [datasets, setDatasets] = useState<
		{ data?: BIDSDataset[]; error?: string } | undefined
	>()

	const {
		user: [user],
	} = useAppStore()

	const queryDatasets = useCallback(async () => {
		queryBidsDatasets(user?.uid, term, page, numberOfResultsPerPage)
			.then(data => {
				setDatasets({ data })
			})
			.catch(error => {
				setDatasets({ error })
			})
	}, [queryBidsDatasets, user, term, page, numberOfResultsPerPage])

	useEffect(() => {
		queryDatasets()
	}, [queryDatasets, term, page, numberOfResultsPerPage])

	useEffect(() => {
		if (datasetCreated) {
			refreshBidsDatasetsIndex(user?.uid).then(() => {
				queryDatasets()
			})

			setDatasetCreated(false)
		}
	}, [queryDatasets, datasetCreated, user?.uid])

	return (
		<>
			<CreateDataset
				open={isCreateDialogOpen}
				handleClose={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
				setDatasetCreated={setDatasetCreated}
			/>

			<TitleBar
				title='BIDS Datasets'
				button={
					<Box sx={{ display: 'flex' }}>
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
					</Box>
				}
			/>

			<Box sx={{ mt: 2 }}>
				{!datasets && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}

				{datasets?.error && <Alert severity='error'>{datasets?.error}</Alert>}

				<Box display='flex' alignItems='center' sx={{ mb: 2 }}>
					<TextField
						id='search-textfield'
						sx={{ width: '100%' }}
						onChange={(e: {
							target: { value: React.SetStateAction<string> }
						}) => setTerm(e.target.value === '' ? '*' : e.target.value)}
						label='Search'
						size={'small'}
						variant='outlined'
					/>
					<FormControl sx={{ m: 1, minWidth: 180, maxWidth: 180 }}>
						<InputLabel variant='outlined'>results / page</InputLabel>
						<Select
							size={'small'}
							defaultValue={numberOfResultsPerPage}
							onChange={(event: SelectChangeEvent<number>) =>
								setNumberOfResultsPerPage(
									parseInt(event.target.value as string)
								)
							}
						>
							<MenuItem value={5}>5</MenuItem>
							<MenuItem value={10}>10</MenuItem>
							<MenuItem value={20}>20</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box display='flex' justifyContent='center' alignItems='center'>
					<Pagination
						count={Math.ceil(
							totalNumberOfDatasets || 1 / numberOfResultsPerPage
						)}
						page={page}
						onChange={(_, value) => setPage(value)}
					/>
				</Box>

				<Box
					sx={{
						mt: 2,
						mb: 2,
						display: 'flex',
						flexWrap: 'wrap',
						gap: '16px 16px',
					}}
				>
					{datasets?.data?.map(dataset => (
						<DatasetCard key={dataset.id} dataset={dataset} />
					))}
					{!datasets?.data?.length && (
						<Typography variant='body2'>No results</Typography>
					)}
				</Box>

				<Box display='flex' justifyContent='center' alignItems='center'>
					<Pagination
						count={Math.ceil(
							totalNumberOfDatasets || 1 / numberOfResultsPerPage
						)}
						page={page}
						onChange={(_, value) => setPage(value)}
					/>
				</Box>
			</Box>
		</>
	)
}

export default Datasets
