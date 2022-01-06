import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Container } from '../api/gatewayClientAPI';
import { DRAWER_WIDTH } from '../constants'

const SessionInfo = ({ session }: { session?: Container }) => {
    return (
        <Card sx={{ minWidth: DRAWER_WIDTH }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {session?.user}
                </Typography>
                <Typography variant="h5" component="div">
                    Session #{session?.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {session?.state}
                </Typography>
                <Typography variant="body2">
                    {session?.error}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default SessionInfo 