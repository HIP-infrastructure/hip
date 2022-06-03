import DoneIcon from '@mui/icons-material/Done'
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
	Typography
} from '@mui/material'
import React from 'react'
import { useAppStore } from '../../../store/appProvider'

const Summary = ({ completed }: { completed: boolean }): JSX.Element => {
	const {
		selectedBidsDatabase: [selectedBidsDatabase],
		selectedFiles: [selectedFiles],
	} = useAppStore()

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
										{!completed && <CircularProgress size={16} />}
										{completed && <DoneIcon color='success' />}
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
					href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${selectedBidsDatabase?.path}`}
				>
					{selectedBidsDatabase?.path}
				</Link>
			</Box>
		</Box>
	)
}

Summary.displayName = 'Summary'
export default Summary
