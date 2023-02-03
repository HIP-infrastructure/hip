import * as React from 'react'
import {
	Facebook,
	Instagram,
	Language,
	LinkedIn,
	Twitter,
	YouTube,
} from '@mui/icons-material'
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	IconButton,
	Link,
	Typography,
} from '@mui/material'
import { HIPCenter } from '../../api/types'
import { linkStyle } from '../../constants'

const MainCard = ({ group }: { group?: any }) => {
	
	return (
		<>
			{!group && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			{group && (
				<Card
					sx={{
						width: 320,
						height: 440,
					}}
					key={`center-${group.label}`}
				>
					<CardMedia
						component='img'
						height='160'
						src={`${process.env.REACT_APP_GATEWAY_API}/public/media/1375898092_synapses__data___database__information__network__neural_path__futuristic_and_medical__realistic__8k__pic_of_the_day.png`}
						alt={group.label}
						title={group.label}
					/>

					<CardContent>
						<Typography variant='h5'>{group?.title}</Typography>

						<Typography
							sx={{ mt: 2 }}
							gutterBottom
							variant='body2'
							color='text.secondary'
						>
							{group.description}
						</Typography>

						<Typography variant='subtitle2'>{group.admins}</Typography>
						
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default MainCard
