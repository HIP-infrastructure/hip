import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { getParticipants } from '../../../api/bids'
import { useAppStore } from '../../../store/appProvider'

const Summary = ({ completed }: { completed: boolean }): JSX.Element => {
	const {
		containers: [containers],
		user: [user, setUser],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		participants: [participants, setParticipants],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
		selectedFiles: [selectedFiles, setSelectedFiles],
	} = useAppStore()

	useEffect(() => {
		if (completed) {
			if (user?.uid && selectedBidsDatabase?.path) {
				getParticipants(selectedBidsDatabase?.path, user.uid).then(response => {
					setParticipants(response)
				})
			}
		}
	}, [completed, selectedBidsDatabase, setParticipants, user])
	return (
		<Box>
			<Box>
				<Typography variant='subtitle1' sx={{ mb: 2, mt: 2 }}>
					<em>BIDS Database:</em> {selectedBidsDatabase?.Name}
				</Typography>

				{!completed && <CircularProgress size={16} />}
			</Box>
		</Box>
	)
}

Summary.displayName = 'Summary'
export default Summary
