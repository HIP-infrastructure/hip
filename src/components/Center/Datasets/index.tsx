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
import { publishDatasetToPublicSpace } from '../../../api/bids'
import { BIDSDataset } from '../../../api/types'
import { LoadingButton } from '@mui/lab'
import { useNotification } from '../../../hooks/useNotification'

const DatasetsIndex = () => {
	const [open, setOpen] = React.useState(false)
	const [checked1, setChecked1] = React.useState(false)
	const [checked2, setChecked2] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [datasetPath, setDatasetPath] = React.useState('')
	const { showNotif } = useNotification()

	const handleClickedDataset = (dataset: BIDSDataset) => {
		setOpen(true)
		setDatasetPath(dataset?.Path || '')
	}

	const handleCheckedClicked = async () => {
		setLoading(true)
		publishDatasetToPublicSpace(datasetPath)
			.then(() => {
				setLoading(false)
				handleClose()
				showNotif('Dataset was published', 'success')
			})
			.catch(error => {
				setLoading(false)
				handleClose()
				showNotif(error, 'error')
			})
	}

	const handleClose = () => {
		setOpen(false)
		setChecked1(false)
		setChecked2(false)
	}

	return (
		<>
			<Datasets
				handleClickedDataset={handleClickedDataset}
				buttonTitle={'Make public'}
			/>
			<Dialog open={open} onClose={handleCheckedClicked}>
				<DialogTitle>Make Dataset Public</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<h1>Health Data Sharing Consent Form for Research Purposes</h1>
						<p>
							Thank you for considering the contribution of health data to
							support healthcare research. Before proceeding, it is essential to
							ensure that all data sharing is fully compliant with the relevant
							data protection regulations. These include the European Union&apos;s
							General Data Protection Regulation (GDPR), the Swiss Federal Act
							on Data Protection (FADP), relevant United States laws, and any
							specific laws from your country of operation. Please read the
							following terms carefully and indicate your agreement before
							submitting any data.
						</p>
					</DialogContentText>

					<Typography variant='subtitle1'>
						Please affirm one of the following
					</Typography>

					<FormControlLabel
						required
						control={
							<Checkbox
								checked={checked1}
								disabled={loading}
								onChange={() => setChecked1(!checked1)}
							/>
						}
						label='I confirm that any health data provided will be shared in an anonymized manner, understanding that anonymized data is considered outside the scope of GDPR and FADP.'
					/>

					<FormControlLabel
						required
						control={
							<Checkbox
								checked={checked2}
								disabled={loading}
								onChange={() => setChecked2(!checked2)}
							/>
						}
						label='I commit to adhering to the principles of GDPR and FADP, which include lawfulness, fairness, transparency, purpose limitation, data minimization, accuracy, storage limitation, and integrity and confidentiality.'
					/>
				</DialogContent>
				<DialogActions>
					<Button disabled={loading} onClick={handleClose}>
						Cancel
					</Button>
					<LoadingButton
						loading={loading}
						disabled={!(checked1 && checked2)}
						onClick={handleCheckedClicked}
					>
						Publish
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default DatasetsIndex
