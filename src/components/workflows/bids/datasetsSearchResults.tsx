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

type Props = {
	page: number
}

const DatasetsSearchResults = ({page} : Props): JSX.Element => {
	const [rows, setRows] = useState<IndexedBIDSDataset[]>([])

	const {
		user: [user],
		BIDSDatasetsResults: [bidsDatasetsResults],
	} = useAppStore()

	useEffect(() => {
		setRows(bidsDatasetsResults?.data ?? [])
	}, [bidsDatasetsResults])

	return (
		<>
			{rows.length > 0
				? 	<Paper sx={{ flex: 1, }} >
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
				:	<Typography
						sx={{ mt: 1, mb: 2 }}
						variant='body2'
						color='text.secondary'
					>
						No results found - Please try with new keywords
					</Typography>
			}
		</>
	)
}

DatasetsSearchResults.displayName = 'DatasetsSearchResults'

export default DatasetsSearchResults
