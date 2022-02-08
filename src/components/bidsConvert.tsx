import { Box, Button, Card, CardContent, CircularProgress, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';
import TitleBar from './titleBar';
import {
    getJsonFileContent, getFiles, TreeNode, search, getFileContent, createFolder
} from '../api/gatewayClientAPI'
import FileBrowser from './UI/fileBrowser'
import FilePanel from './UI/filePanel'
import CreateField from './UI/createField'
import DatabaseInfo from './workflows/bidsConverter/databaseInfo';
import SubjectInfo from './workflows/bidsConverter/subjectInfo';
import DynamicForm from './UI/dynamicForm';
import BIDSFiles from './workflows/bidsConverter/bidFiles'
export interface BIDSDatabase {
    path?: string;
    participants?: Participant[];
    description?: { [key: string]: string | number }
}
export interface BIDSSubject {
    id?: string;
    database?: BIDSDatabase;
    path?: string;
    participant?: Participant
}
interface Participant {
    [key: string]: string | number
}

const steps = ['BIDS Database', 'Subject', 'Files', 'Run'];

const BidsConverter = () => {

    const [activeStep, setActiveStep] = useState(0);
    const [database, setDatabase] = useState<BIDSDatabase>()
    const [subject, setSubject] = useState<BIDSSubject>()
    // const [searchResult1, setSearchResult1] = useState();
    // const [term, setTerm] = useState('')
    const [folderPanes, setFolderPanes] = useState<TreeNode[][]>();
    const [subjectFolder, setSubjectFolder] = useState<TreeNode[]>()
    // see https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

    // init
    useEffect(() => {
        handleSelectedPath(['/'])
    }, [])

    const files = async (path: string) => {
        return await getFiles(path)
    }

    const folders = async (path: string) => {
        const f = await files(path)
        return f?.filter(f => f.data.type === 'dir')
    }

    const handleSelectedPath = async (pathes: string[]) => {
        const path = pathes.join('')
        const description = await getJsonFileContent(`${path}dataset_description.json`)
        const result = await folders(path);

        if (description) {
            const participants = await readBIDSParticipants(`${path}participants.tsv`)
            setFolderPanes(prev => {
                if (!prev) return
                prev.splice(pathes.length - 1)

                return prev
            })
            setDatabase({ path, participants, description })
            setSubjectFolder(result);

        } else {
            setDatabase(undefined)


            setFolderPanes(prev => {
                if (!prev) return [result];

                prev[pathes.length - 1] = result
                prev.splice(pathes.length)

                return prev
            })
        }
        forceUpdate();
    }

    const handleSelectedSubjectPath = async (pathes: string[]) => {
        const path = pathes.join('')
        const id = pathes[pathes.length - 1].replace('/', '')

        setSubject(prevSubject => ({
            ...prevSubject,
            path,
            id
        }))

        const participant = database?.participants?.find(p => p.participant_id === id)
        setSubject(previousSubject => ({
            ...previousSubject,
            participant
        }))
    }

    const readBIDSParticipants = async (path: string) => {
        const tsv = await getFileContent(path)
        const [headers, ...rows] = tsv
            .replaceAll('"', '')
            .trim()
            .split('\\n')
            .map(r => r.split('\\t'))

        const participants: Participant[] = rows.reduce((a, r) => [
            ...a,
            Object.assign(
                ...(r.map((x, i, _, c = x.trim()) =>
                    ({ [headers[i].trim()]: isNaN(c) ? c : Number(c) })
                )))
        ], [] as Participant[])

        return participants
    }

    const handleNewSubject = () => {

        if (database?.participants) {
            const headers = Object.keys(database?.participants[0])
            setSubject(p => ({
                ...p,
                participant: Object.assign(
                    ...(headers.map(h => ({ [h]: '' })))
                )
            }))
        }
        // const bidsFolder = subject?.dbPath;
        // if (bidsFolder)
        //     createFolder(bidsFolder, 'tata')
    }

    const handleChangeParticipant = (event: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
        setSubject(previousState => ({
            ...previousState,
            participant: {
                ...(previousState ? previousState.participant : {}),
                [key]: event.target.value
            }
        }))
    }

    // const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const term = event.target.value;
    //     setTerm(term)
    //     const result = await search(term)

    //     setSearchResult1(result)
    // }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const StepNavigation = ({ activeStep }: { activeStep: number }) => <>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
                variant='contained'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
            >
                Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button sx={{ mr: 1 }} variant='contained' onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
        </Box></>

    const Title = ({ activeStep }: { activeStep: number }) => <Typography sx={{ mt: 2, mb: 1 }}>{steps[activeStep]}</Typography>

    return <>
        <TitleBar title='Bids Converter' />

        <Box sx={{ width: '100%', mt: 3 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            {activeStep === 0 && <>
                <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{
                        border: 1,
                        borderColor: 'grey.400',
                        p: 2,
                        mr: 1,
                        display: 'flex',
                        flex: '1 0 auto',
                        flexFlow: 'column'
                    }} >
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Select a BIDS Database Folder, or create a new one
                        </Typography>
                        <Box sx={{ display: 'flex', flex: '0 1 auto', maxWidth: 'inherit', overflowY: 'auto' }} >
                            <FileBrowser
                                nodesPanes={folderPanes}
                                handleSelectedPath={handleSelectedPath}
                            >
                                <Button sx={{ mt: 2, p: 1, mr: 1 }} disabled variant='outlined'>New BIDS Database</Button>
                            </FileBrowser>
                            {database &&
                                <DatabaseInfo database={database} />
                            }
                        </Box>
                        <StepNavigation activeStep={activeStep} />
                    </Box>
                    <Box sx={{
                        minWidth: 240,
                        maxWidth: 400
                    }}></Box>
                </Box>
                {/* 
                    <TextField id="search1" label="Search1" value={term} onChange={handleSearch} />
                */}

            </>
            }

            {activeStep === 1 && <>
                <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{
                        border: 1,
                        borderColor: 'grey.400',
                        p: 2,
                        mr: 1,
                        display: 'flex',
                        flex: '1 0 auto',
                        flexFlow: 'column'
                    }} >
                        <Typography sx={{ mb: 2 }}>
                            Select a Subject or create a new one
                        </Typography>
                        <Box sx={{ display: 'flex', }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {subjectFolder &&
                                    <FilePanel
                                        nodes={subjectFolder}
                                        handleSelectedPath={handleSelectedSubjectPath}
                                    />
                                }
                                <Button 
                                    sx={{ mt: 2, p: 1, mr: 1 }} 
                                    onClick={handleNewSubject} 
                                    variant="outlined">New Subject </Button>

                            </Box>
                            {subject && subject.participant &&
                                <Box sx={{
                                    overflowY: 'auto',
                                    border: 1,
                                    borderColor: 'grey.400',
                                    width: '100%',
                                    p: 2,
                                    mr: 1
                                }}>
                                    <Typography gutterBottom variant='subtitle2'>
                                        Subject
                                    </Typography>
                                    <Box>
                                        <DynamicForm
                                            fields={subject.participant}
                                            handleChangeFields={participant => {
                                                setSubject(s => ({
                                                    ...(s ? s : {}),
                                                    participant
                                                }))
                                            }} />
                                        <Box sx={{ m: 2 }}>
                                            <CreateField handleCreateField={({ key, value }) => {
                                                if (key && value)
                                                    setSubject(s => ({
                                                        ...s,
                                                        participant: {
                                                            ...s?.participant,
                                                            [key]: isNaN(value) ? value : Number(value)
                                                        }
                                                    }))
                                            }} />
                                        </Box>
                                    </Box>
                                </Box>
                            }
                        </Box>
                        <StepNavigation activeStep={activeStep} />
                    </Box>
                    <DatabaseInfo database={database} />
                </Box>

            </>}
            {activeStep === 2 && <>
                <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{
                        border: 1,
                        borderColor: 'grey.400',
                        p: 2,
                        mr: 1,
                        display: 'flex',
                        flex: '1 0 auto',
                        flexFlow: 'column',
                        justifyContent: 'flex-start'
                    }} >
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Add Files
                        </Typography>
                        <BIDSFiles subject={subject} database={database} />
                        <StepNavigation activeStep={activeStep} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', columnGap: 2 }}>
                        <DatabaseInfo database={database} />
                        <SubjectInfo subject={subject} />
                    </Box>
                </Box>
            </>}

            {activeStep === 3 && (
                <>
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{
                            border: 1,
                            borderColor: 'grey.400',
                            p: 2,
                            mr: 1,
                        }} >
                            <Typography>
                                BIDS Conversion Summary
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', columnGap: 2 }}>
                                <DatabaseInfo database={database} />
                                <SubjectInfo subject={subject} />
                            </Box>
                            {/* <Box>
                                <Button variant="outlined" sx={{ mt: 2 }}>Cancel</Button>
                                <Button variant="outlined" sx={{ mt: 2 }}>Convert</Button>
                            </Box> */}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </Box>
                </>
            )}

            {activeStep === steps.length && (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <CircularProgress size={16} />
                        <Typography>
                            All steps completed
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', columnGap: 2 }}>
                            <DatabaseInfo database={database} />
                            <SubjectInfo subject={subject} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            )}
        </Box>
    </>
}

export default BidsConverter
