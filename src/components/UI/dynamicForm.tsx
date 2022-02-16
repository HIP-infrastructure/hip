import { Box, TextField, Button } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { TreeNode, File, Entity, Participant, BIDSDatabase } from '../../../api/types';



interface IDynamicForm {
    fields: Entity[];
    handleChangeFields: ((fields: Entity[]) => void)
}

const DynamicForm = ({ fields, handleChangeFields }: IDynamicForm) => {
    // const [nextFields, setNextFields] = useState(fields)

    // useEffect(() => {
    //     setNextFields(nextFields)
    // }, [fields])

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
        {/* <Box sx={{ m: 2, float: 'right' }}>
            <Button
                onClick={() => setNextFields(fields)}
                variant="outlined"
                sx={{ mt: 2 }}
            >
                Cancel
            </Button>
            <Button onClick={() => handleChangeFields(nextFields)} variant="outlined" sx={{ mt: 2 }}>OK</Button>
        </Box> */}
    </Box>
}

export default DynamicForm
