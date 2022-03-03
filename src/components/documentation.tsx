import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import * as React from 'react';
import TechnicalDocumentation from '../assets/documentation__technical.png';
import UserDocumentation from '../assets/documentation__user.png';
import WebsiteDocumentation from '../assets/documentation__website.png';
import TitleBar from './UI/titleBar';


const Documentation = () => {

    const handleClickLink = (url: string) => {
        window.open(url)
    }

    const docs = [{
        label: 'HIP User Documentation',
        buttonLabel: 'User Documentation',
        url: `https://hip-infrastructure.github.io/`,
        description: 'HIP guides, tutorials, datasets, Troubleshooting, FAQ and apps',
        image: UserDocumentation,
        credit: 'Photo by Maksym Kaharlytskyi on Unsplash, https://unsplash.com/@qwitka',
    }, {
        label: 'HIP Technical Documentation',
        buttonLabel: 'Technical Documentation',
        url: `https://github.com/HIP-infrastructure/hip-doc`,
        description: 'Architecture, Components, GitHub repositories',
        image: TechnicalDocumentation,
        credit: 'Photo by Maksym Kaleidico on Unsplash, https://unsplash.com/@kaleidico',
    },
    {
        label: 'HIP Website',
        buttonLabel: 'Website',
        url: `https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/`,
        description: 'HIP official webpage on the Human Brain Project',
        image: WebsiteDocumentation,
        credit: 'Photo by Austin Chan on Unsplash, https://unsplash.com/@austinchan',
    }]  


    return <>
        <TitleBar title='Documentation' />

        <Box sx={{ width: 0.75, mt: 2 }}>
            <Box sx={{
                display: 'flex',
                width: '75vw',
                justifyContent: 'start',
                gap: '64px 64px',
                alignItems: 'start'
            }}>
                {docs?.map((doc, i) =>
                    <Card sx={{ width: 320, display: 'flex', flexDirection: 'column' }} key={doc.label}>
                        <Box sx={{ position: "relative" }}>
                            <CardMedia
                                component="img"
                                height="160"
                                src={doc.image}
                                alt={doc.label}
                                title={doc.credit}
                            />
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h5">
                                        {doc?.label}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography sx={{ mt: 2 }} gutterBottom variant="body2" color="text.secondary">
                                {doc.description}
                            </Typography>
                            <Typography
                                onClick={() => { handleClickLink(doc.url) }}
                                gutterBottom
                                variant="caption"
                                color="text.secondary"
                            >
                                {doc.url}
                            </Typography>
                        </CardContent >

                        <CardActions sx={{ p: 2, alignSelf: 'end' }}>
                            <Button
                                onClick={() => { handleClickLink(doc.url) }}
                                variant="outlined">
                                {doc.buttonLabel}
                            </Button>
                        </CardActions>
                    </Card>
                )}
            </Box>

        </Box>


    </>
}



export default Documentation
