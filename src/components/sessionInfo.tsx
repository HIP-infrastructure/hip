import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Container } from '../api/gatewayClientAPI';
import { DRAWER_WIDTH } from '../constants'
import { useTheme } from '@mui/material/styles';

const SessionInfo = ({ session }: { session?: Container }) => {
    const theme = useTheme();
    return (
        <Card sx={{ minWidth: DRAWER_WIDTH,
            backgroundColor: theme.palette.primary.light
        }}>
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
                    <a href={session?.url}>Direct link</a> 
                    {session?.error}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default SessionInfo 