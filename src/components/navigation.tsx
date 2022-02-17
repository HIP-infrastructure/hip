import { Apps, Assignment, Dashboard, ExpandLess, ExpandMore, Folder, GroupWork, HealthAndSafety, HelpCenter, Monitor, Psychology, Public } from '@mui/icons-material';
import { Box, Collapse, Divider, Drawer, FormControlLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, PaperProps, Switch } from '@mui/material';
import React, { useState } from 'react';
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { APP_MARGIN_TOP, ROUTE_PREFIX } from '../constants';
import { useAppStore } from '../store/appProvider';

const Navigation = (props: { PaperProps: PaperProps }): JSX.Element => {
    const [spaceIsOpen, setSpaceIsOpen] = useState<{ [key: string]: boolean }>({ 'hip': true });
    const { debug: [debug, setDebug] } = useAppStore()
    const navigate = useNavigate();

    const handleClick = (route: string) => {
        navigate(route)
    };

    const handleClickSpace = (route: string) => {
        setSpaceIsOpen(o => ({
            ...o,
            [route]: !o[route]
        }))
    };

    const categories = [
        {
            label: 'HIP',
            route: 'hip',
            children: [
                {
                    route: '',
                    label: 'Dashboard',
                    icon: <Dashboard />,

                },
                {
                    route: 'apps',
                    label: 'App Catalog',
                    icon: <Apps />
                },
                {
                    route: 'documentation',
                    label: 'Documentation',
                    icon: <HelpCenter />,
                    disabled: true
                }]
        },
        {
            label: 'My Private Space',
            route: 'private',
            color: '#415795',
            icon: <HealthAndSafety />,
            children: [
                {
                    route: 'private/sessions',
                    label: 'Desktops',
                    icon: <Monitor />,
                },
                {
                    route: 'private/data',
                    label: 'Data',
                    icon: <Folder />
                },
                {
                    route: 'private/workflows',
                    label: 'Workflows',
                    icon: <Assignment />
                },
                {
                    route: 'private/studies',  // project ?
                    label: 'Studies',
                    icon: <Psychology />,
                    disabled: true
                },
            ]
        },
        {
            label: 'Collaborative Space',
            route: 'collaborative',
            color: '#9c406e',
            icon: <GroupWork />,
            children: [
                {
                    route: 'collaborative/sessions',
                    label: 'Desktops',
                    icon: <Monitor />,
                },
                {
                    route: 'collaborative/data',
                    label: 'Data',
                    icon: <Folder />
                },
                {
                    route: 'collaborative/workflows',
                    label: 'Workflows',
                    icon: <Assignment />
                },
                {
                    route: 'collaborative/studies',  // project ?
                    label: 'Studies',
                    icon: <Psychology />,
                    disabled: true
                },
            ]
        },
        {
            label: 'Public Space',
            route: 'public',
            color: '#5f5d5c',
            icon: <Public />,
            children: [
                {
                    route: 'public/sessions',
                    label: 'Desktops',
                    icon: <Monitor />,
                },
                {
                    route: 'public/data',
                    label: 'Data',
                    icon: <Folder />
                },
                {
                    route: 'public/workflows',
                    label: 'Workflows',
                    icon: <Assignment />
                },
                {
                    route: 'public/studies',  // project ?
                    label: 'Studies',
                    icon: <Psychology />,
                    disabled: true
                },
            ]
        },
    ]

    const isActive = (route: string) => {
        const current = `${ROUTE_PREFIX}/${route}`
        const resolved = useResolvedPath(current);
        const match = useMatch({ path: resolved.pathname, end: true });

        // open space for current selected tab
        if (match) {
            const space = route.split('/')[0]
            if (!spaceIsOpen[space]) {
                setSpaceIsOpen(o => ({
                    ...o,
                    [space]: true
                }))
            }
        }

        return match !== null
    }

    return (
        <Drawer variant="permanent" {...props} sx={{
            '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                top: `${APP_MARGIN_TOP}px`,
            },
        }}>
            <List
                sx={{ bgcolor: 'background.paper' }}
                component="nav"
            >
                {categories.map(({ label, icon, color, children, route }) =>
                    <Box key={label} sx={{ bgcolor: '#fff' }}>
                        <ListItemButton
                            sx={{ mt: 2 }}
                            onClick={() => handleClickSpace(route)}>
                            {/* {icon && <ListItemIcon>{icon}</ListItemIcon>} */}
                            <ListItemText>{label}</ListItemText>
                            {spaceIsOpen[route] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse sx={{ mt: 1 }} in={spaceIsOpen[route]} timeout="auto" unmountOnExit>
                            {children.map(({ label, route, icon, disabled }) => (
                                <ListItem disablePadding key={label}>
                                    <ListItemButton
                                        sx={{ pl: 3 }}
                                        disabled={disabled}
                                        selected={isActive(route)}
                                        onClick={() => handleClick(route)}
                                    >
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText>{label}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Collapse>
                        <Divider sx={{ mt: 2 }} />
                    </Box>
                )}
            </List>
            <Box sx={{ ml: 2, mt: 8 }} >
                <FormControlLabel
                    control={<Switch
                        checked={debug}
                        onChange={() => setDebug(!debug)} />}
                    label="Debug" />
            </Box>
        </Drawer>
    );
}

export default Navigation
