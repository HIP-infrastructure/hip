import { Box, Button, Card, CardContent, CircularProgress, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';
import TitleBar from './titleBar';
import {
    getFiles, TreeNode, search, getFileContent, createFolder
} from '../api/gatewayClientAPI'
import TreeSelect from './UI/treeSelect'
import FilePanel from './UI/filePanel'


interface BIDSDatabase {
    path?: string;
    participants?: Participant[];
}
interface BIDSSubject {
    id?: string;
    database?: BIDSDatabase;
    path?: string;
    participant?: Participant
}
interface Participant {
    [key: string]: string | number
}

const steps = ['BIDS Database', 'Subject', 'Files'];

const BidsConverter = () => {

    const [activeStep, setActiveStep] = useState(0);
    const [database, setDatabase] = useState<BIDSDatabase>()
    const [subject, setSubject] = useState<BIDSSubject>()
    // const [searchResult1, setSearchResult1] = useState();
    // const [term, setTerm] = useState('')
    const [nodesBoxes, setNodesBoxes] = useState<TreeNode[][]>();
    // see https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

    // init
    useEffect(() => {
        handleSelectedPath(['/'])
    }, [])


    const folders = async (path: string) => {
        const files = await getFiles(path)
        return files?.filter(f => f.data.type === 'dir')
    }

    const handleSelectedPath = async (pathes: string[]) => {
        const path = pathes.join('')

        const result = await folders(path);
        setNodesBoxes(prev => {
            if (!prev) return [result];

            prev[pathes.length - 1] = result
            prev.splice(pathes.length)

            return prev
        })
        forceUpdate();

        const participants = await readBIDSParticipants(`${path}participants.tsv`)
        setDatabase({ path, participants })
        setSubject(s => ({ ...s, database }))
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

    const SubjectInfo = ({ subject }: { subject?: BIDSSubject }) =>
        <Card sx={{
            minWidth: 296,
            maxWidth: 296,
            bgcolor: 'grey.50',
            m: 1
        }}>
            <CardContent>
                {database?.path && <Typography sx={{ overflowWrap: 'break-word' }}>
                    <strong>BIDS Database Folder</strong>
                    <br />
                    {database?.path}
                </Typography>}

                {database?.participants && <Typography gutterBottom>
                    Number of subjects: {database?.participants?.length}
                </Typography>}

                {subject?.path && <Typography>
                    <strong>Subject Folder</strong>
                    <br />
                    {subject?.path}
                </Typography>
                }
                {subject?.participant && <><Typography>
                    <strong>Informations</strong>
                    <br />
                </Typography>
                    <pre>{JSON.stringify(subject?.participant, null, 2)}</pre>
                </>
                }
            </CardContent>
        </Card>

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
                        m: 1,
                        display: 'flex',
                        flex: '1 0 auto',
                        flexFlow: 'column'
                    }} >
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Select a BIDS Database Folder, or create a new one
                        </Typography>
                        <Box sx={{ flex: '0 1 auto', maxWidth: 'inherit', overflowY: 'auto' }} >
                            <TreeSelect
                                nodesBoxes={nodesBoxes}
                                handleSelectedPath={handleSelectedPath}
                            />
                        </Box>
                        <StepNavigation activeStep={activeStep} />
                    </Box>
                    <SubjectInfo subject={subject} />
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
                        m: 1,
                        display: 'flex',
                        flex: '1 0 auto',
                        flexFlow: 'column'
                    }} >
                        <Typography sx={{ mb: 2 }}>
                            Select a Subject or create a new one
                        </Typography>
                        <Box sx={{ display: 'flex' }}>
                            <Box>
                                {nodesBoxes &&
                                    <FilePanel
                                        nodes={nodesBoxes[nodesBoxes?.length - 1]}
                                        handleSelectedPath={handleSelectedSubjectPath}
                                    />
                                }
                                <Button onClick={handleNewSubject} variant="outlined" sx={{ mt: 2 }}>New Subject </Button>
                            </Box>
                            <Box>
                                {subject && subject.participant &&
                                    Object.keys(subject.participant).map(key =>
                                        <Box sx={{ p: 2 }} key={key}>
                                            <TextField
                                                label={key}
                                                id={key}
                                                onChange={(event) => handleChangeParticipant(event as ChangeEvent<HTMLTextAreaElement>, key)}
                                                value={subject.participant[key]}
                                            />
                                        </Box>
                                    )}

                                <Button variant="outlined" sx={{ mt: 2 }}>New Field </Button>

                            </Box>
                        </Box>
                        <StepNavigation activeStep={activeStep} />

                    </Box>
                    <SubjectInfo subject={subject} />

                </Box>

            </>}
            {activeStep === 2 && <>
                <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{
                        border: 1,
                        borderColor: 'grey.400',
                        p: 2,
                        m: 1,
                        display: 'flex',
                        flex: '1 0 auto',
                        flexFlow: 'column'
                    }} >
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Select a BIDS Database Folder, or create a new one
                        </Typography>
                        <Box sx={{ flex: '0 1 auto', maxWidth: 'inherit', overflowY: 'auto' }} >
                            <TreeSelect
                                nodesBoxes={nodesBoxes}
                                handleSelectedPath={handleSelectedPath}
                            />
                        </Box>
                        <StepNavigation activeStep={activeStep} />
                    </Box>
                    <SubjectInfo subject={subject} />
                </Box>
            </>}


            {activeStep === steps.length && (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <CircularProgress size={16} />
                        <Typography>
                            All steps completed
                        </Typography>
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
