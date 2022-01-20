import * as React from 'react';
import { Box, Drawer, List, ListItemButton, ListItem, Divider, ListItemIcon, ListItemText, PaperProps } from '@mui/material';
import { Apps, Assignment, Dashboard, Folder, FolderShared, Monitor, Psychology, HelpCenter } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { Space } from '../App';
import { APP_MARGIN_TOP } from '../constants'

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

                },
                {
                    route: 'documentation',
                    label: 'Documentation',
                    icon: <HelpCenter />
                }]
        },
        {
            label: `${space.label} Space`,
            children: [
                {
                    route: `${space.route}/sessions`,
                    label: 'Sessions',
                    icon: <Monitor />,
                    active: true

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
                    icon: <Psychology />
                },
                {
                    route: `${space.route}/workflows`,
                    label: 'Workflows',
                    icon: <Assignment />
                },]
        },

    ]

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
                        {children.map(({ label, route, icon, active }) => (
                            <ListItem disablePadding key={label}>
                                <ListItemButton selected={active} onClick={() => handleClick(route)}>
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