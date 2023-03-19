import * as React from 'react'
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
import { useEffect, useState } from 'react'
import { BIDSDataset, Participant } from '../../api/types'
import { useAppStore } from '../../Store'

const ParticipantsTab = ({
	dataset,
}: {
	dataset?: BIDSDataset
}): JSX.Element => {
	const [rows, setRows] = useState<Participant[]>([])
	const [fields, setFields] = useState<string[]>([
		'participant_id',
		'age',
		'sex',
	])

	const {
		user: [user],
	} = useAppStore()

	useEffect(() => {
		if (dataset?.Participants) {
			const firstLine = JSON.parse(JSON.stringify(dataset.Participants)).pop()
			if (firstLine) {
				const participantFields = Object.keys(firstLine)
				setFields(participantFields)
			}
		}
	}, [dataset])

	useEffect(() => {
		if (dataset?.Participants) {
			dataset.Participants.forEach((_part, index, items) => {
				const item_keys = Object.keys(items[index])
				fields.forEach((_field, field_id, fields) => {
					if (!item_keys.includes(fields[field_id])) {
						items[index][fields[field_id]] = 'n/a'
					}
				})
			})
			setRows(dataset.Participants)
		}
	}, [dataset, fields])

	const columns = [
		...(dataset?.Participants?.reduce(
			(a, c) => Array.from(new Set([...a, ...Object.keys(c)])),
			[] as string[]
		).map((key: string) => ({
			key,
			name: key,
		})) || []),
	]

	return (
		<>
			<Box sx={{ mt: 2 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'start',
					}}
				>
					<Typography variant='h6'>Participants</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '16px 16px',
						mt: 2,
					}}
				>
					<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
						<TableContainer sx={{ maxHeight: 440 }}>
							<Table stickyHeader size='small' aria-label='Participants table'>
								<TableHead>
									<TableRow>
										<TableCell></TableCell>
										{columns.map(c => (
											<TableCell key={c.name}>{c.name}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map(row => (
										<TableRow
											hover
											role='checkbox'
											key={row.participant_id}
										>
											{Object.keys(row).map(key => (
												<TableCell key={key}>{row[key]}</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				</Box>
			</Box>
		</>
	)
}

ParticipantsTab.displayName = 'ParticipantsTab'

export default ParticipantsTab
