import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { BIDSDatabase, File, Participant } from '../../../api/types';

export const bIDSEntity = {
    subject: {
        id: 'subject',
        label: 'Subject',
        format: 'sub-'
    },
    session: {
        id: 'session',
        label: 'Session',
        format: 'ses-',
        modalities: [
            'presurgery',
            'postsurgery'
        ]
    },
    task: {
        id: 'task',
        label: 'Task',
        format: 'task-',
        modalities: [
            'eyesclosed'
        ]
    },
    acquisition: {
        id: 'acquisition',
        label: 'Acquisition',
        format: 'acq-',
        modalities: [
            'lowres'
        ]
    },
    reconstruction: {
        id: 'reconstruction',
        label: 'Reconstruction',
        format: 'rec-'
    },
    run: {
        id: 'run',
        label: 'Run',
        format: 'run-'
    },
    correspondingmodality: {
        id: 'correspondingmodality',
        label: 'Corresponding Modality',
        format: 'mod-'
    },
    echo: {
        id: 'echo',
        label: 'Echo',
        format: 'echo-'
    }
}

export const bIDSDataType = [
    {
        name: 'anat',
        entities: [
            {
                entity: bIDSEntity.subject,
                required: true
            },
            {
                entity: bIDSEntity.session,
                required: false
            },
            {
                entity: bIDSEntity.acquisition,
                required: false
            },
        ],
    },
    {
        name: 'ieeg',
        entities: [
            {
                entity: bIDSEntity.subject,
                required: true
            },
            {
                entity: bIDSEntity.session,
                required: false
            },
            {
                entity: bIDSEntity.task,
                required: false
            },
            {
                entity: bIDSEntity.acquisition,
                required: false
            },
            {
                entity: bIDSEntity.run,
                required: false
            }
        ]
        // dwi = 'dwi',
        // fmap = 'fmap',
        // func = 'func',
        // perf = 'perf',
        // ieeg = 'ieeg',
        // meg = 'meg',
        // pet = 'pet',
        // beh = 'beh'
    }
]

const modalities = [
    { name: 'T1w', type: 'anat' },
    { name: 'T2w', type: 'anat' },
    { name: 'T1rho', type: 'anat' },
    { name: 'T2start', type: 'anat' },
    { name: 'FLAIR', type: 'anat' },
    { name: 'CT', type: 'anat' },
    { name: 'ieeg', type: 'ieeg' },
    { name: 'electrodes', type: 'ieeg' },
    { name: 'coordsystem', type: 'ieeg' },
    { name: 'photo', type: 'ieeg' },
]

interface Props {
    selectedBidsDatabase?: BIDSDatabase;
    selectedParticipant?: Participant;
    selectedFiles: File[];
}

const Summary = ({ selectedBidsDatabase, selectedParticipant, selectedFiles }: Props): JSX.Element => {


    return <Box>

        <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <strong>BIDS Database: </strong>{selectedBidsDatabase?.Name}
            </Typography>
        </Box>
        <Box sx={{ mt: 4, mb: 4 }}>
            <TableContainer component={Paper}>
                <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Modality</TableCell>
                            <TableCell>Path</TableCell>
                            {Object.keys(bIDSEntity).map((k: any) =>
                                <TableCell
                                    key={bIDSEntity[k].id}>
                                    {bIDSEntity[k].label}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedFiles?.reverse().map((file) => (
                            <TableRow
                                key={file.path}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{file.modality}</TableCell>
                                <TableCell>{file.path}</TableCell>
                                {Object.keys(bIDSEntity).map((k: string) =>
                                    <TableCell key={k}>
                                        {file?.entities?.find(f =>
                                            f.id === bIDSEntity[k].id)?.value}
                                    </TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Box>
}

Summary.displayName = 'Summary'
export default Summary

