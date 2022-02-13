import { Button, TextField, Box } from '@mui/material';
import React, { useState } from 'react';

interface Field {
    key?: string, value?: any
}

interface ICreateField {
    handleCreateField: ({ key, value }: Field) => void
}

const CreateField = ({ handleCreateField }: ICreateField) => {
    const [show, setShow] = useState(false)
    const [field, setField] = useState<Field>()

    const handleAddField = () => {
        if (field) {
            handleCreateField(field)
            setShow(false)
            setField({})
        }
    }

    return (
        <>
            {!show &&
                <Button onClick={() => setShow(!show)} variant="outlined" sx={{ mt: 2 }}>Add Field</Button>
            }
            {show &&
                <Box sx={{ mt: 2}}>
                    <TextField
                        label='New key'
                        id='new-key'
                        onChange={(event) => setField(f => ({ ...f, key: event.target.value }))}
                        value={field?.key}
                    />
                    <TextField
                        label='New Value'
                        id='new-value'
                        onChange={(event) => setField(f => ({ ...f, value: event.target.value }))}
                        value={field?.value}
                    />
                    <Box>
                        <Button onClick={() => setShow(false)} variant="outlined" sx={{ mt: 2 }}>Cancel</Button>
                        <Button onClick={handleAddField} variant="outlined" sx={{ mt: 2 }}>OK</Button>
                    </Box>
                </Box>
            }
        </>
    )
}
export default CreateField


