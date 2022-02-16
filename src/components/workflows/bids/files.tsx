import React, { useState, useEffect, ChangeEvent } from 'react';
import Search from './search'
import FileBrowser from '../../UI/fileBrowser';
import { TreeNode, File, Entity, Participant, BIDSDatabase } from '../../../api/types';
import { getFiles } from '../../../api/gatewayClientAPI';
import { Box, Button, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import DynamicForm from '../../UI/dynamicForm';

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
    },
    task: {
        id: 'task',
        label: 'Task',
        format: 'task-'
    },
    acquisition: {
        id: 'acquisition',
        label: 'Acquisition',
        format: 'acq-'
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
            // {
            //     entity: bIDSEntity.subject,
            //     required: true
            // },
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
            // {
            //     entity: bIDSEntity.subject,
            //     required: true
            // },
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
    handleSelectFiles: (files: File[]) => void;
}

const Files = ({ selectedBidsDatabase, selectedParticipant, selectedFiles, handleSelectFiles }: Props): JSX.Element => {
    const currentParticipant = {
        path: undefined,
        modality: 'T1w',
        entities: [
            {
                id: 'subject',
                label: 'Subject',
                required: true,
                type: 'string',
                value: selectedParticipant?.participant_id,
            }
        ]
    }
    const [filesPanes, setFilesPanes] = useState<TreeNode[][]>();
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [currentBidsFile, setCurrentBidsFile] = useState<File>(currentParticipant)


    useEffect(() => {
        files('/').then(f => setFilesPanes([f]))
    }, [])

    const files = async (path: string) => {
        return await getFiles(path)
    }

    const handleSelectedPath = async (pathes: string[]) => {
        const path = pathes.join('')
        const result = await files(path);
        setCurrentBidsFile(f => ({ ...f, path }))
        setFilesPanes(prev => {
            if (!prev) return [result];

            prev[pathes.length - 1] = result
            prev.splice(pathes.length)

            return prev
        })
        forceUpdate();
    }

    const handleSelectModality = (event: SelectChangeEvent) => {
        const modality = event?.target.value;
        if (modality) {
            const type = modalities.find(b => b.name === modality)?.type
            const dataTypes = bIDSDataType.find(b => b.name === type)?.entities
            const entities: Entity[] | undefined = dataTypes?.map(e => ({
                id: e.entity.id,
                label: e.entity.label,
                required: e.required,
                type: 'string',
                value: '',
            }))

            if (entities && currentBidsFile)
                setCurrentBidsFile(
                    ({
                        ...currentBidsFile,
                        modality,
                        entities: [
                            ...currentParticipant.entities,
                            ...entities
                        ]
                    }))
        }
    }

    const handleChangeEntities = (entities: Entity[]) => {
        setCurrentBidsFile(f => f ? ({ ...f, entities }) : ({ entities }))
    }

    const handleAddFile = () => {
        if (currentBidsFile) {
            handleSelectFiles([...(selectedFiles || []), currentBidsFile])
        }

        setCurrentBidsFile({})
    }

    const boxStyle = {
        border: 1,
        borderColor: 'grey.400',
        p: 2,
        mr: 1,
        display: 'flex',
        flex: '1 0 auto',
        flexFlow: 'column',
    }

    return <Box>
        <Box sx={boxStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px 8px' }}>
                <Box>
                    <InputLabel id="ids-modality">Modality</InputLabel>
                    <Select
                        labelId="bids-modality"
                        id="bids-modality-select"
                        value={currentBidsFile?.modality}
                        label="Modality"
                        onChange={handleSelectModality}
                    >
                        {modalities.map(m => <MenuItem key={m.name} value={m.name}>{m.name}</MenuItem>)}
                    </Select>
                </Box>
                {currentBidsFile?.entities &&
                    <DynamicForm
                        fields={currentBidsFile?.entities}
                        handleChangeFields={handleChangeEntities}
                    />
                }
            </Box>
            <Box sx={{ width: 800 }}>
                <Search />
                <Box sx={{
                    width: 800,
                    border: 1,
                    borderColor: 'grey.300',
                    overflowY: 'auto',
                    p: 1
                }}>
                    <FileBrowser
                        nodesPanes={filesPanes}
                        handleSelectedPath={handleSelectedPath}
                    >

                    </FileBrowser>
                </Box>
                <Box >
                    <Button
                        disabled={
                            !(currentBidsFile.entities &&
                                currentBidsFile.modality &&
                                currentBidsFile.path)
                        }
                        sx={{ float: 'right', mt: 2, mb: 2 }}
                        variant='contained'
                        onClick={handleAddFile}
                    >
                        Add file
                    </Button>
                </Box>
            </Box>
        </Box>
        <Box sx={{ mt: 4, mb: 4 }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Modality</TableCell>
                            <TableCell>Path</TableCell>
                            {Object.keys(bIDSEntity).map((k: string) => <TableCell>{bIDSEntity[k].label}</TableCell>)}
                            <TableCell>Actions</TableCell>
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
                                    <TableCell>{file?.entities?.find(f => f.id === bIDSEntity[k].id)?.value}</TableCell>)}
                                <TableCell align="right">
                                    <Button variant="outlined" size="small" sx={{ mt: 2 }}>Edit</Button>
                                    <Button variant="outlined" size="small" sx={{ mt: 2 }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Box>
}

Files.displayName = 'Files'
export default Files

