import {
	Box,
	Card,
	CardActions,
	CardContent,
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
			<Card
				elevation={3}
				component={Paper}
				sx={{
					width: 320,
					display: 'flex',
					flexDirection: 'column',
					pr: 2,
				}}
			>
				<CardContent>
					<Box
						display={'flex'}
						alignItems={'center'}
						justifyContent={'space-between'}
						columnGap={'8px'}
					>
						<Typography variant='h6'>{dataset?.Name}</Typography>
					</Box>
					<Typography
						sx={{ mb: 2 }}
						variant='body2'
						gutterBottom
						color='text.secondary'
					>
						{dataset?.Authors?.join(', ')}
					</Typography>
					<DatasetInfo dataset={dataset} />
				</CardContent>
				<CardActions>
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
