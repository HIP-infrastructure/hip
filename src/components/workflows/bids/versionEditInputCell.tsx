import * as React from 'react'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'

function renderRating(params: GridRenderCellParams<number>) {
	return <Rating readOnly value={params.value} />
}

function RatingEditInputCell(props: GridRenderCellParams<number>) {
	const { id, value, api, field } = props

	const handleChange = async event => {
		api.setEditCellValue(
			{ id, field, value: Number(event.target.value) },
			event
		)
		// Check if the event is not from the keyboard
		// https://github.com/facebook/react/issues/7407
		if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
			// Wait for the validation to run
			const isValid = await api.commitCellChange({ id, field })
			if (isValid) {
				api.setCellMode(id, field, 'view')
			}
		}
	}

	const handleRef = element => {
		if (element) {
			element.querySelector(`input[value="${value}"]`).focus()
		}
	}

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
			<Rating
				ref={handleRef}
				name='rating'
				precision={1}
				value={value}
				onChange={handleChange}
			/>
		</Box>
	)
}

function renderRatingEditInputCell(params) {
	return <RatingEditInputCell {...params} />
}

export default function RenderRatingEditCellGrid() {
	return (
		<div style={{ height: 250, width: '100%' }}>
			<DataGrid rows={rows} columns={columns} />
		</div>
	)
}

const columns = [
	{
		field: 'places',
		headerName: 'Places',
		width: 120,
	},
	{
		field: 'rating',
		headerName: 'Rating',
		renderCell: renderRating,
		renderEditCell: renderRatingEditInputCell,
		editable: true,
		width: 180,
		type: 'number',
	},
]

const rows = [
	{ id: 1, places: 'Barcelona', rating: 5 },
	{ id: 2, places: 'Rio de Janeiro', rating: 4 },
	{ id: 3, places: 'London', rating: 3 },
	{ id: 4, places: 'New York', rating: 2 },
]
