import { Add } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	InputLabel,
	MenuItem,
	Pagination,
	Paper,
	Select,
	SelectChangeEvent,
	Slider,
	TextField,
	Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { queryBidsDatasets, refreshBidsDatasetsIndex } from '../../api/bids'
import { BIDSDataset } from '../../api/types'
import useDebounce from '../../hooks/useDebounce'
import { useAppStore } from '../../Store'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import DatasetCard from './DatasetCard'

const DATATYPES = [
	'anat',
	'dwi',
	'func',
	'ieeg',
	'eeg',
	//'fmap',
	//'pet',
	//'ct',
]

const participantsCountRangeMarks = [
	{ value: 0, label: '0' },
	{ value: 200, label: '200+' },
]

const ageRangeMarks = [
	{ value: 0, label: '0' },
	{ value: 100, label: '100' },
]

const Datasets = () => {
	const {
		user: [user],
	} = useAppStore()

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasetCreated, setDatasetCreated] = useState(false)
	const [term, setTerm] = useState('*')
	const [debouncedAgeRange, ageRange, setAgeRange] = useDebounce<number[]>([
		0, 100,
	])
	const [
		debouncedParticipantsCount,
		participantsCountRange,
		setParticipantsCountRange,
	] = useDebounce<number[]>([0, 200])
	const [numberOfResultsPerPage, setNumberOfResultsPerPage] =
		useState<number>(20)
	const [totalNumberOfDatasets] = useState<number>(0)
	const [page, setPage] = useState<number>(1)
	const [datasets, setDatasets] = useState<
		{ data?: BIDSDataset[]; error?: string } | undefined
	>()
	const [selectedDatatypes, setSelectedDatatypes] =
		useState<string[]>([])

	const [loading, setLoading] = useState(false)

	const queryDatasets = useCallback(async () => {
		setLoading(true)
		queryBidsDatasets(
			user?.uid,
			term,
			page,
			numberOfResultsPerPage,
			debouncedAgeRange,
			debouncedParticipantsCount,
			selectedDatatypes
		)
			.then(data => {
				setDatasets({ data })
				setLoading(false)
			})
			.catch(error => {
				setDatasets({ error })
				setLoading(false)
			})
	}, [
		user,
		term,
		debouncedAgeRange,
		debouncedParticipantsCount,
		selectedDatatypes,
		page,
		numberOfResultsPerPage,
	])

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

	const handleDatatypeChange = (dt: string) => {
		setSelectedDatatypes(s =>
			s.includes(dt) ? s.filter(d => d !== dt) : [...s, dt]
		)
	}

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

				<Box display='flex' flexDirection='row'>
					<Paper elevation={1} sx={{ p: 2 }}>
						<Typography variant='subtitle1'>Filters</Typography>
						<FormControl sx={{ m: 1, minWidth: 250, maxWidth: 250 }}>
							<FormLabel component='legend' id='datatype-label'>
								Datatypes
							</FormLabel>
							<FormGroup>
								{DATATYPES.map(dt => (
									<FormControlLabel
										key={dt}
										control={
											<Checkbox
												onChange={() => handleDatatypeChange(dt)}
												checked={selectedDatatypes.includes(dt)}
											/>
										}
										label={dt}
									/>
								))}
							</FormGroup>
						</FormControl>
						<Box mx={2}>
							<Typography id='input-slider' gutterBottom>
								Age of participants
							</Typography>
							<Slider
								getAriaLabel={() => ''}
								value={ageRange}
								onChange={(event, value) => setAgeRange(value as number[])}
								valueLabelDisplay='auto'
								marks={ageRangeMarks}
							/>
						</Box>
						<Box mx={2}>
							<Typography id='input-slider' gutterBottom>
								Number of participants
							</Typography>
							<Slider
								getAriaLabel={() => 'Number of participants'}
								value={participantsCountRange}
								onChange={(event, value) =>
									setParticipantsCountRange(value as number[])
								}
								valueLabelDisplay='auto'
								marks={participantsCountRangeMarks}
							/>
						</Box>
					</Paper>

					<Box sx={{ p: 2 }}>
						{datasets?.data?.length === 0 && (
							<Typography variant='body2'>No results</Typography>
						)}
						{!datasets ||
							(loading && (
								<CircularProgress
									size={32}
									color='secondary'
									sx={{ top: 10, left: 10 }}
								/>
							))}
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
						</Box>
					</Box>
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
