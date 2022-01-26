import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import * as React from 'react';
import { Container, color } from '../api/gatewayClientAPI';
import { DRAWER_WIDTH } from '../constants';

const SessionInfo = ({ session }: { session?: Container }) => {

    return (
        <Card sx={{
            minWidth: DRAWER_WIDTH,
        }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                    {session?.user}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" gutterBottom component="div">
                        Session #{session?.name}
                    </Typography>
                    <Chip
                        label={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {session?.state}
                            </Box>}
                        color={color(session?.state)}
                        variant="outlined"
                    />
                </Box>
                <Typography variant="body2">
                    <a href={session?.url}>Open in external window</a>
                    {session?.error}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default SessionInfo 