import React from 'react'

import { Info } from '@mui/icons-material'
import {
	Box,
	CircularProgress,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material'

import { CreateSubjectDto } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'

const Summary = ({
	response,
}: {
	response?: { error?: Error; data?: CreateSubjectDto }
}): JSX.Element => {
	const {
		selectedBidsDataset: [selectedBidsDataset],
		selectedFiles: [selectedFiles],
	} = useAppStore()

	const { error, data } = response || {}

	return (
		<Box>
			<Box>
				<Typography
					sx={{ mt: 1, mb: 2 }}
					variant='subtitle1'
					color='text.secondary'
				>
					Importing files
				</Typography>
				<TableContainer sx={{ mt: 1, mb: 2 }} component={Paper}>
					<Table size='small' aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Subject</TableCell>
								<TableCell>Modality</TableCell>
								<TableCell>Path</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedFiles?.reverse().map(file => (
								<TableRow
									key={file.path}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell>
										{!response && <CircularProgress size={16} />}
										{data && (
											<Tooltip
												title={JSON.stringify(data, null, 2)}
												placement='bottom'
											>
												<Info color='success' />
											</Tooltip>
										)}
										{error && (
											<Tooltip title={error.message} placement='bottom'>
												<Info color='error' />
											</Tooltip>
										)}
									</TableCell>
									<TableCell>{file.subject}</TableCell>
									<TableCell>{file.modality}</TableCell>
									<TableCell>{file.path}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<Link
					target='_blank'
					href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${selectedBidsDataset?.Path}`}
				>
					{selectedBidsDataset?.Path}
				</Link>
			</Box>
		</Box>
	)
}

Summary.displayName = 'Summary'
export default Summary
