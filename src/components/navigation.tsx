import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Apps, Assignment, Folder, Monitor, HelpCenter } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

const Navigation = ({ parentRoute }: { parentRoute: string }): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = (route: string) => {
        navigate(`${parentRoute}/${route}`)
    };

    const navigation = [
        {
            route: 'sessions',
            label: 'Sessions',
            icon: <Monitor />
        },
        {
            route: 'data',
            label: 'Data',
            icon: <Folder />
        },
        {
            route: 'apps',
            label: 'Apps',
            icon: <Apps />
        },
        {
            route: 'workflows',
            label: 'Workflows',
            icon: <Assignment />
        },
        {
            route: 'documentation',
            label: 'Documentation',
            icon: <HelpCenter />
        }
    ]

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
        >
            {navigation.map(n => <ListItemButton onClick={() => handleClick(n.route)}>
                <ListItemIcon>
                    {n.icon}
                </ListItemIcon>
                <ListItemText primary={n.label} />
            </ListItemButton>)}
        </List>
    );
}

export default Navigation