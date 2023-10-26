import { Box, CardActions, CardContent, Link, Typography } from '@mui/material'
import { BIDSDataset } from '../../../api/types'
import * as React from 'react'

const DatasetDescription = ({ dataset }: { dataset?: BIDSDataset }) => {
	return (
		<>
			{dataset && (
				<>
					<CardContent>
						<Typography gutterBottom variant='h6' component='div'>
							{dataset?.Name}
						</Typography>
						<Typography sx={{ mb: 1.5 }} color='text.secondary'>
							<strong>Authors:</strong> {dataset?.Authors?.join(', ')}
						</Typography>
						<Typography variant='body1'>
							<strong>Number of participants</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{dataset?.ParticipantsCount}
						</Typography>
						<Typography variant='body1'>
							<strong>BIDS version</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{dataset?.BIDSVersion}
						</Typography>
						<Typography variant='body1'>
							<strong>License</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{(dataset?.License && dataset.License) || 'n/a'}
						</Typography>
						<Typography variant='body1'>
							<strong>Acknowledgements</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{(dataset?.Acknowledgements && dataset.Acknowledgements) || 'n/a'}
						</Typography>
						<Typography variant='body1'>
							<strong>How to Acknowledge</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{(dataset?.HowToAcknowledge && dataset.HowToAcknowledge) || 'n/a'}
						</Typography>
						<Typography variant='body1'>
							<strong>Funding</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{(dataset?.Funding && dataset.Funding.toString()) || 'n/a'}
						</Typography>
						<Typography variant='body1'>
							<strong>References and Links</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{(dataset?.ReferencesAndLinks &&
								dataset.ReferencesAndLinks.toString()) ||
								'n/a'}
						</Typography>
						<Typography variant='body1'>
							<strong>DOI</strong>
						</Typography>
						<Typography gutterBottom variant='body1'>
							{(dataset?.DatasetDOI && dataset.DatasetDOI) || 'n/a'}
						</Typography>
						<Typography variant='body1'>
							<strong>Files</strong>
						</Typography>
						<Box>
							<Link
								target='_blank'
								href={`${window.location.protocol}//${
									window.location.host
								}/apps/files/?dir=${dataset?.Path?.replace(
									'/GROUP_FOLDER',
									''
								)}`}
							>
								{dataset?.Path?.replace('/GROUP_FOLDER', '')}
							</Link>
						</Box>
					</CardContent>
					<CardActions></CardActions>
				</>
			)}
		</>
	)
}
DatasetDescription.displayName = 'DatasetDescription'
export default DatasetDescription
