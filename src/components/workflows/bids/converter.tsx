import { Box, Button, Card, CardContent, CircularProgress, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { BIDSDatabaseResponse, BIDSDatabase, Participant } from '../../../api/types';
import TitleBar from '../../UI/titleBar';
import Databases from './databases'
import Participants from './participants'
import Files from './files'
import { getBids } from '../../../api/gatewayClientAPI'

// import {
//     getJsonFileContent, getFiles, TreeNode, search, getFileContent, createFolder
// } from '../../../api/gatewayClientAPI'
// import FileBrowser from '../../UI/fileBrowser'
// import FilePanel from './UI/filePanel'
// import CreateField from './UI/createField'
// import DatabaseInfo from './workflows/bidsConverter/databaseInfo';
// import SubjectInfo from './workflows/bidsConverter/subjectInfo';
// import DynamicForm from './UI/dynamicForm';
// import BIDSFiles from './workflows/bidsConverter/bidFiles'



const steps = ['BIDS Database', 'Participant', 'Files', 'Run'];
const boxStyle = {
    border: 1,
    borderColor: 'grey.400',
    p: 2,
    mr: 1,
    display: 'flex',
    flex: '1 0 auto',
    flexFlow: 'column',
}
const BidsConverter = () => {

    const [activeStep, setActiveStep] = useState(0);
    const [bidsDatabases, setBidsDatabases] = useState<BIDSDatabaseResponse>()
    const [selectedBidsDatabase, setSelectedBidsDatabase] = useState<BIDSDatabase>()
    const [selectedParticipant, setSelectedParticipant] = useState<Participant>()

    // const [subject, setSubject] = useState<BIDSSubject>()
    // const [searchResult1, setSearchResult1] = useState();
    // const [term, setTerm] = useState('')
    // const [folderPanes, setFolderPanes] = useState<TreeNode[][]>();
    // const [subjectFolder, setSubjectFolder] = useState<TreeNode[]>()
    // see https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    // const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);



    // const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const term = event.target.value;
    //     setTerm(term)
    //     const result = await search(term)

    //     setSearchResult1(result)
    // }

    useEffect(() => {
        getBids().then(r => {
            setBidsDatabases(r)
        })
    }, [])


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const StepNavigation = ({ activeStep, disabled = false }: { activeStep: number, disabled?: boolean }) => <>
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
            <Button sx={{ mr: 1 }} variant='contained' disabled={disabled} onClick={handleNext}>
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
                    <Box sx={boxStyle} >
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Select a BIDS Database Folder, or create a new one
                        </Typography>
                        <Databases
                            bidsDatabases={bidsDatabases}
                            handleSelectDatabase={setSelectedBidsDatabase}
                            selectedDatabase={selectedBidsDatabase} />
                        <StepNavigation disabled={!selectedBidsDatabase} activeStep={activeStep} />
                    </Box>
                </Box>
            </>
            }

            {activeStep === 1 && <>
                <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Box sx={boxStyle}  >
                        <Typography sx={{ mb: 2 }}>
                            Select a Participant or create a new one
                        </Typography>
                        <Participants
                            bidsDatabase={selectedBidsDatabase}
                            handleSelectParticipant={setSelectedParticipant}
                            selectedParticipant={selectedParticipant}
                        />
                        <StepNavigation disabled={!selectedParticipant} activeStep={activeStep} />
                    </Box>
                </Box>

            </>}
            {activeStep === 2 && <>
                <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
                    <Box sx={boxStyle}  >
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Add Files
                        </Typography>
                        <Files />
                        <StepNavigation activeStep={activeStep} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', columnGap: 2 }}>
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
                                {/* <DatabaseInfo database={database} />
                                <SubjectInfo subject={subject} /> */}
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
                            {/* <DatabaseInfo database={database} />
                            <SubjectInfo subject={subject} /> */}
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

BidsConverter.displayName = 'BidsConverter'

export default BidsConverter
