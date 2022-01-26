import { PlayCircleOutlined, StopCircleOutlined } from '@mui/icons-material';
import { Avatar, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { Application, Container, ContainerState } from '../api/gatewayClientAPI';
import anywave from '../assets/anywave__logo.png';
import bidsmanager from '../assets/bidsmanager__logo.png';
import brainstorm from '../assets/brainstorm__logo.png';
import dcm2niix from '../assets/dcm2niix__logo.png';
import freesurfer from '../assets/freesurfer__logo.png';
import fsl from '../assets/fsl__logo.png';
import hibop from '../assets/hibop__logo.png';
import localizer from '../assets/localizer__logo.png';
import mricrogl from '../assets/mrcicogl__logo.png';
import slicer from '../assets/slicer__logo.png';
import { useAppStore } from '../store/appProvider';

interface Session {
    session?: Container;
    handleToggleApp?: (app: Application) => void
}

const logos: { [key: string]: string } = {
    brainstorm,
    anywave,
    localizer,
    fsl,
    hibop,
    slicer,
    mricrogl, freesurfer, dcm2niix, bidsmanager
}

const AppList = ({ session, handleToggleApp }: Session) => {
    const { availableApps } = useAppStore()

    const AppAvatar = ({ name, label }: { name: string, label?: string }) => <Avatar
        alt={label}
        src={logos[name]}
        sx={{ width: 32, height: 32 }}
    />

    const AppActions = ({ app }: { app: Application }) => <>
        {session?.apps?.find(a => a.app === app.name) ?
            <IconButton edge="end" aria-label="stop">
                <StopCircleOutlined />
            </IconButton> :
            <IconButton edge="end" aria-label="start">
                <PlayCircleOutlined />
            </IconButton>}
        {/* <IconButton edge="end" aria-label="delete">
            <ExpandMoreOutlined />
        </IconButton> */}
    </>

    const appInSession = ({ name }: { name: string }) => session?.apps?.find(s => s.app === name)

    const AppState = ({ name }: { name: string }) => {
        const app = appInSession({ name })

        if (app?.state === ContainerState.LOADING || app?.state === ContainerState.CREATED)
            return <CircularProgress size={16} />

        if (app?.state === ContainerState.RUNNING)
            return <StopCircleOutlined />

        if (app?.state === ContainerState.UNINITIALIZED)
            return <PlayCircleOutlined />

        return null
    }

    return <List>
        <ListItem sx={{ fontSize: 22 }} >
            Applications
        </ListItem>
        {availableApps.error &&
            <Typography gutterBottom variant="body2" color="error">
                {availableApps.error.message}
            </Typography>}
        {availableApps.apps?.map((app, index) => (
            <ListItem
                key={app.name}
                onClick={() => handleToggleApp && handleToggleApp(app)}
                button={appInSession({ name: app.name }) !== undefined}
                secondaryAction={<AppState name={app.name} />}
            >
                <ListItemIcon>
                    <AppAvatar name={app.name} label={app.label} />
                </ListItemIcon>
                <ListItemText primary={app.label} />
            </ListItem>
        ))}
    </List>
}

export default AppList