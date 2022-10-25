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

const Data = ({
	bidsDatasets,
	sessions,
}: {
	bidsDatasets?: {
		data?: BIDSDataset[] | undefined
		error?: string | undefined
	}
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
					src={`${process.env.REACT_APP_GATEWAY_API}/public/media/1375898092_synapses__data___database__information__network__neural_path__futuristic_and_medical__realistic__8k__pic_of_the_day.png`}
				/>

				<CardContent>
					<Typography variant='h5'>Data</Typography>

					<Typography
						sx={{ mt: 2 }}
						gutterBottom
						variant='body2'
						color='text.secondary'
					>
						Password-protected space for your center data to upload and curate
						own data.
					</Typography>
					<>
						<Typography sx={{ mt: 2 }} variant='body2'>
							{sessions?.length} Opened desktop
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Box sx={{ mr: 0.5 }}>
								<Typography variant='subtitle2'>
									{!bidsDatasets && <CircularProgress size={12} />}
									{bidsDatasets?.data?.reduce(
										(a, b) => a + (b?.ParticipantsCount || 0),
										0
									)}{' '}
									subjects in {''}
									{bidsDatasets?.data?.length} BIDS datasets
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
