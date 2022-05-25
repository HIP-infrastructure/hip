import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function createData(
	id: string,
	name: string,
	status: string,
	elapsed: string,
	progress: string
) {
	return { id, name, status, elapsed, progress }
}

const rows = [
	createData('1', 'BIDS Importer', 'running', '20mn', '98%'),
	createData('2', 'BIDS Importer', 'completed', '3mn', '100%'),
]

export default function BasicTable() {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Workflow</TableCell>
						<TableCell align='right'>Name</TableCell>
						<TableCell align='right'>Status</TableCell>
						<TableCell align='right'>Elapsed time</TableCell>
						<TableCell align='right'>Progress</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						<TableRow
							key={`${row.id}`}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component='th' scope='row'>
								{row.name}
							</TableCell>
							<TableCell align='right'>{row.name}</TableCell>
							<TableCell align='right'>{row.status}</TableCell>
							<TableCell align='right'>{row.elapsed}</TableCell>
							<TableCell align='right'>{row.progress}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
