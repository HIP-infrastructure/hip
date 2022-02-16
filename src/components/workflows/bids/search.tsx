import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { search } from '../../../api/gatewayClientAPI'
import { ISearch, ISearchResult } from '../../../api/types'

export default function Search() {
    const [value, setValue] = React.useState<any | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<readonly ISearchResult[]>([]);


    React.useEffect(() => {
        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        search(inputValue).then((result: ISearch) => {
            const entries = result.entries.filter(e => /file/.test(e.icon));
            setOptions(entries);
        })

    }, [value, inputValue]);

    return (
        <>
            <Autocomplete
                id="search-files"
                sx={{ width: 300 }}
                getOptionLabel={(option) => option.title}
                // filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                onChange={(event: any, newValue: any | null) => {
                    setOptions(options);
                    setValue(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Search" fullWidth />
                )}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item xs>
                                    <Typography variant="body1" color="text.primary">
                                        {option.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {option.subline}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
}
