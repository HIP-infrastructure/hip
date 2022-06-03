import { Delete } from '@mui/icons-material'
import {
	Box,
	CircularProgress,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import React from 'react'
import { useAppStore } from '../../../store/appProvider'
import DoneIcon from '@mui/icons-material/Done'

const Summary = ({ completed }: { completed: boolean }): JSX.Element => {
	const {
		containers: [containers],
		user: [user, setUser],
		bIDSDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
		selectedFiles: [selectedFiles, setSelectedFiles],
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
				<TableContainer component={Paper}>
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
			</Box>
		</Box>
	)
}

Summary.displayName = 'Summary'
export default Summary
