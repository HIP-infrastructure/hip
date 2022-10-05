import React, { useEffect, useState } from 'react'

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

import { getBidsDatasets, importSubject, getMatchingBidsDatasets } from '../../../api/bids'
import { CreateSubjectDto, BIDSDataset } from '../../../api/types'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'
import TitleBar from '../../UI/titleBar'

import DatasetsResults from './datasetsSearchResults'
import Summary from './summary'

const boxStyle = {
	border: 1,
	borderColor: 'grey.400',
	p: 2,
	mr: 1,
	display: 'flex',
	flex: '1 0 auto',
	flexFlow: 'column',
}

const BidsBrowser = () => {
	
	const {
		user: [user],
		BIDSDatasetsResults: [bidsDatasetsResults, setBidsDatasetsResults],
	} = useAppStore()

	const [searchTerm, setSearchTerm] = React.useState("")

	interface FormElements extends HTMLFormControlsCollection {
		searchTermText: HTMLInputElement
	}
	interface SearchTermFormElement extends HTMLFormElement {
		readonly elements: FormElements
	}

	function handleDatasetsSearch(event: React.FormEvent<SearchTermFormElement>) {
		event.preventDefault()
		setSearchTerm(event.currentTarget.elements.searchTermText.value)
		console.log('Handle search query:')
		console.log(searchTerm)
	}

	useEffect(() => {
		console.log('Update list of datasets')
		if (searchTerm) {
			setBidsDatasetsResults(undefined)
			getMatchingBidsDatasets(user?.uid, searchTerm)
				.then(data => {
					if (data) {
						setBidsDatasetsResults({ data })
					}
				})
				.catch(error => {
					setBidsDatasetsResults({ error })
				})
		}
		else {
			setBidsDatasetsResults(undefined)
			getBidsDatasets(user?.uid)
				.then(data => {
					if (data) {
						setBidsDatasetsResults({ data })
					}
				})
				.catch(error => {
					setBidsDatasetsResults({ error })
				})
		}
	}, [searchTerm])

	console.log(`Search query : ${searchTerm}`)

	return (
		<>
			<TitleBar
				title='BIDS Browser'
				description={'Browse BIDS datasets on the HIP'}
			/>
			<form onSubmit={handleDatasetsSearch}>
				<div>
					<input
						id="searchTermText"
						type="text"
						placeholder="Search"
					/>
					<input type="submit" value="Search" />
				</div>
			</form>

			<DatasetsResults />

		</>
	)
}

BidsBrowser.displayName = 'BidsBrowser'

export default BidsBrowser
