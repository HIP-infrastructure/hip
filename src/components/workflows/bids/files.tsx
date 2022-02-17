import { Box, Button, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getFiles } from '../../../api/gatewayClientAPI';
import { BIDSDatabase, Entity, File, Participant, TreeNode } from '../../../api/types';
import DynamicForm from '../../UI/dynamicForm';
import FileBrowser from '../../UI/fileBrowser';

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
    handleSelectFiles: (files: File[]) => void;
}

const Files = ({ selectedBidsDatabase, selectedParticipant, selectedFiles, handleSelectFiles }: Props): JSX.Element => {
    const [filesPanes, setFilesPanes] = useState<TreeNode[][]>();
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [currentBidsFile, setCurrentBidsFile] = useState<File>()

    useEffect(() => {
        populateEntities('T1w')
        files('/').then(f => setFilesPanes([f]))
    }, [])

    useEffect(() => {
        console.log(currentBidsFile)
    }, [currentBidsFile])

    const files = async (path: string) => {
        return await getFiles(path)
    }

    const handleSelectedNode = async (node?: TreeNode) => {

        if (node?.data.type === 'file') {
            setCurrentBidsFile(f => ({ ...f, path: node?.data.path }))

            return
        }

        setCurrentBidsFile(f => ({ ...f, path: undefined }))
        const pathes = node?.data.path.split('/').map(p => `${p}/`)
        const path = node?.data.path

        if (pathes && path) {
            const result = await files(path);

            setFilesPanes(prev => {
                if (!prev) return [result];

                prev[pathes.length - 1] = result
                prev.splice(pathes.length)

                return prev
            })
            forceUpdate();
        }

    }

    const populateEntities = (modality: string) => {
        if (modality) {
            const type = modalities.find(b => b.name === modality)?.type
            const dataTypes = bIDSDataType.find(b => b.name === type)?.entities
            const entities: Entity[] | undefined = dataTypes?.map(e =>
                e.entity.id === 'subject' ?
                    ({
                        id: e.entity.id,
                        label: e.entity.label,
                        required: e.required,
                        type: 'string',
                        value: selectedParticipant?.participant_id,
                        disabled: true
                    }) : ({
                        id: e.entity.id,
                        label: e.entity.label,
                        required: e.required,
                        type: 'string',
                        value: '',
                    }))

            if (entities) {
                setCurrentBidsFile(
                    ({
                        modality,
                        entities
                    }))
            }
        }
    }

    const handleSelectModality = (event: SelectChangeEvent) => {
        const modality = event?.target.value;
        populateEntities(modality)
    }

    const handleChangeEntities = (entities: Entity[]) => {
        setCurrentBidsFile(f => ({ ...f, entities }))
    }

    const handleAddFile = () => {
        if (currentBidsFile) {
            handleSelectFiles([...(selectedFiles || []), currentBidsFile])
        }

        setFilesPanes(prev => {
            if (!prev) return [];

            prev.splice(1)

            return prev
        })
        forceUpdate();

        populateEntities('T1w')
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
            <InputLabel id="ids-modality">Modality</InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px 8px', mb: 2 }}>
                <Box>

                    <Select
                        labelId="bids-modality"
                        id="bids-modality-select"
                        value={currentBidsFile?.modality || 'T1w'}
                        label="Modality"
                        onChange={handleSelectModality}
                    >
                        {modalities.map(m =>
                            <MenuItem key={m.name} value={m.name}>
                                {m.name}
                            </MenuItem>
                        )}
                    </Select>
                </Box>
                {currentBidsFile?.entities &&
                    <DynamicForm
                        fields={currentBidsFile?.entities}
                        handleChangeFields={handleChangeEntities}
                    />
                }
            </Box>
            <Box sx={{ width: 960 }}>
                {/* <Search /> */}
                <Box sx={{
                    width: 960,
                    border: 1,
                    borderColor: 'grey.300',
                    overflowY: 'auto',
                    p: 1
                }}>
                    <FileBrowser
                        nodesPanes={filesPanes}
                        handleSelectedNode={handleSelectedNode}
                    />
                </Box>
                <Box >
                    <Button
                        disabled={
                            !(currentBidsFile?.entities &&
                                currentBidsFile?.modality &&
                                currentBidsFile?.path)
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
                                    <TableCell key={k}>
                                        {file?.entities?.find(f =>
                                            f.id === bIDSEntity[k].id)?.value}
                                    </TableCell>)}
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

