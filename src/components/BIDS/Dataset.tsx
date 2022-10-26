import {
	Alert,
	Box,
	Breadcrumbs,
	Button,
	CircularProgress,
	Typography,
	Link,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import { Add } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { BIDSDataset } from '../../api/types'
import CreateParticipant from './CreateParticipant'

const Dataset = () => {
	const [dataset, setDataset] = useState<BIDSDataset>()
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [participantEditId, setParticipantEditId] = useState<string>()
	const params = useParams()
	const navigate = useNavigate()

	const {
		user: [user],
		BIDSDatasets: [datasets, setDatasets],
	} = useAppStore()

	useEffect(() => {
		const ds = datasets?.data?.find(dataset => dataset.id === params.datasetId)
		setDataset(ds)
	}, [params])

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
				title='BIDS Browser'
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

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
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

				<pre>{JSON.stringify(dataset, null, 2)}</pre>
			</Box>
		</>
	)
}
export default Dataset
