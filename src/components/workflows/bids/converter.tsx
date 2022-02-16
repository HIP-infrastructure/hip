import { Box, Button, Card, CardContent, CircularProgress, Grid, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { BIDSDatabaseResponse, BIDSDatabase, Participant, File } from '../../../api/types';
import TitleBar from '../../UI/titleBar';
import Databases from './databases'
import Participants from './participants'
import Files from './files'
import { getBids } from '../../../api/gatewayClientAPI'

const steps = ['BIDS Database', 'Participant', 'Files', 'Convert'];
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
    const [selectedFiles, setSelectedFiles] = useState<File[]>()

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
                        <Files
                            bidsDatabase={selectedBidsDatabase}
                            selectedParticipant={selectedParticipant}
                            selectedFiles={selectedFiles}
                            handleSelectFiles={setSelectedFiles}

                        />
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

                            <Typography>
                                {selectedBidsDatabase?.Name}
                            </Typography>


                            <Grid columns={{ md: 12 }} container>
                                <Grid item>
                                    <pre>{JSON.stringify(selectedParticipant, null, 2)}</pre>
                                </Grid>
                                <Grid item>
                                    <pre>{JSON.stringify(selectedFiles, null, 2)}</pre>
                                </Grid>
                            </Grid>
                            {<Box>

                            </Box>}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {/* <Button onClick={handleReset}>Reset</Button> */}
                            <Button variant="contained" sx={{ mt: 2 }}>Convert</Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    </>
}

BidsConverter.displayName = 'BidsConverter'

export default BidsConverter
