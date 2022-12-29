import {
	Card, CardContent,
	CardMedia,
	Paper,
	Typography
} from '@mui/material'
import { HIPProject } from '../../api/types'
import { nameToColor } from '../theme'
import * as React from 'react'

const ProjectCard = ({ project }: { project: HIPProject }) => (
	<Card elevation={3} component={Paper} sx={{ width: 320 }}>
		<CardMedia
			sx={{
				background: `linear-gradient(to top, ${nameToColor(
					project.name,
					'33'
				)}), url(/api/v1/public/media/2109057773_human__neural_pathway__consciousness__autistic_thinking__futuristic__neurons_and_dendrites__photo_realistic__picture_of_the_day.png) no-repeat top center`,
			}}
			component='img'
			height='96'
			alt=''
		/>
		<CardContent>
			<Typography variant='h6'>{project?.name}</Typography>

			<Typography
				sx={{ mb: 2 }}
				variant='body2'
				gutterBottom
				color='text.secondary'
			>
				{project?.description}
			</Typography>
			<Typography variant='body2'>{project?.owner}</Typography>
		</CardContent>
	</Card>
)

export default ProjectCard
