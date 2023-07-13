import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Paper,
	Typography,
} from '@mui/material'
import { NavLink, useParams } from 'react-router-dom'
import { BIDSDataset } from '../../../api/types'
import { linkStyle, ROUTE_PREFIX } from '../../../constants'
import DatasetInfo from './DatasetInfo'
import * as React from 'react'
import { nameToColor } from '../../theme'

const DatasetCard = ({ dataset }: { dataset: BIDSDataset }): JSX.Element => {
	const params = useParams()

	return (
		<>
			<NavLink
				to={`${ROUTE_PREFIX}/centers/${params.centerId}/datasets/${dataset?.id}`}
			>
				<Card elevation={3} component={Paper} sx={{ width: 320 }}>
					<CardMedia
						sx={{
							background: `linear-gradient(to top, ${nameToColor(
								dataset.Name,
								'33'
							)}), url(/api/v1/public/media/2109057773_human__neural_pathway__consciousness__autistic_thinking__futuristic__neurons_and_dendrites__photo_realistic__picture_of_the_day.png) no-repeat top center`,
						}}
						component='img'
						height='96'
						alt=''
					/>
					<CardContent>
						<Typography variant='h6'>{dataset?.Name}</Typography>
						<Typography variant='body2' color='text.secondary'>
							id: {dataset?.id}
						</Typography>
						<Typography
							sx={{ mt: 2, mb: 2 }}
							variant='body2'
							gutterBottom
							color='text.secondary'
						>
							Authors: <strong>{dataset?.Authors?.join(', ')}</strong>
						</Typography>
						<DatasetInfo dataset={dataset} />
					</CardContent>
					<CardActions sx={{ p: 2 }} />
				</Card>
			</NavLink>
		</>
	)
}

DatasetCard.displayName = 'DatasetCard'

export default DatasetCard
