import React, { useEffect, useState } from 'react'

import {
	Alert,
	Box,
	CircularProgress,
	Paper,
	Typography,
} from '@mui/material'

import DatasetCard from '../../datasetCard'
import { useAppStore } from '../../../store/appProvider'
import { IndexedBIDSDataset } from '../../../api/types'


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
	const [rows, setRows] = useState<IndexedBIDSDataset[]>([])

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
									{rows.map(row => (
										<DatasetCard key={row.id} dataset={row} />
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
									No results found - Search with a different query
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
