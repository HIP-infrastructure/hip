import { Box, TextField, Button } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';

interface Field {
    [key: string]: string | number
}

interface IDynamicForm {
    fields: Field;
    handleChangeFields: ((fields: Field) => void)
}

const DynamicForm = ({ fields, handleChangeFields }: IDynamicForm) => {
    const [nextFields, setNextFields] = useState(fields)

    useEffect(() => {
        setNextFields(fields)
    }, [fields])

    return <Box sx={{ mb: 2 }}>
        <Box sx={{ height: 292, display: 'flex', flexFlow: 'column wrap', mb: 1 }}>
            {Object.keys(nextFields).map(key =>
                <Box key={key} sx={{ p: 1 }}>
                    <TextField
                        label={key}
                        id={key}
                        onChange={(event) => setNextFields(f => ({ ...f, [key]: event.target.value }))}
                        value={nextFields[key]}
                    />
                </Box>
            )}
        </Box>
        <Box sx={{ m: 2, float: 'right' }}>
            <Button onClick={() => setNextFields(fields)} variant="outlined" sx={{ mt: 2 }}>Cancel</Button>
            <Button onClick={() => handleChangeFields(nextFields)} variant="outlined" sx={{ mt: 2 }}>OK</Button>
        </Box>
    </Box>
}

export default DynamicForm
