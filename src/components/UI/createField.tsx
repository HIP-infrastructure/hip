import { Button, TextField, Box, Tooltip } from '@mui/material'
import React, { useState } from 'react'

interface Field {
	key: string
}

interface ICreateField {
	handleCreateField: ({ key }: Field) => void
}

const CreateField = ({ handleCreateField }: ICreateField) => {
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
				<Tooltip title='Add a new field to BIDS Clinical data'>
					<Button
						onClick={() => setShow(!show)}
						variant='outlined'
						color='primary'
						size='small'
						sx={{ mt: 0.5, mb: 0.5, ml: 0.5 }}
					>
						Add Key
					</Button>
				</Tooltip>
			)}
			{show && (
				<Box sx={{ mt: 2 }}>
					<TextField
						label='New key'
						id='new-key'
						onChange={event =>
							setField(f => ({ ...f, key: event.target.value }))
						}
						value={field?.key}
					/>
					<Box>
						<Button
							onClick={() => setShow(false)}
							variant='outlined'
							sx={{ mt: 2 }}
						>
							Cancel
						</Button>
						<Button onClick={handleAddField} variant='outlined' sx={{ mt: 2 }}>
							OK
						</Button>
					</Box>
				</Box>
			)}
		</>
	)
}
export default CreateField
