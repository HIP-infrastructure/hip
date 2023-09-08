import * as React from 'react'
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	Typography,
} from '@mui/material'
import { BIDSDataset, Container } from '../../api/types'
import { API_GATEWAY } from '../../api/gatewayClientAPI'

const Data = ({
	bidsDatasets,
	sessions,
}: {
	bidsDatasets?: BIDSDataset[]
	sessions?: Container[]
}) => {
	return (
		<>
			{!bidsDatasets && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			<Card
				sx={{
					width: 320,
					height: 440,
				}}
				key={`data-group`}
			>
				<CardMedia
					component='img'
					height='160'
					title={
						'Image generated by DreamStudio, Text-to-Image Generative Art, https://beta.dreamstudio.ai/dream'
					}
					src={`${API_GATEWAY}/public/media/hospital-data.png`}
				/>

				<CardContent>
					<Typography variant='h5'>Data</Typography>

					<Typography
						sx={{ mt: 2 }}
						gutterBottom
						variant='body2'
						color='text.secondary'
					>
						Private space for your center data.
					</Typography>
					<>
						<Typography sx={{ mt: 2 }} variant='body2'>
							{sessions?.length} Opened desktop
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Box sx={{ mr: 0.5 }}>
								<Typography variant='subtitle2'>
									{!bidsDatasets && <CircularProgress size={12} />}
									{bidsDatasets?.reduce(
										(a, b) => a + (b?.ParticipantsCount || 0),
										0
									)}{' '}
									subjects in {''}
									{bidsDatasets?.length} BIDS datasets
								</Typography>
							</Box>
						</Box>
					</>
				</CardContent>
			</Card>
		</>
	)
}

export default Data
