import { Box, TextField } from '@mui/material';
import React from 'react';
import { Entity } from '../../api/types';

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
                    <TextField
                        label={f.label}
                        id={f.id}
                        value={f.value}
                        onChange={(event) => handleOnChange(event, f)}
                    />
                </Box>
            )}
        </Box>
    </Box>
}

export default DynamicForm
