import {
	Box,
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
import { BIDSDatabase, File, Participant } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'


const Summary = (): JSX.Element => {
	const {
        containers: [containers],
        user: [user, setUser],
        bidsDatabases: [bidsDatabases, setBidsDatabases],
        selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
        participants: [participants, setParticipants],
        selectedParticipants: [selectedParticipants, setSelectedParticipants],
        selectedFiles: [selectedFiles, setSelectedFiles]
    } = useAppStore()

	return (
		<Box>
			<Box>
				<Typography variant='subtitle1' sx={{ mb: 2, mt: 2 }}>
					<em>BIDS Database:</em> {selectedBidsDatabase?.Name}
				</Typography>
				{/* {selectedBidsDatabase &&
                Object.keys(selectedBidsDatabase)
                    .filter(k => k !== 'Participants')
                    .map((k: string) =>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <em>{k}:</em> {JSON.stringify(selectedBidsDatabase[k], null, 2)}
                        </Typography>
                    )} */}
			</Box>
			
		</Box>
	)
}

Summary.displayName = 'Summary'
export default Summary
