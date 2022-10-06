import React, { useEffect, useState } from 'react'

import {
	Alert,
	Box,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Divider,
	Link,
	Paper,
	/* Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow, */
	Typography,
} from '@mui/material'
import { BIDSDataset } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'

const boxStyle = {
	border: 1,
	borderColor: 'grey.400',
	p: 2,
	mr: 1,
	display: 'flex',
	flex: '1 0 auto',
	flexFlow: 'column',
}

const DatasetsResults = (): JSX.Element => {
	const [rows, setRows] = useState<BIDSDataset[]>([])

	const {
		user: [user],
		BIDSDatasetsResults: [bidsDatasetsResults],
	} = useAppStore()

	useEffect(() => {
		setRows(bidsDatasetsResults?.data ?? [])
	}, [bidsDatasetsResults])

	console.log(`Content of query results: ${rows}`)

	return (
		<>
			{rows.length > 0
				? <Box sx={{ width: '100%', mt: 3 }}>
					<Box sx={{ mt: 2 }}>
						<Box sx={boxStyle}>
							<Box
								sx={{
									display: 'flex',
									gap: '1em',
									width: 'inherit',
									mr: 2,
								}}
							>
								<Paper
									sx={{
										flex: 1,
									}}
								>
									{/* <TableContainer sx={{ maxHeight: 440 }}>
										<Table stickyHeader size='small' aria-label='BIDS Datasets tables'>
											<TableHead>
												<TableRow>
													<TableCell>Id</TableCell>
													<TableCell sx={{ width: 320 }}>Name</TableCell>
													<TableCell>Participants</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{rows.map(row => (
													<TableRow
														hover
														role='checkbox'
														tabIndex={-1}
														key={row.id}
													>
														<TableCell>{row.id}</TableCell>
														<TableCell>{row.Name}</TableCell>
														<TableCell>{row.participants?.length}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer> */}

									{rows.map(row => (
										<>
											<Paper
												sx={{
													flex: 1,
													mb: 2
												}}
											>
												<Card sx={{ display: 'flex' }}>
													<Box sx={{ display: 'flex', flexDirection: 'column', m: 0}}>
														<CardContent sx={{ flex: '1 0 auto', m: 0 }}>
														<Typography component="div" variant="h5">
															{row?.Name} &nbsp;
															<Typography
																variant="subtitle1"
																color="text.secondary"
																component="div"
																display="inline"
															>
																{row?.Authors}
															</Typography>
															&nbsp;
															<Typography
																variant="subtitle1"
																color="text.secondary"
																component="div"
																display="inline"
															>
																(Creation date TBC)
															</Typography>
														</Typography>
														</CardContent>
														<Box sx={{ display: 'flex', mt: -2, mb: -2 }}>
															<CardContent sx={{ flex: '1 0 auto' }}>
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																>
																	Dataset id: {row?.id} (
																		<Link
																			target='_blank'
																			href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${row?.path}`}
																		>
																			{row?.path}
																		</Link>
																	)
																</Typography>
															</CardContent>
															<CardContent sx={{ flex: '1 0 auto' }}>
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																>
																	#Event files: TBC
																</Typography>
															</CardContent>
														</Box>
														<Divider variant="middle" />
														<Box sx={{ display: 'flex', mt: 0, mb: -2 }}>
															<CardContent sx={{ flex: '1 0 auto' }} >
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																	display="inline"
																>
																	#Participants: {row?.participants?.length}
																</Typography>
																&nbsp;
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																	display="inline"
																>
																	Ages(yrs): TBC
																</Typography>
															</CardContent>
															<CardContent sx={{ flex: '1 0 auto' }}>
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																>
																	#Sessions: TBC
																</Typography>
															</CardContent>
														</Box>
														<Divider variant="middle" />
														<Box sx={{ display: 'flex', mt: 0, mb: -2 }}>
															<CardContent sx={{ flex: '1 0 auto' }}>
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																	display="inline"
																>
																	Modality(s): TBC
																</Typography>
																&nbsp;
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																	display="inline"
																>
																	Format(s): TBC
																</Typography>
															</CardContent>
															<CardContent sx={{ flex: '1 0 auto' }}>
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																>
																	#SEEG Channels: TBC
																</Typography>
															</CardContent>
														</Box>
														<Divider variant="middle" />
														<Box sx={{ display: 'flex' }}>
															<CardContent sx={{ flex: '1 0 auto' }}>
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																>
																	Dataset size: TBC
																</Typography>
															</CardContent>
															<CardContent sx={{ flex: '1 0 auto' }}>
																<Typography
																	variant="subtitle1"
																	color="text.secondary"
																	component="div"
																>
																	#Files: TBC
																</Typography>
															</CardContent>
														</Box>
													</Box>
													<CardActions></CardActions>
												</Card>
											</Paper>
										</>
									))}
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
										}}
									>
										{!bidsDatasetsResults && <CircularProgress sx={{ m: 2 }} size={16} />}
										{bidsDatasetsResults?.error && (
											<Alert sx={{ m: 2 }} severity='error'>
												{bidsDatasetsResults?.error.message}
											</Alert>
										)}
									</Box>
								</Paper>
							</Box>
						</Box>
					</Box>	
				</Box>
				: <Box sx={{ width: '100%', mt: 3 }}>
					<Box sx={{ mt: 2 }}>
						<Box sx={boxStyle}>
							<Box
								sx={{
									display: 'flex',
									gap: '1em',
									width: 'inherit',
									mr: 2,
								}}
							>
								<Typography
									sx={{ mt: 1, mb: 2 }}
									variant='body2'
									color='text.secondary'
								>
									No dataset found containing your query
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			}
		</>
	)
}

DatasetsResults.displayName = 'DatasetsResults'

export default DatasetsResults
