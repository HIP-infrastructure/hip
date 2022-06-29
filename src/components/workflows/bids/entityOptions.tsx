import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import React, { useEffect } from 'react'
import { IEntity, IOption } from '../../../api/types'

const filter = createFilterOptions<IOption>()

export default function EntityOptions({
	entity,
	onChange,
}: {
	entity?: IEntity
	onChange: (option: string) => void
}) {
	const [value, setValue] = React.useState<IOption | null>(null)

	useEffect(() => {
		if (value) onChange(value.label)
	}, [value, onChange])

	return (
		<Autocomplete
			value={value}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onBlur={(event: any) => {
				const newValue = event.target.value
				if (newValue !== '' && typeof newValue === 'string') {
					setValue({
						label: newValue,
					})
				}
			}}
			onChange={(_event, newValue) => {
				if (typeof newValue === 'string') {
					setValue({
						label: newValue,
					})
				} else if (newValue && newValue.inputValue) {
					// Create a new value from the user input
					setValue({
						label: newValue.inputValue,
					})
				} else {
					setValue(newValue)
				}
			}}
			filterOptions={(options, params) => {
				const filtered = filter(options, params)
				const { inputValue } = params

				// Suggest the creation of a new value
				const isExisting = options.some(option => inputValue === option.label)
				if (inputValue !== '' && !isExisting) {
					filtered.push({
						inputValue,
						label: `Add "${inputValue}"`,
					})
				}

				return filtered
			}}
			selectOnFocus
			handleHomeEndKeys
			id='entity-modality-widget'
			options={entity?.options || []}
			getOptionLabel={option => {
				// Value selected with enter, right from the input
				if (typeof option === 'string') {
					return option
				}
				// Add "xxx" option created dynamically
				if (option.inputValue) {
					return option.inputValue
				}
				// Regular option
				return option.label
			}}
			renderOption={(props, option) => <li {...props}>{option.label}</li>}
			freeSolo
			sx={{ width: 200 }}
			renderInput={params => <TextField {...params} label={entity?.label} />}
		/>
	)
}
