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

const PublicDatasets = () => {
	const [open, setOpen] = React.useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<>
			<Datasets
				action={
					<Button
						size='small'
						onClick={async e => {
							e.preventDefault()
							handleClickOpen()
						}}
					>
						Clone
					</Button>
				}
			/>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Clone Dataset</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This dataset is going to be cloned in your personal space.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleClose}>Clone</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default PublicDatasets
