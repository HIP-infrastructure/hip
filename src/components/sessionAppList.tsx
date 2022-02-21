import { PlayCircleOutlined, StopCircleOutlined } from '@mui/icons-material';
import { Avatar, CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { Application, Container, ContainerState } from '../api/types';
import { loading, color, } from '../api/utils';
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
import tvbLogo from '../assets/tvb__logo.png';
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
    mricrogl, freesurfer, dcm2niix, bidsmanager, tvb
}

const AppList = ({ session, handleToggleApp }: Session) => {
    const { availableApps } = useAppStore()

    const appInSession = ({ name }: { name: string }) => session?.apps?.find(s => s.app === name)

    const AppAvatar = ({ name, label }: { name: string, label?: string }) => <Avatar
        alt={label}
        src={logos[name]}
        sx={{ width: 32, height: 32 }}
    />

    const AppState = ({ state }: { state?: ContainerState }) => {

        if (!state) return <PlayCircleOutlined />

        if (loading(state))
            return <CircularProgress size={16} />

        if (state === ContainerState.RUNNING)
            return <StopCircleOutlined color={color(state)} />

        return <PlayCircleOutlined />
    }

    const Button = ({ app }: { app: Application }) => {
        const startedApp = appInSession({ name: app.name })
        const label = `${startedApp?.state === ContainerState.RUNNING ? 'Stop' : 'Start'} ${app.label}`

        return <ListItemButton
            sx={{ cursor: 'pointer' }}
            aria-label={label}
            title={label}
            onClick={() => handleToggleApp && handleToggleApp(app)}            >
            <ListItemIcon>
                <AppAvatar name={app.name} label={app.label} />
            </ListItemIcon>
            <ListItemText primary={app.label} />
            <AppState state={startedApp?.state} />
        </ListItemButton>
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
            <Button app={app} key={app.name} />
        ))}
    </List>
}

export default AppList
