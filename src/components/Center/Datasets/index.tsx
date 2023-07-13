import * as React from 'react'
import Datasets from '../../UI/BIDS/Datasets'
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	Typography,
} from '@mui/material'

const DatasetsIndex = () => {
	const [open, setOpen] = React.useState(false)
	const [checked1, setChecked1] = React.useState(false)
	const [checked2, setChecked2] = React.useState(false)

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
						Make public
					</Button>
				}
			/>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Make Dataset Public</DialogTitle>
				<DialogContent>
					<DialogContentText>
						By making this dataset public, I agree to the following conditions:
						I am the owner of this dataset and have any necessary ethics
						permissions to share the data publicly. This dataset does not
						include any identifiable personal health information as defined by
						the Health Insurance Portability and Accountability Act of 1996
						(including names, zip codes, dates of birth, acquisition dates,
						etc). I agree to destroy any key linking the personal identity of
						research participants to the subject codes used in the dataset. I
						agree that this dataset will become publicly available under a
						Creative Commons CC0 license after a grace period of 36 months
						counted from the date of the first snapshot creation for this
						dataset. You will be able to apply for up to two 6 month extensions
						to increase the grace period in case the publication of a
						corresponding paper takes longer than expected. See FAQ for details.
						This dataset is not subject to GDPR protections. Generally, data
						should only be uploaded to a single data archive. In the rare cases
						where it is necessary to upload the data to two databases (such as
						the NIMH Data Archive), I agree to ensure that the datasets are
						harmonized across archives.
					</DialogContentText>

					<Typography variant='subtitle1'>
						Please affirm one of the following
					</Typography>

					<FormControlLabel
						required
						control={
							<Checkbox
								checked={checked1}
								onChange={() => setChecked1(!checked1)}
							/>
						}
						label='All structural scans have been defaced, obscuring any tissue on or
						near the face that could potentially be used to reconstruct the
						facial structure.'
					/>

					<FormControlLabel
						required
						control={
							<Checkbox
								checked={checked2}
								onChange={() => setChecked2(!checked2)}
							/>
						}
						label='I have explicit participant consent and ethical
						authorization to publish structural scans without defacing.'
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button disabled={!checked1 && !checked2} onClick={handleClose}>
						Publish
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default DatasetsIndex
