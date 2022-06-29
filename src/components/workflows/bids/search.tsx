import Autocomplete from '@mui/material/Autocomplete'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { search } from '../../../api/gatewayClientAPI'
import { ISearch, ISearchResult } from '../../../api/types'

export default function Search() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [value, setValue] = React.useState<any | null>(null)
	const [inputValue, setInputValue] = React.useState('')
	const [options, setOptions] = React.useState<readonly ISearchResult[]>([])

	React.useEffect(() => {
		if (inputValue === '') {
			setOptions(value ? [value] : [])
			return undefined
		}

		search(inputValue).then((result: ISearch) => {
			const entries = result.entries.filter(e => /file/.test(e.icon))
			setOptions(entries)
		})
	}, [value, inputValue])

	return (
		<>
			<Autocomplete
				id='search-files'
				sx={{ width: 300 }}
				getOptionLabel={option => option.title}
				// filterOptions={(x) => x}
				options={options}
				autoComplete
				includeInputInList
				filterSelectedOptions
				value={value}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onChange={(event: any, newValue: any | null) => {
					setOptions(options)
					setValue(newValue)
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue)
				}}
				renderInput={params => (
					<TextField {...params} label='Search' fullWidth />
				)}
				renderOption={(props, option) => {
					return (
						<li {...props}>
							<Grid container alignItems='center'>
								<Grid item xs>
									<Typography variant='body1' color='text.primary'>
										{option.title}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{option.subline}
									</Typography>
								</Grid>
							</Grid>
						</li>
					)
				}}
			/>
		</>
	)
}
