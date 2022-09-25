import * as React from 'react'
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	Typography,
} from '@mui/material'
import { BIDSDataset, Container, Group, User } from '../../api/types'

const Data = ({
	group,
	users,
	bidsDatasets,
	sessions,
}: {
	group: Group
	bidsDatasets: {
		data?: BIDSDataset[] | undefined
		error?: Error | undefined
	}
	users: User[]
	sessions: Container[]
}) => {
	return (
		<>
			{!group && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			{group && users && (
				<Card
					sx={{
						width: 320,
						height: 520,

						display: 'flex',
						flexDirection: 'column',
					}}
					key={`data-${group.label}`}
				>
					<Box sx={{ position: 'relative' }}>
						<CardMedia
							component='img'
							height='160'
							src={`${process.env.REACT_APP_GATEWAY_API}/public/media/1375898092_synapses__data___database__information__network__neural_path__futuristic_and_medical__realistic__8k__pic_of_the_day.png`}
							alt={group.label}
							title={group.label}
						/>
					</Box>
					<CardContent sx={{ flexGrow: 1 }}>
						<Box sx={{ display: 'flex' }}>
							<Box sx={{ flex: 1 }}>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Typography variant='h5'>Data</Typography>

									{/* <Chip
                                        label={space.state}
                                        color={space.state === 'beta' ? 'success' : 'warning'}
                                        variant='outlined'
                                    /> */}
								</Box>
								<Typography
									gutterBottom
									variant='caption'
									color='text.secondary'
								></Typography>
							</Box>
						</Box>

						{/* <Typography
                                sx={{ mt: 2 }}
                                gutterBottom
                                variant='body2'
                                color='text.secondary'
                            >
                            </Typography> */}
						<>
							<Typography sx={{ mt: 2 }} variant='body2' color='text.secondary'>
								{sessions?.length} <em>Opened desktop</em>
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Box sx={{ mr: 0.5 }}>
									<Typography variant='body2' color='text.secondary'>
										{!bidsDatasets && <CircularProgress size={12} />}
										{bidsDatasets?.data?.reduce(
											(a, b) => a + (b?.participants?.length || 0),
											0
										)}{' '}
										<em>subjects</em> in{' '}
										{!bidsDatasets && <CircularProgress size={12} />}
										{bidsDatasets?.data?.length}
										<em> BIDS datasets</em>
									</Typography>
								</Box>
							</Box>
						</>
					</CardContent>
				</Card>
			)}
		</>
	)
}
