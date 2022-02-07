import { Box, CardContent, Typography } from '@mui/material';
import React from 'react';
import { BIDSSubject } from '../../bidsConvert';

const SubjectInfo = ({ subject }: { subject?: BIDSSubject }) =>
    <Box sx={{
        minWidth: 240,
        maxWidth: 400,
        overflowY: 'auto',
        border: 1,
        borderColor: 'grey.400',
        p: 2,
        mr: 1
    }}>
        {<Typography gutterBottom variant='subtitle2'>
            Subject
        </Typography>}

        {subject?.participant &&
            Object.keys(subject?.participant).map((k: string) =>
                <Typography key={k} variant="body2"><em>{k}</em>: {subject?.participant[k]}</Typography>)}

    </Box >

export default SubjectInfo
