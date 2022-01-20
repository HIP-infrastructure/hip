import * as React from 'react';
import { Box, Drawer, List, ListItemButton, ListItem, Divider, ListItemIcon, ListItemText, PaperProps } from '@mui/material';
import { Apps, Assignment, Dashboard, Folder, Monitor, Psychology, HelpCenter } from '@mui/icons-material';
import { useNavigate, useResolvedPath, useMatch } from "react-router-dom";
import { Space } from '../App';
import { APP_MARGIN_TOP } from '../constants'
import { ROUTE_PREFIX } from '../constants'

const Navigation = (props: { space: Space, PaperProps: PaperProps }): JSX.Element => {
    const { space, ...other } = props;
    const navigate = useNavigate();

    const handleClick = (route: string) => {
        navigate(route)
    };

    const categories = [
        {
            label: 'HIP',
            children: [
                {
                    route: 'dashboard',
                    label: 'Dashboard',
                    icon: <Dashboard />,
                    disabled: true

                },
                {
                    route: 'documentation',
                    label: 'Documentation',
                    icon: <HelpCenter />, 
                    disabled: true
                }]
        },
        {
            label: `${space.label} Space`,
            children: [
                {
                    route: `${space.route}/sessions`,
                    label: 'Sessions',
                    icon: <Monitor />,
                },
                {
                    route: `${space.route}/apps`,
                    label: 'App Catalog',
                    icon: <Apps />
                },
                {
                    route: `${space.route}/data`,
                    label: 'Data',
                    icon: <Folder />
                },
                {
                    route: `${space.route}/studies`,  // project ?
                    label: 'Studies',
                    icon: <Psychology />, 
                    disabled: true
                },
                {
                    route: `${space.route}/workflows`,
                    label: 'Workflows',
                    icon: <Assignment />
                },]
        },

    ]

    const isActive = (route: string) => {
        const current = `${ROUTE_PREFIX}/${route}`
        const resolved = useResolvedPath(current);
        const match = useMatch({ path: resolved.pathname, end: true });

        return match !== null
    }

    return (
        <Drawer variant="permanent" {...other} sx={{
            '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                top: `${APP_MARGIN_TOP}px`,
            },
        }}>
            <List
                sx={{ bgcolor: 'background.paper' }}
                component="nav"
            >
                {categories.map(({ label, children }) =>
                    <Box key={label} sx={{ bgcolor: '#fff' }}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText sx={{ color: '#333' }}>{label}</ListItemText>
                        </ListItem>
                        {children.map(({ label, route, icon, disabled }) => (
                            <ListItem disablePadding key={label}>
                                <ListItemButton disabled={disabled} selected={isActive(route)} onClick={() => handleClick(route)}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText>{label}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Divider sx={{ mt: 2 }} />
                    </Box>
                )}
            </List>
        </Drawer>
    );
}

export default Navigation