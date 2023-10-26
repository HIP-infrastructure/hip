import * as React from 'react'
import Datasets from '../UI/BIDS/Datasets'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material'
import { BIDSDataset } from '../../api/types'
import { publishDatasetToPublicSpace } from '../../api/bids'

const PublicDatasets = () => {
	const [open, setOpen] = React.useState(false)
	const [datasetPath, setDatasetPath] = React.useState('')	

	const handleClickedDataset = (dataset: BIDSDataset) => {
		setOpen(true)
		setDatasetPath(dataset?.Path || '')
	}

	const handleCheckedClicked = () => {
		setOpen(false)
		publishDatasetToPublicSpace(datasetPath)

	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<>
			<Datasets handleClickedDataset={handleClickedDataset}  buttonTitle={'Clone this dataset'}/>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Copy Dataset</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This dataset is going to be copied in your personal space.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleCheckedClicked}>Clone</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default PublicDatasets
