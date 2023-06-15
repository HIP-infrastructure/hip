import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'
import * as React from 'react'

const CSV2Table = ({
	data,
	splitChar = ',',
}: {
	data: string
	splitChar?: string
}) => {
	const csvHeader = data.slice(0, data.indexOf('\n')).split(splitChar)
	const csvRows = data.slice(data.indexOf('\n') + 1).split('\n')

	const rows = csvRows.map(i => {
		const values = i.split(splitChar)
		const row = csvHeader.reduce((object, header, index) => {
			object[header] = values[index]
			return object
		}, {} as { [key: string]: string })

		return row
	})

	const headerKeys = Object.keys(Object.assign({}, ...rows))

	return (
		<TableContainer>
			<Table aria-label='csv table'>
				<TableHead>
					<TableRow>
						{headerKeys.map(key => (
							<TableCell key={key}>
								<strong>{key}</strong>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, i) => (
						<TableRow
							key={`row-${i}`}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							{Object.values(row).map(
								val =>
									(i === 0 && (
										<TableCell key={`${i}`} component='th' scope='row'>
											{val}
										</TableCell>
									)) || <TableCell key={`${i}`}>{val}</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default CSV2Table
