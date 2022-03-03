import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Typography, Paper, Avatar, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'

function FileAttachment({ file, size }: { file: File, size: string }) {
    const theme = useTheme()
    let icon = <InsertDriveFileOutlinedIcon color="primary" fontSize="large" />

    // Set icon for compressed files
    if (/\.(g?zip|tar|gz|rar)$/i.test(file?.name)) {
        icon = <ArchiveOutlinedIcon color="primary" fontSize="large" />
    }

    // Set icon for media files
    if (/\.(mp.|midi|mkv|avi)$/i.test(file?.name)) {
        icon = <PlayCircleOutlineIcon color="primary" fontSize="large" />
    }

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{ display: 'flex', mb: 1, alignItems: 'center' }}
        >
            <Typography
                component="div"
                sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}
            >
                <Avatar
                    alt=""
                    src={file.path}
                    variant="rounded"
                    sx={{
                        m: .5,
                        display: 'flex',
                        background: 'transparent',
                        width: theme.spacing(5),
                        height: theme.spacing(5)
                    }}
                >
                    {icon}
                </Avatar>
                <Typography
                    component="div"
                    sx={{ display: 'inline-grid', alignItems: 'center' }}
                >
                    <Typography variant="body2" noWrap>
                        {file?.name}
                    </Typography>
                    <Typography variant="caption" noWrap>
                        <b>{size}</b> | <b>{file?.extension?.toLowerCase()}</b>
                    </Typography>
                </Typography>
            </Typography>
            <Typography component="div" sx={{ textAlign: 'right' }}>
                {/* <IconButton disabled={disabled} onClick={() => hanfleRemoveFile(index)}>
                    <CloseIcon />
                </IconButton> */}
            </Typography>
        </Paper>
    )
}

export default FileAttachment