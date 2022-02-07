import DynamicForm from '../bidsConverter/../../UI/dynamicForm';
import { Box, Button, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    getJsonFileContent, getFiles, TreeNode, search, getFileContent, createFolder
} from '../../../api/gatewayClientAPI'
import { BIDSDatabase, BIDSSubject } from '../../bidsConvert';
import FileBrowser from '../../UI/fileBrowser';

interface IBIDSFiles {
    subject?: BIDSSubject
    database?: BIDSDatabase
}

interface Modality {
    name: string;
    type: string
}

interface Session {
    label: string
}

interface File {
    path: string;
    session: Session;
    modality: Modality
}

const modalities: Modality[] = [
    { name: 'T1w', type: 'Anat' },
    { name: 'T2w', type: 'Anat' },
    { name: 'T1rho', type: 'Anat' },
    { name: 'T2start', type: 'Anat' },
    { name: 'FLAIR', type: 'Anat' },
    { name: 'CT', type: 'Anat' },
    { name: 'ieeg', type: 'IEEG' },
    { name: 'electrodes', type: 'IeegGlobalSidecars' },
    { name: 'coordsystem', type: 'IeegGlobalSidecars' },
    { name: 'photo', type: 'IeegGlobalSidecars' },
]

const entities1 = {
    Anat: ['defacemask', 'MESE MEGRE', 'VFA', 'IRT1', 'MP2RAGE', 'MPM MTS', 'MTR'
    ]
}

const entities = {
    Session: '',
    Acquisition: '',
    Reconstruction: '',
    Processed: ''
}

const BIDSFiles = ({ subject, database }: IBIDSFiles) => {
    const [filesPanes, setFilesPanes] = useState<TreeNode[][]>();
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [bidsFiles, setBidsFiles] = useState<File[]>()

    useEffect(() => {
        files('/').then(f => setFilesPanes([f]))
    }, [])

    const files = async (path: string) => {
        return await getFiles(path)
    }

    const handleSelectedPath = async (pathes: string[]) => {
        const path = pathes.join('')
        const result = await files(path);
        setFilesPanes(prev => {
            if (!prev) return [result];

            prev[pathes.length - 1] = result
            prev.splice(pathes.length)

            return prev
        })
        forceUpdate();
    }

    const handleAddFile = () => {

    }

    return <>

        <Box>
            <InputLabel id="bids-modality">Modality</InputLabel>
            <Select
                labelId="bids-modality"
                id="bids-modality-select"
                value={file?.modality}
                label="Modality"
                onChange={(event) => {
                    setFile(f => f ? ({ ...f, modality: event?.target.value }) : ({ modality: event.target.value }))
                }}
            >
                {modalities.map(m => <MenuItem value={m.name}>{m.name}</MenuItem>)}
            </Select>

        </Box>
        <Box sx={{
            display: 'flex',
            flex: '0 1 auto',
            mt: 2,
            maxWidth: 'inherit',
            overflowY: 'auto'
        }} >
            <Box sx={{ mr: 1 }}>
                <DynamicForm
                    fields={entities}
                    handleChangeFields={entity => {
                        // setSubject(s => ({
                        //     ...(s ? s : {}),
                        //     participant
                        // }))
                    }} />
            </Box>

            <FileBrowser
                nodesPanes={filesPanes}
                handleSelectedPath={handleSelectedPath}
            />
        </Box>

        <Button variant="outlined" sx={{ mt: 2 }}>Add file</Button>

        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>File</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Modality</TableCell>
                            <TableCell align="right">Session</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[].map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                                <TableCell align="right">{row.elapsed}</TableCell>
                                <TableCell align="right">{row.progress}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    </>
}

export default BIDSFiles