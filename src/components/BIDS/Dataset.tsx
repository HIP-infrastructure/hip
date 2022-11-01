import * as React from 'react'
import { Add } from '@mui/icons-material'
import {
	Box,
	Breadcrumbs,
	Button,
	CircularProgress,
	Link,
	Paper,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BIDSDataset } from '../../api/types'
import { useAppStore } from '../../store/appProvider'
import FileBrowser from '../UI/FileBrowser'
import TitleBar from '../UI/titleBar'
import CreateParticipant from './CreateParticipant'
import DatasetDescription from './DatasetDescription'
import DatasetInfo from './DatasetInfo'
const Dataset = () => {
	const [dataset, setDataset] = useState<BIDSDataset>()
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [participantEditId, setParticipantEditId] = useState<string>()
	const [path, setPath] = useState<string>('')
	const params = useParams()
	const navigate = useNavigate()
	const {
		BIDSDatasets: [datasets],
	} = useAppStore()

	useEffect(() => {
		if (dataset) return

		const ds = datasets?.data?.find(dataset => dataset.id === params.datasetId)
		setDataset(ds)
	}, [dataset, datasets, params])

	// FIXME: This is a temporary solution to get datasets path
	useEffect(() => {
		if (dataset) {
			const nextPath = dataset.Path?.replace(
				/mnt\/nextcloud-dp\/nextcloud\/data\/.*?\/files\//,
				'/'
			).replace(
				/\/mnt\/nextcloud-dp\/nextcloud\/data\/__groupfolders\/.*?\//,
				'/groupfolder/'
			)

			if (nextPath) setPath(nextPath)
		}
	}, [dataset])

	return (
		<>
			<CreateParticipant
				participantEditId={participantEditId}
				open={isCreateDialogOpen}
				handleClose={() => {
					setParticipantEditId(undefined)
					setIsCreateDialogOpen(!isCreateDialogOpen)
				}}
			/>
			<TitleBar
				title='BIDS Dataset'
				button={
					<Box sx={{ display: 'flex' }}>
						<Button
							color='primary'
							size='small'
							sx={{ m: 2 }}
							startIcon={<Add />}
							onClick={() => {
								setParticipantEditId(undefined)
								setIsCreateDialogOpen(true)
							}}
							variant='contained'
						>
							Add new Participant
						</Button>
					</Box>
				}
			/>

			<Box sx={{ mt: 2 }}>
				<Box>
					<Breadcrumbs aria-label='breadcrumb'>
						<Link onClick={() => navigate(-1)}>Datasets</Link>
						<Typography color='text.primary'>{dataset?.Name}</Typography>
					</Breadcrumbs>
				</Box>
				{!dataset && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}

				<Box elevation={2} component={Paper} sx={{ mt: 2, p: 1 }}>
					<Typography variant='h6'>{dataset?.Name}</Typography>
					<DatasetInfo dataset={dataset} />
				</Box>
				<Box
					sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}
				>
					<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
						<Typography variant='h6'>Files</Typography>
						<FileBrowser path={path} />
					</Box>
					<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
						<Typography variant='h6'>Description</Typography>
						<DatasetDescription dataset={dataset} />
					</Box>
				</Box>
			</Box>
		</>
	)
}
export default Dataset
