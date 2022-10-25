import React, { useEffect, useState } from 'react'

import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material'

import DatasetCard from '../../datasetCard'
import { useAppStore } from '../../../store/appProvider'
import { BIDSDataset } from '../../../api/types'

type Props = {
	page: number
	datasets?: BIDSDataset[] | undefined
}

const DatasetsSearchResults = ({ page, datasets }: Props): JSX.Element => {
	return (
		<>
			{datasets && datasets?.length > 0 ? (
				<Paper sx={{ flex: 1 }}>
					{datasets.map(row => (
						<DatasetCard key={row.id} dataset={row} />
					))}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						{!datasets && <CircularProgress sx={{ m: 2 }} size={16} />}
						{/* {datasets?.error && (
							<Alert sx={{ m: 2 }} severity='error'>
								{datasets?.error}
							</Alert>
						)} */}
					</Box>
				</Paper>
			) : (
				<Typography
					sx={{ mt: 1, mb: 2 }}
					variant='body2'
					color='text.secondary'
				>
					No results found - Please try with new keywords
				</Typography>
			)}
		</>
	)
}

DatasetsSearchResults.displayName = 'DatasetsSearchResults'

export default DatasetsSearchResults
