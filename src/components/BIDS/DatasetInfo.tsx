import { Box, Typography } from '@mui/material'
import { BIDSDataset } from '../../api/types'
import * as React from 'react'

const DatasetInfo = ({ dataset }: { dataset?: BIDSDataset }): JSX.Element => (
	<>
	{dataset?.Modalities && dataset?.Modalities?.length > 0 && (
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 4px' }}>
				<Typography variant='body2' color='text.secondary'>
				Modalities:
				</Typography>

				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 8px' }}>
					{dataset?.Modalities?.map(t => (
						<Typography key={t} variant='body2' color='text.secondary'>
							<strong>{t}</strong>
						</Typography>
					))}
				</Box>
			</Box>
		)}
		{dataset?.Tasks && dataset?.Tasks?.length > 0 && (
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 4px' }}>
				<Typography variant='body2' color='text.secondary'>
					Tasks:
				</Typography>

				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 8px' }}>
					{dataset?.Tasks?.map(t => (
						<Typography key={t} variant='body2' color='text.secondary'>
							<strong>{t}</strong>
						</Typography>
					))}
				</Box>
			</Box>
		)}
		{dataset?.Formats && dataset?.Formats.length > 0 && (
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 4px' }}>
				<Typography variant='body2' color='text.secondary'>
					Formats:
				</Typography>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 8px' }}>
					{dataset?.Formats?.map(t => (
						<Typography key={t} variant='body2' color='text.secondary'>
							<strong>{t}</strong>
						</Typography>
					))}
				</Box>
			</Box>
		)}
		<Box sx={{ display: 'flex', mt: 2, flexWrap: 'wrap', gap: '0px 8px' }}>
			<Typography variant='body2' color='text.secondary'>
				Sessions: <strong>{dataset?.SessionsCount}</strong>
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Participants: <strong>{dataset?.ParticipantsCount}</strong>
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Ages: <strong>{dataset?.AgeRange?.join(' - ')}</strong>
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Size: <strong>{dataset?.Size}</strong>
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Files: <strong>{dataset?.FileCount}</strong>
			</Typography>
		</Box>
	</>
)

DatasetInfo.displayName = 'DatasetInfo'

export default DatasetInfo
