import React from 'react'
import {
	Box,
    Card,
	CardContent,
    Link,
	Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
	Typography,
} from '@mui/material'
import { BIDSDataset } from '../api/types'

type Props = {dataset: BIDSDataset}

const DatasetCard = ({dataset} : Props): JSX.Element => {

    return (
        <>
            <Card sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', m: 0}}>
                    <CardContent sx={{ flex: '1 0 auto', m: 0 }}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <TableCell>
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
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    component="div"
                                    display="inline"
                                >
                                    ({dataset?.CreationDate})
                                </Typography>
                            </TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        Dataset id: {dataset?.id} (
                                            <Link
                                                target='_blank'
                                                href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${dataset?.Path}`}
                                            >
                                                {dataset?.Path}
                                            </Link>
                                        )
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        #Event files: {dataset?.EventsFileCount}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                        marginBottom="-2pt"
                                    >
                                        #Participants: {dataset?.ParticipantsCount}&nbsp;
                                        (
                                            <Typography
                                                variant="subtitle1"
                                                color="text.secondary"
                                                component="div"
                                                display="inline"
                                            >
                                                Ages(yrs): [{dataset?.AgeRange?.join(', ')}]
                                            </Typography>
                                            &nbsp;/&nbsp;
                                            <Typography
                                                variant="subtitle1"
                                                color="text.secondary"
                                                component="div"
                                                display="inline"
                                            >
                                                Groups: {dataset?.ParticipantsGroups?.join(', ')}
                                            </Typography>
                                        )
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        #Sessions: {dataset?.SessionsCount}
                                    </Typography>
                                    &nbsp;
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                        display="inline"
                                    >
                                        Tasks: {dataset?.Tasks?.join(', ')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                        display="inline"
                                    >
                                        Datatype(s): {dataset?.DataTypes?.join(', ')}
                                    </Typography>
                                    &nbsp;&nbsp;
                                    (
                                        <Typography
                                            variant="subtitle1"
                                            color="text.secondary"
                                            component="div"
                                            display="inline"
                                        >
                                            Format(s): {dataset?.Formats?.join(', ')}
                                        </Typography>
                                    )
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        #SEEG Channels: {dataset?.SEEGChannelCount}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        Dataset size: {dataset?.Size}B
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        #Files: {dataset?.FileCount}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </CardContent>
                </Box>
            </Card>
        </>
    )
}

DatasetCard.displayName = 'DatasetCard'

export default DatasetCard
