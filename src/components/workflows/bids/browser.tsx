import React, { useEffect, useState } from 'react'

import {
	Pagination,
	InputLabel,
	NativeSelect,
	FormControl,
	Box,
	IconButton,
	TextField,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useAppStore } from '../../../Store'
import TitleBar from '../../UI/titleBar'
import { queryBidsDatasets } from '../../../api/bids'
import DatasetsSearchResults from './datasetsSearchResults'
import { BIDSDataset } from '../../../api/types'

const boxStyle = {
	border: 1,
	borderColor: 'grey.400',
	p: 2,
	mr: 1,
	display: 'flex',
	flex: '1 0 auto',
	flexFlow: 'row',
}

interface FormElements extends HTMLFormControlsCollection {
	searchTermText: HTMLInputElement
}
interface SearchTermFormElement extends HTMLFormElement {
	readonly elements: FormElements
}

const BidsBrowser = () => {
	const {
		user: [user],
		BIDSDatasets: [bidsDatasets],
	} = useAppStore()

	const [searchTerm, setSearchTerm] = useState('')
	const [numberOfPages, setNumberOfPages] = useState<number>(1)
	const [page, setPage] = useState<number>(1)
	const [numberOfResultsPerPage, setNumberOfResultsPerPage] =
		useState<number>(20)
	const [totalNumberOfDatasets, setTotalNumberOfDatasets] =
		useState<number>(0)
	const [bidsDatasetsResults, setBidsDatasetsResults] = useState<
		BIDSDataset[] | undefined
	>([])

	useEffect(() => {
		if (!bidsDatasets?.data) return
		setBidsDatasetsResults(bidsDatasets.data)
		setTotalNumberOfDatasets(bidsDatasets.data.length)
	}, [bidsDatasets])

	useEffect(() => {
		setBidsDatasetsResults(undefined)
		if (searchTerm) {
			queryBidsDatasets(user?.uid || '', searchTerm, page, numberOfResultsPerPage)
				.then(data => {
					if (data) {
						setBidsDatasetsResults(data)
					}
				})
				.catch(error => {
					// setBidsDatasetsResults({ error })
				})
		} else {
			queryBidsDatasets(user?.uid || '', '*', page, numberOfResultsPerPage)
				.then(data => {
					if (data) {
						setBidsDatasetsResults(data)
					}
				})
				.catch(error => {
					// setBidsDatasetsResults({ error })
				})
		}
	}, [searchTerm, page, numberOfResultsPerPage, user?.uid])

	useEffect(() => {
		if (bidsDatasetsResults) {
			if (totalNumberOfDatasets > 0) {
				setNumberOfPages(
					Math.ceil(totalNumberOfDatasets / numberOfResultsPerPage)
				)
			} else {
				setNumberOfPages(1)
			}
		}
	}, [totalNumberOfDatasets, numberOfResultsPerPage])

	function handleDatasetsSearch(event: React.FormEvent<SearchTermFormElement>) {
		event.preventDefault()
		setSearchTerm(event.currentTarget.elements.searchTermText.value)
	}

	function handleNumberOfResultsSearch(
		event: React.ChangeEvent<HTMLSelectElement>
	) {
		event.preventDefault()
		setNumberOfResultsPerPage(parseInt(event.target.value))
	}

	function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
		event.preventDefault()
		setPage(value)
	}

	return (
		<>
			<TitleBar
				title='BIDS Browser'
				description={'Browse BIDS datasets on the HIP'}
			/>
			<Box
				display='flex'
				// justifyContent="center"
				// alignItems="center"
			>
				<form onSubmit={handleDatasetsSearch}>
					<div>
						<FormControl>
							<TextField
								name='search'
								label='Search'
								id='searchTermText'
								variant='outlined'
							/>
						</FormControl>
						<FormControl>
							<IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
								<SearchIcon />
							</IconButton>
						</FormControl>
					</div>
					<div>
						<FormControl sx={{ m: 1, minWidth: 80, maxWidth: 80 }}>
							<InputLabel variant='standard' htmlFor='uncontrolled-native'>
								#Results / page
							</InputLabel>
							<NativeSelect
								defaultValue={numberOfResultsPerPage}
								inputProps={{
									name: 'numberOfResultsPerPage',
									id: 'uncontrolled-native',
								}}
								onChange={handleNumberOfResultsSearch}
							>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={20}>20</option>
							</NativeSelect>
						</FormControl>
					</div>
				</form>
			</Box>

			<Box sx={{ width: '100%', mt: 3 }}>
				<Box sx={{ mt: 2 }}>
					<Box sx={boxStyle}>
						<Box
							sx={{
								display: 'flex',
								gap: '1em',
								width: 'inherit',
								mr: 2,
								flexDirection: 'column',
							}}
						>
							<Box display='flex' justifyContent='center' alignItems='center'>
								<Pagination
									count={numberOfPages}
									page={page}
									onChange={handlePageChange}
								/>
							</Box>

							<DatasetsSearchResults page={page} datasets={bidsDatasetsResults}/>

							<Box display='flex' justifyContent='center' alignItems='center'>
								<Pagination
									count={numberOfPages}
									page={page}
									onChange={handlePageChange}
								/>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	)
}

BidsBrowser.displayName = 'BidsBrowser'

export default BidsBrowser
