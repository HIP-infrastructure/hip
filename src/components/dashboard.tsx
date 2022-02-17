import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContainer, Container, ContainerType } from '../api/types';
import CollaborativeImage from '../assets/dashboard__collaborative.png';
import PrivateImage from '../assets/dashboard__private.png';
import PublicImage from '../assets/dashboard__public.png';
import { ROUTE_PREFIX } from '../constants';
import { useAppStore } from '../store/appProvider';

const spaces = [{
    label: 'Private',
    buttonLabel: 'My private space',
    state: 'production',
    route: `${ROUTE_PREFIX}/private/sessions`,
    description: 'Password-protected space for each iEEG data provider to upload and curate own data.',
    image: PrivateImage,
    credit: 'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
    counts: [2, 2, 34]
}, {
    label: 'Collaborative',
    buttonLabel: 'Collaborative space',
    state: 'not ready',
    route: `${ROUTE_PREFIX}/collaborative/sessions`,
    description: 'Collaborative space where scientists accredited by the consortium of data providers perform iEEG data analyses on shared data.',
    image: CollaborativeImage,
    credit: 'Photo by Milad Fakurian on Unsplash, https://unsplash.com/@fakurian',
    counts: [2, 4, 54]
},
{
    label: 'Public',
    buttonLabel: 'Public space',
    state: 'not ready',
    route: `${ROUTE_PREFIX}/public/sessions`,
    description: 'Public space where public iEEG data are made available by individual iEEG data providers to be used by any scientist.',
    image: PublicImage,
    credit: 'Photo by  Jesse Martini on Unsplash, https://unsplash.com/@jessemartini',
    counts: [1, 4, 17]
}]

const Dahsboard = () => {

    const {
        user: [user],
        containers: [containers, error],
        debug: [debug],
    } = useAppStore()
    const navigate = useNavigate()

    const sessions = containers
        ?.filter((container: Container) => container.type === ContainerType.SESSION)
        .map((s: Container) => ({
            ...s,
            apps: (containers as AppContainer[]).filter(a => a.parentId === s.id),
        }))

    return <Box sx={{ width: 0.75 }}>
        <Box sx={{ ml: 2, mb: 8 }}>
            <Typography variant='h2'>The Human Intracerebral EEG Platform</Typography>
            <Typography variant='h5'>The HIP - a platform for state-of-the-art processing and international sharing of HUMAN intracerebral EEG data</Typography>
            {/* <Link href="https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/">Website</Link> */}
        </Box>
        <Box sx={{
            display: 'flex',
            width: '75vw',
            height: '560px',
            justifyContent: 'start',
            flexWrap: 'wrap',
            gap: '64px 64px',
            alignItems: 'start',
            ml: 2
        }}>
            {spaces?.map((space, i) =>
                <Card sx={{ width: 320, height: 480, display: 'flex', flexDirection: 'column' }} key={space.label}>
                    <Box sx={{ position: "relative" }}>
                        <CardMedia
                            component="img"
                            height="160"
                            src={space.image}
                            alt={space.label}
                            title={space.credit}
                        />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h5">
                                    {space?.label}
                                </Typography>
                                <Typography gutterBottom variant="caption" color="text.secondary">
                                    {/* {user?.displayName} */}
                                </Typography>
                            </Box>
                            {/* <Box>
                                <Chip
                                    label={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {space.state}
                                        </Box>}
                                    // color={color(space.state)}
                                    variant="outlined"
                                />
                            </Box> */}
                        </Box>

                        <Typography sx={{ mt: 2 }} gutterBottom variant="body2" color="text.secondary">
                            {space.description}
                            {/* {space.apps.map(app => (
                                <span key={app.name}>
                                    <strong>{app.app}</strong>: {app.state}
                                    <br />
                                    {app.error?.message}
                                </span>
                            ))} */}
                        </Typography>

                        <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
                            {space.counts[0]} <em>Opened desktop</em>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {space.counts[1]} <em> BIDS databases</em>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {space.counts[2]} <em>subjects</em>
                        </Typography>
                    </CardContent >

                    <CardActions sx={{ p: 2, alignSelf: 'end' }}>
                        <Button onClick={() => {
                            navigate(space.route)
                        }} variant="outlined">{space.buttonLabel}</Button>
                    </CardActions>
                </Card>
            )}
        </Box>

    </Box>
}

export default Dahsboard
