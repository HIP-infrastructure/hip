import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/appProvider'
import { Application, Container } from '../api/gatewayClientAPI'
import { Avatar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { PlayCircleOutlined, StopCircleOutlined } from '@mui/icons-material';

import brainstorm from '../assets/brainstorm__logo.png'
import anywave from '../assets/anywave__logo.png'
import localizer from '../assets/localizer__logo.png'
import fsl from '../assets/fsl__logo.png'
import hibop from '../assets/hibop__logo.png'
import slicer from '../assets/slicer__logo.png'
import mricrogl from '../assets/mrcicogl__logo.png'
import freesurfer from '../assets/freesurfer__logo.png'
import dcm2niix from '../assets/dcm2niix__logo.png'
import bidsmanager from '../assets/bidsmanager__logo.png'

interface Session {
    session?: Container
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

const AppList = ({ session }: Session) => {
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

    return <List>
        <ListItem sx={{ fontSize: 22 }}>
            Applications
        </ListItem>
        {availableApps?.map((app, index) => (
            <ListItem button key={app.name}
                // secondaryAction={
                //     <AppActions app={app} />
                // }
            >
                <ListItemIcon>
                    <AppAvatar name={app.name} label={app.label} />
                </ListItemIcon>
                <ListItemText primary={app.name} />
            </ListItem>
        ))}
    </List>
}

export default AppList