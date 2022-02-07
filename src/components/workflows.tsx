import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip } from '@mui/material';
import { useAppStore } from '../store/appProvider'
import TitleBar from './titleBar';

import bidsManagerLogo from '../assets/bidsmanager__logo.png'
import { Workflow } from '../api/gatewayClientAPI';
import { useNavigate } from 'react-router-dom';
import WorkflowsStatus from './UI/workflowsStatus'

const availableWorkflows: Workflow[] = [
    {
        id: 'bids-converter',
        label: 'BIDS converter',
        description: 'BIDS tools to convert user\'s data to BIDS format',
        state: 'ready',
        enabled: true
    }
];

const Workflows = () => {
    const navigate = useNavigate();

    const handleClickWorkflow = (id: string) => {
        navigate(id)
    }

    return <>
        <TitleBar title='Workflows' />
        <Box sx={{ mt: 4 }}>
            <Typography gutterBottom variant="subtitle1">
                Running Workflows
            </Typography>
            <WorkflowsStatus />
        </Box>


        <Box sx={{ mt: 4 }}>
            <Typography gutterBottom variant="subtitle1" >
                Available Workflows
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
            {availableWorkflows?.map((workflow, i) =>
                <Card sx={{ maxWidth: 320 }} key={workflow.id}>
                    <CardMedia
                        component="img"
                        height="140"
                        src={bidsManagerLogo}
                        alt={workflow.label}
                    />
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Typography gutterBottom variant="h5" sx={{ flex: 1 }}>
                                {workflow.label}
                            </Typography>
                            <Chip label={workflow.state} color={workflow.state !== 'faulty' ? "success" : "error"} variant="outlined" />
                        </Box>

                        <Typography gutterBottom variant="body2" color="text.secondary">
                            {workflow.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">

                        </Typography>

                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => handleClickWorkflow('bids')}>Start Workflow</Button>
                    </CardActions>
                </Card>
            )}
        </Box>
    </>
}

export default Workflows