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
import { BIDSDataset, HIPProject } from '../../api/types'
import useDebounce from '../../hooks/useDebounce'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import CreateDataset from '../BIDS/CreateDataset'
import DatasetCard from './DatasetCard'
import { getProjectDatasets } from '../../api/projects'
import { useNavigate, useParams } from 'react-router-dom'

const Datasets = () => {
	const {
		user: [user],
		projects: [projects],
	} = useAppStore()
	const params = useParams()
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [datasetCreated, setDatasetCreated] = useState(false)
	const [datasets, setDatasets] = useState<
		{ data?: BIDSDataset[]; error?: string } | undefined
	>()
	const [project, setProject] = useState<HIPProject>()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!user?.uid) return
		getProjectDatasets(user?.uid).then(datasets => {
			setDatasets({ data: datasets })
		})
	}, [user?.uid])

	useEffect(() => {
		const project = projects?.find(project => project.name === params?.id)
		setProject(project)
	}, [projects, setProject, params])

	return (
		<>
			<CreateDataset
				open={isCreateDialogOpen}
				handleClose={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
				setDatasetCreated={setDatasetCreated}
			/>

			<TitleBar
				title={`${project?.name} BIDS Datasets`}
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

				<Box display='flex' flexDirection='row'>
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
			</Box>
		</>
	)
}

export default Datasets
