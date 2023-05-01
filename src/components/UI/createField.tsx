import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, TextField, Box, Tooltip } from '@mui/material'
import React, { useState } from 'react'

interface Field {
	key: string
}

interface ICreateField {
	handleCreateField: ({ key }: Field) => void
	creating: boolean
}

const CreateField = ({ handleCreateField, creating }: ICreateField) => {
	const [show, setShow] = useState(false)
	const [field, setField] = useState<Field>()

	const handleAddField = () => {
		if (field) {
			handleCreateField(field)
			setShow(false)
			setField(undefined)
		}
	}

	return (
		<>
			{!show && (
				<Tooltip title='Add a new column to the BIDS participants.tsv file'>
					<LoadingButton
						onClick={() => setShow(!show)}
						variant='outlined'
						color='primary'
						size='small'
						loading={creating}
						loadingPosition='start'
						startIcon={<Add />}
						sx={{ mt: 0.5, mb: 2, ml: 0.5 }}
					>
						Add Column
					</LoadingButton>
				</Tooltip>
			)}
			{show && (
				<Box sx={{ mt: 2 }}>
					<TextField
						label='New key'
						id='new-key'
						size='small'
						onChange={event =>
							setField(f => ({ ...f, key: event.target.value }))
						}
						value={field?.key}
					/>
					<Box>
						<Button
							onClick={() => setShow(false)}
							variant='outlined'
							size='small'
							sx={{ mt: 2 }}
						>
							Cancel
						</Button>
						<Button
							size='small'
							onClick={handleAddField}
							variant='outlined'
							sx={{ mt: 2 }}
						>
							OK
						</Button>
					</Box>
				</Box>
			)}
		</>
	)
}
export default CreateField
