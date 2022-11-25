import { Add } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Pagination,
	Select,
	SelectChangeEvent,
	Slider,
	TextField,
	Theme,
	Typography,
	useTheme,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { refreshBidsDatasetsIndex, queryBidsDatasets } from '../../api/bids'
import { BIDSDataset } from '../../api/types'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import DatasetCard from './DatasetCard'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const DatatypeMenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const Datasets = () => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasetCreated, setDatasetCreated] = useState(false)
	const [term, setTerm] = useState('*')
	const [ageRange, setAgeRange] = useState<number[]>([0, 100])
	const [participantsCountRange, setParticipantsCountRange] = useState<number[]>([0, 200]);

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

	const participantsCountRangeMarks = [
		{
			value: 0,
			label: '0',
		},
		{
			value: 200,
			label: '200+',
		},
	]

	const ageRangeMarks = [
		{
			value: 0,
			label: '0',
		},
		{
			value: 100,
			label: '100',
		},
	]

	const datatypes = [
		'anat',
		'dwi',
		'func',
		'ieeg',
		'eeg',
		//'fmap',
		//'pet',
		//'ct',
	]
	const theme = useTheme();
	const [datatype, setDatatype] = React.useState<string[]>(datatypes);
  
	const handleDatatypeChange = (event: SelectChangeEvent<typeof datatype>) => {
		const {
			target: { value },
		} = event
		setDatatype(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		)
	}

	const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
		setAgeRange(newValue as number[])
	}

	const handleParticipantsCountRangeChange = (event: Event, newValue: number | number[]) => {
		setParticipantsCountRange(newValue as number[])
	}
  
	function getStyles(name: string, datatype: readonly string[], theme: Theme) {
		return {
			fontWeight:
			datatype.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
		}
	}

	const queryDatasets = useCallback(async () => {
		queryBidsDatasets(user?.uid, term, page, numberOfResultsPerPage, ageRange, participantsCountRange, datatype)
			.then(data => {
				setDatasets({ data })
			})
			.catch(error => {
				setDatasets({ error })
			})
	}, [queryBidsDatasets, user, term, ageRange, participantsCountRange, datatype, page, numberOfResultsPerPage])

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

				<Box display="flex" flexDirection="row">
					<Box sx={{ width: 250 }} mx={2}>
						<FormControl sx={{ m: 1, minWidth: 250, maxWidth: 250 }}>
							<InputLabel id="datatype-label">Datatypes</InputLabel>
							<Select
								labelId="datatype-label"
								id="datatype"
								multiple
								value={datatype}
								onChange={handleDatatypeChange}
								input={<OutlinedInput id="datatype" label="Datatypes" />}
								renderValue={(selected) => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
									</Box>
								)}
								MenuProps={DatatypeMenuProps}
								>
								{datatypes.map((dt) => (
									<MenuItem
									key={dt}
									value={dt}
									style={getStyles(dt, datatype, theme)}
									>
									{dt}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Box sx={{ width: 250 }} mx={2}>
							<Typography id="input-slider" gutterBottom>
								Age of participants
							</Typography>
							<Slider
								getAriaLabel={() => ''}
								value={ageRange}
								onChange={handleAgeRangeChange}
								valueLabelDisplay="auto"
								marks={ageRangeMarks}
							/>
						</Box>
						<Box sx={{ width: 250 }} mx={2}>
							<Typography id="input-slider" gutterBottom>
								Number of participants
							</Typography>
							<Slider
								getAriaLabel={() => 'Number of participants'}
								value={participantsCountRange}
								onChange={handleParticipantsCountRangeChange}
								valueLabelDisplay="auto"
								marks={participantsCountRangeMarks}
							/>
						</Box>
					</Box>
				
					<Box display='flex' alignItems='center' sx={{ mb: 2 }}>
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
				</Box>
			</Box>
		</>
	)
}

export default Datasets
