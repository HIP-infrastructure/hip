import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Tooltip, Typography } from '@mui/material'
import { BIDSDataset } from '../../../api/types'
import * as React from 'react'

const DatasetInfo = ({ dataset }: { dataset?: BIDSDataset }): JSX.Element => (
	<>
		{dataset?.DataTypes && dataset?.DataTypes?.length > 0 && (
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 4px' }}>
				<Typography variant='body2' color='text.secondary'>
					Datatype(s):
				</Typography>

				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 8px' }}>
					{dataset?.DataTypes?.map(t => (
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
					Task(s):
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
				Ages:{' '}
				<strong>
					[{dataset?.AgeMin}, {dataset?.AgeMax}]
				</strong>
			</Typography>
			{dataset?.ParticipantsGroups &&
				dataset?.ParticipantsGroups.length > 0 && (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 4px' }}>
						<Typography variant='body2' color='text.secondary'>
							Groups:
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 8px' }}>
							{dataset?.ParticipantsGroups?.map(t => (
								<Typography key={t} variant='body2' color='text.secondary'>
									<strong>{t}</strong>
								</Typography>
							))}
						</Box>
					</Box>
				)}
			<Typography variant='body2' color='text.secondary'>
				Size: <strong>{dataset?.Size}</strong>
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Files: <strong>{dataset?.FileCount}</strong>
			</Typography>
		</Box>
		<Box sx={{ display: 'flex', mt: 2, flexWrap: 'wrap', gap: '0px 8px' }}>
			<Typography variant='body2' color='text.secondary'>
				BIDS Validation:
			</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 8px' }}>
				{dataset?.BIDSValid && (
					<CheckIcon sx={{ color: '#009900' }}></CheckIcon>
				)}
				{!dataset?.BIDSValid && (
					<>
						<Tooltip
							title={`${
								dataset?.BIDSErrors && dataset?.BIDSErrors[0]?.reason
							} (file: ${
								dataset?.BIDSErrors &&
								dataset?.BIDSErrors[0]?.files[0].file.relativePath
							})`}
						>
							<CloseIcon sx={{ color: '#cc0000' }}></CloseIcon>
						</Tooltip>
					</>
				)}
			</Box>
		</Box>
	</>
)

DatasetInfo.displayName = 'DatasetInfo'

export default DatasetInfo
