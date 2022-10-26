import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import CreateDataset from './CreateDataset'
import { Add } from '@mui/icons-material'
import { indexBidsDatasets, queryBidsDatasets } from '../../api/bids'
import Dataset from './DatasetCard'

const Datasets = () => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasetCreated, setDatasetCreated] = useState(false)

	const {
		user: [user],
		BIDSDatasets: [datasets, setDatasets],
	} = useAppStore()

	useEffect(() => {
		if (datasetCreated) {
			indexBidsDatasets(user?.uid).then(() => {
				queryBidsDatasets(user?.uid)
					.then(data => {
						if (data) {
							setDatasets({ data })
						}
					})
					.catch(error => {
						setDatasets({ error })
					})
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

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{!datasets && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}

				{datasets?.error && <Alert severity='error'>{datasets?.error}</Alert>}

				{datasets?.data?.map(dataset => (
					<Dataset key={dataset.id} dataset={dataset} />
				))}
			</Box>
		</>
	)
}

export default Datasets
