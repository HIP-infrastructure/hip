import {
	Autocomplete,
	Box,
	createFilterOptions,
	TextField,
} from '@mui/material'
import React from 'react'
import { Entity } from '../../api/types'

const filter = createFilterOptions<string>()

interface IDynamicForm {
	fields: Entity[]
	handleChangeFields: (fields: Entity[]) => void
}

const DynamicForm = ({ fields, handleChangeFields }: IDynamicForm) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleOnChange = (event: any, field: Entity) => {
		const value = event.target.value
		const modality = field.modalities && field.modalities[value]
		const nextField: Entity = { ...field, value: modality }

		handleChangeFields(fields.map(f => (f.id === nextField.id ? nextField : f)))
	}

	return (
		<Box>
			<Box sx={{ display: 'flex' }}>
				{fields.map(f => (
					<Box key={f.id} sx={{ mr: 1 }}>
						{f.modalities ? (
							<Autocomplete
								id={f.id}
								options={f.modalities}
								onChange={event => handleOnChange(event, f)}
								sx={{ width: 300 }}
								freeSolo
								filterOptions={(options, params) => {
									const filtered = filter(options as string[], params)

									// Suggest the creation of a new value
									const isExisting = options.some(
										option => params.inputValue === option
									)
									if (params.inputValue !== '' && !isExisting) {
										filtered.push(`Add "${params.inputValue}"`)
									}

									return filtered
								}}
								renderInput={params => (
									<TextField {...params} label={f.label} />
								)}
							/>
						) : (
							<TextField
								label={f.label}
								id={f.id}
								value={f.value}
								onChange={event => handleOnChange(event, f)}
							/>
						)}
					</Box>
				))}
			</Box>
		</Box>
	)
}

export default DynamicForm
