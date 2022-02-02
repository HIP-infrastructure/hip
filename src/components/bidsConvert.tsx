import { Box, Button, CircularProgress, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import TitleBar from './titleBar';
import {
    getFiles, TreeNode, search
} from '../api/gatewayClientAPI'

import TreeSelect from './UI/treeSelect'

const steps = ['Select Database & Subject', 'Subject Informations', 'Choose Files'];

const BidsConverter = () => {

    const [activeStep, setActiveStep] = useState(0);
    const [searchResult1, setSearchResult1] = useState();
    const [term, setTerm] = useState('')
    const [nodesBoxes, setNodesBoxes] = useState<TreeNode[][]>();
    // see https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

    const files = async (path: string) => await getFiles(path)

    const handleSelectedPath = async (pathes: string[]) => {
        const result = await files(pathes.join(''));
        setNodesBoxes(prev => {
            if (!prev) return [result];

            prev[pathes.length - 1] = result
            prev.splice(pathes.length)
            console.log('prev', prev?.length)
            return prev
        })
        forceUpdate();
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
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
            >
                Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
        </Box></>

    const Title = ({ activeStep }: { activeStep: number }) => <Typography sx={{ mt: 2, mb: 1 }}>{steps[activeStep]}</Typography>

    return <>
        <TitleBar title='Bids Converter' />

        <Box sx={{ width: '100%', mt: 2 }}>
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
                <Box sx={{ display: 'flex', mt: 4 }}>
                    <Box sx={{ flex: '0 0 auto' }}>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Select Subject or create a new subject in a BIDS database
                        </Typography>
                        
                        <TreeSelect
                            nodesBoxes={nodesBoxes}
                            handleSelectedPath={handleSelectedPath}
                        />
                    </Box>
                </Box>
                {/* <Box sx={{ flex: '0 0 auto', mt: 4 }}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Select or create Subject
                    </Typography>
                    <TextField
                        id="search1"
                        label="Search1"
                        value={term}
                        onChange={handleSearch}
                    />
                    <pre>{JSON.stringify(searchResult1, null, 2)}</pre>
                </Box> */}

                <StepNavigation activeStep={activeStep} />
            </>
            }
            {activeStep === 1 && <>
                <Title activeStep={activeStep} />
                <StepNavigation activeStep={activeStep} />
            </>}
            {activeStep === 2 && <>
                <Title activeStep={activeStep} />
                <StepNavigation activeStep={activeStep} />
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
