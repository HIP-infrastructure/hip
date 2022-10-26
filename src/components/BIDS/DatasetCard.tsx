import React from 'react'
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
	Paper,
} from '@mui/material'
import { BIDSDataset } from '../../api/types'
import { ROUTE_PREFIX } from '../../constants'
import { NavLink, useParams } from 'react-router-dom'

const DatasetCard = ({ dataset }: { dataset: BIDSDataset }): JSX.Element => {
	const params = useParams()

	return (
		<>
			<Card
				sx={{
					width: 320,
					display: 'flex',
					flexDirection: 'column',
					pr: 2,
				}}
			>
				<Box sx={{ display: 'flex' }}>
					<CardContent>
						<Typography variant='h6'>
							<NavLink
								to={`${ROUTE_PREFIX}/private/${params.id}/datasets/${dataset?.id}`}
							>
								{dataset?.Name}
							</NavLink>
						</Typography>
						<Typography variant='body2' gutterBottom color='text.secondary'>
							{dataset?.Authors}
						</Typography>
						{/* <Typography variant='body2' gutterBottom color='text.secondary'>
							Created by <strong>{dataset.User}</strong> on{' '}
							<strong>{dataset?.CreationDate}</strong>
						</Typography> */}
						<TableContainer component={Paper}>
							<Table size='small'>
								<TableBody>
									<TableRow>
										<TableCell>Tasks</TableCell>
										<TableCell>
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													gap: '0 8px',
												}}
											>
												{dataset?.Tasks?.map(t => (
													<Typography
														key={t}
														variant='body2'
														color='text.secondary'
													>
														<strong>{t}</strong>
													</Typography>
												))}
											</Box>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Formats</TableCell>
										<TableCell>
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													gap: '0 8px',
												}}
											>
												{dataset?.Formats?.map(t => (
													<Typography
														key={t}
														variant='body2'
														color='text.secondary'
													>
														<strong>{t}</strong>
													</Typography>
												))}
											</Box>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
						<Box
							sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: '0px 16px' }}
						>
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
					</CardContent>
				</Box>
			</Card>
		</>
	)
}

DatasetCard.displayName = 'DatasetCard'

export default DatasetCard
