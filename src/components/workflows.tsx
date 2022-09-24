import * as React from 'react'
import Typography from '@mui/material/Typography'
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
} from '@mui/material'
import TitleBar from './UI/titleBar'

import { Workflow } from '../api/types'
import { useNavigate } from 'react-router-dom'
import WorkflowsStatus from './UI/workflowsStatus'

const availableWorkflows: Workflow[] = [
	{
		id: 'bids-tools',
		label: 'BIDS Importer',
		description: "BIDS tools to convert user's data to BIDS format",
		state: 'beta',
		enabled: true,
	},
]

const Workflows = () => {
	const navigate = useNavigate()

	const handleClickWorkflow = (id: string) => {
		navigate(id)
	}

	return (
		<>
			<TitleBar title='Workflows' />

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{availableWorkflows?.map((workflow, i) => (
					<Card sx={{ maxWidth: 320 }} key={workflow.id}>
						<CardMedia
							component='img'
							height='140'
							src={`${process.env.REACT_APP_GATEWAY_API}/public/media/bidsmanager__logo.png]}`}
							alt={workflow.label}
						/>
						<CardContent>
							<Box sx={{ display: 'flex' }}>
								<Typography gutterBottom variant='h5' sx={{ flex: 1 }}>
									{workflow.label}
								</Typography>
								<Chip
									label={workflow.state}
									color={workflow.state !== 'faulty' ? 'success' : 'error'}
									variant='outlined'
								/>
							</Box>

							<Typography gutterBottom variant='body2' color='text.secondary'>
								{workflow.description}
							</Typography>
							<Typography variant='caption' color='text.secondary'></Typography>
						</CardContent>
						<CardActions>
							<Button size='small' onClick={() => handleClickWorkflow('bids')}>
								Start Workflow
							</Button>
						</CardActions>
					</Card>
				))}
			</Box>
			<hr />
			<Box sx={{ mt: 4 }}>
				<Typography gutterBottom variant='h6'>
					Running Workflows
				</Typography>

				<WorkflowsStatus />
			</Box>
		</>
	)
}

Workflows.displayName = 'Workflows'
export default Workflows
