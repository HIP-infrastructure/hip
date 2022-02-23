import { Autocomplete, Box, createFilterOptions, TextField } from '@mui/material';
import React from 'react';
import { Entity } from '../../api/types';

const filter = createFilterOptions<string>();

interface IDynamicForm {
    fields: Entity[];
    handleChangeFields: ((fields: Entity[]) => void)
}

const DynamicForm = ({ fields, handleChangeFields }: IDynamicForm) => {

    const handleOnChange = (event: any, field: Entity) => {
        const value = event.target.value
        const nextField: Entity = { ...field, value }

        handleChangeFields(fields.map(f =>
            f.id === nextField.id ? nextField : f)
        )
    }

    return <Box>
        <Box sx={{ display: 'flex' }}>
            {fields.map(f =>
                <Box key={f.id} sx={{ mr: 1 }}>
                    {f.modalities ?
                        <Autocomplete
                            id={f.id}
                            options={f.modalities}
                            onChange={(event) => handleOnChange(event, f)}
                            sx={{ width: 300 }}
                            freeSolo
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                // Suggest the creation of a new value
                                const isExisting = options.some((option) => params === option);
                                if (params !== '' && !isExisting) {
                                    filtered.push(
                                        `Add "${params}"`,
                                    );
                                }

                                return filtered;
                            }}
                            renderInput={(params) => <TextField {...params} label={f.label} />}
                        />
                        :
                        <TextField
                            label={f.label}
                            id={f.id}
                            value={f.value}
                            onChange={(event) => handleOnChange(event, f)}
                        />
                    }

                </Box>
            )}
        </Box>
    </Box>
}

export default DynamicForm
