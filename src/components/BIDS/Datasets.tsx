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
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import { Add } from '@mui/icons-material'
import { indexBidsDatasets, queryBidsDatasets } from '../../api/bids'
import Dataset from './DatasetCard'
import { BIDSDataset } from '../../api/types'

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

	const queryDatasets = async () => {
		queryBidsDatasets(user?.uid, term, page, numberOfResultsPerPage)
			.then(data => {
				setDatasets({ data })
			})
			.catch(error => {
				setDatasets({ error })
			})
	}

	useEffect(() => {
		queryDatasets()
	}, [term, page, numberOfResultsPerPage])

	useEffect(() => {
		if (datasetCreated) {
			indexBidsDatasets(user?.uid).then(() => {
				queryDatasets()
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

				<Box display='flex' justifyContent='center' alignItems='center'>
					<TextField
						id='search-textfield'
						sx={{ width: '100%', mb: 2 }}
						onChange={(e: {
							target: { value: React.SetStateAction<string> }
						}) => setTerm(e.target.value === '' ? '*' : e.target.value)}
						label='Search'
						variant='outlined'
					/>
					<FormControl sx={{ m: 1, minWidth: 180, maxWidth: 180 }}>
						<InputLabel variant='outlined'>Results / page</InputLabel>
						<Select
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
					sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: '16px 16px' }}
				>
					{datasets?.data?.map(dataset => (
						<Dataset key={dataset.id} dataset={dataset} />
					))}
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
