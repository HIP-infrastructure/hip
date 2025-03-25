import * as React from 'react'
import { useState, useEffect } from 'react'
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Typography,
} from '@mui/material'
import { API_GATEWAY, fileContent } from '../../api/gatewayClientAPI'
import { HIPProject } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'

interface Props {
    project: HIPProject | null
}

const DescriptionCard = ({ project }: Props) => {
    const { showNotif } = useNotification()
    const [descriptionContent, setDescriptionContent] = useState<string>('')
    const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false)

    useEffect(() => {
        if (project) {
            setIsLoadingDescription(true);
            const token = window.OC.requestToken;
            
            // Use the actual project path for the description file
            // const path = `/GROUP_FOLDER/${project.name}/description.md`;
            const path = `/COLLAB_DESCRIPTION/${project.name}/description.md`;

            fileContent(path)
                .then(response => {
                    setDescriptionContent(response);
                    setIsLoadingDescription(false);
                })
                .catch(error => {
                    //console.error('Error fetching description:', error);
                    showNotif('Error loading project description', 'error');
                    setDescriptionContent('');
                    setIsLoadingDescription(false);
                });
        }
    }, [project])

    return (
        <>
            {project && (
                <Card
                    sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia
                            component='img'
                            height='160'
                            src={`${API_GATEWAY}/public/media/651069478_synapses__technology__meta___database__information__network__neural_path__futuristic_and_medical__re.png`}
                            alt="Project Description"
                            title="Project Description"
                        />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant='h5' sx={{ mb: 2 }}>
                            Project Description
                        </Typography>
                        
                        {isLoadingDescription ? (
                            <CircularProgress size={24} />
                        ) : descriptionContent ? (
                            <Box
                                component="div"
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    overflowY: 'auto',
                                    maxHeight: '300px'
                                }}
                            >
                                {descriptionContent}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {project?.description || 'No description available for this project.'}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default DescriptionCard
