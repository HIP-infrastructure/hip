import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Paper,
	Typography,
} from '@mui/material'
import { NavLink, useParams } from 'react-router-dom'
import { BIDSDataset } from '../../api/types'
import { linkStyle, ROUTE_PREFIX } from '../../constants'
import DatasetInfo from './DatasetInfo'
import * as React from 'react'

const DatasetCard = ({ dataset }: { dataset: BIDSDataset }): JSX.Element => {
	const params = useParams()

	return (
		<>
			<Card elevation={3} component={Paper} sx={{ width: 296 }}>
				<CardMedia
					sx={{ backgroundColor: `grey.${100}` }}
					component='img'
					height='96'
					// image='/api/v1/public/media/480x128-543586422_neuro_imaging__database__document_management__neural_pathway__medical__futuristic__neurons_and_dendr.png'
					alt=''
				/>
				<CardContent>
					<Typography variant='h6'>{dataset?.Name}</Typography>

					<Typography
						sx={{ mb: 2 }}
						variant='body2'
						gutterBottom
						color='text.secondary'
					>
						Authors: <strong>{dataset?.Authors?.join(', ')}</strong>
					</Typography>
					<DatasetInfo dataset={dataset} />
				</CardContent>
				<CardActions sx={{ p: 2 }}>
					<NavLink
						style={linkStyle}
						to={`${ROUTE_PREFIX}/private/${params.id}/datasets/${dataset?.id}`}
					>
						View
					</NavLink>
				</CardActions>
			</Card>
		</>
	)
}

DatasetCard.displayName = 'DatasetCard'

export default DatasetCard
