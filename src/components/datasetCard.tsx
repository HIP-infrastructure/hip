import React, { useEffect, useState } from 'react'
import { Add } from '@mui/icons-material'
import {
	Box,
    Card,
	CardActions,
	CardContent,
    Divider,
	Link,
	Paper,
	Typography,
} from '@mui/material'
import { BIDSDataset } from '../api/types'

type Props = {dataset: BIDSDataset}

const DatasetCard = ({dataset} : Props): JSX.Element => {

	return (
		<>
            <Paper
                sx={{
                    flex: 1,
                    mb: 2
                }}
            >
                <Card sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', m: 0}}>
                        <CardContent sx={{ flex: '1 0 auto', m: 0 }}>
                        <Typography component="div" variant="h5">
                            {dataset?.Name} &nbsp;
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                                display="inline"
                            >
                                {dataset?.Authors}
                            </Typography>
                            &nbsp;
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                                display="inline"
                            >
                                (Creation date TBC)
                            </Typography>
                        </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', mt: -2, mb: -2 }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                >
                                    Dataset id: {dataset?.id} (
                                        <Link
                                            target='_blank'
                                            href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${dataset?.path}`}
                                        >
                                            {dataset?.path}
                                        </Link>
                                    )
                                </Typography>
                            </CardContent>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                >
                                    #Event files: TBC
                                </Typography>
                            </CardContent>
                        </Box>
                        <Divider variant="middle" />
                        <Box sx={{ display: 'flex', mt: 0, mb: -2 }}>
                            <CardContent sx={{ flex: '1 0 auto' }} >
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                    display="inline"
                                >
                                    #Participants: {dataset?.participants?.length}
                                </Typography>
                                &nbsp;
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                    display="inline"
                                >
                                    Ages(yrs): TBC
                                </Typography>
                            </CardContent>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                >
                                    #Sessions: TBC
                                </Typography>
                            </CardContent>
                        </Box>
                        <Divider variant="middle" />
                        <Box sx={{ display: 'flex', mt: 0, mb: -2 }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                    display="inline"
                                >
                                    Modality(s): TBC
                                </Typography>
                                &nbsp;
                                (
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                        display="inline"
                                    >
                                        Format(s): TBC
                                    </Typography>
                                )
                            </CardContent>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                >
                                    #SEEG Channels: TBC
                                </Typography>
                            </CardContent>
                        </Box>
                        <Divider variant="middle" />
                        <Box sx={{ display: 'flex' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                >
                                    Dataset size: TBC
                                </Typography>
                            </CardContent>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                >
                                    #Files: TBC
                                </Typography>
                            </CardContent>
                        </Box>
                    </Box>
                    <CardActions></CardActions>
                </Card>
            </Paper>
        </>
	)
}

DatasetCard.displayName = 'DatasetCard'

export default DatasetCard
