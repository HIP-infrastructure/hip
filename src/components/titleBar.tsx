
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { AppBar, Grid, Toolbar } from '@mui/material';

interface ITitleBar {
    title: string;
    description?: string;
    button?: JSX.Element
}

const TitleBar = (props: ITitleBar) => {
    const { title, description, button } = props;

    return <>
        <AppBar
            
            component="div"
            color="primary"
            position="static"
            elevation={0}
            sx={{ zIndex: 0, borderBottom: 1 }}
        >
            <Toolbar variant="dense">
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs>
                        <Typography color="inherit" variant="h6" component="div">
                            {title}
                        </Typography>
                    </Grid>
                    {button && <Grid item>
                        {button}
                    </Grid>}
                </Grid>
            </Toolbar>
        </AppBar>
        {
            description && <Typography color="inherit" sx={{ p: 2}} gutterBottom variant="subtitle2">
                {description}
            </Typography>

        }
    </>
}

export default TitleBar