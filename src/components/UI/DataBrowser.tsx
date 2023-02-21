import { Close } from '@mui/icons-material'
import { Box, Typography, Paper, IconButton } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import FileBrowser from './FileBrowser'

const DataBrowser = () => {
	const [path, setPath] = useState<string>()
	const [selectedFile, setSelectedFile] = useState<string>()
	const [fileContent, setFileContent] = useState<JSX.Element>()

	useEffect(() => {
		if (!selectedFile) return
		setFileContent(
			<Box>
				<Typography>No visualization available yet</Typography>
				<a
					target='_blank'
					href={`${window.location.protocol}//${
						window.location.host
					}/apps/files/?dir=${selectedFile.split('/').slice(0, -1).join('/')}`} rel="noreferrer"
				>
					View file in NextCloud
				</a>
			</Box>
		)
	}, [selectedFile])

	return (
		<Box sx={{ mt: 2 }}>
			<Typography variant='h6'>Files</Typography>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '16px 16px',
					mt: 2,
				}}
			>
				<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
					<FileBrowser
						path={path}
						selectedFile={setSelectedFile}
						showSearch={true}
					/>
				</Box>
				<Box
					elevation={2}
					component={Paper}
					sx={{
						overflow: 'auto',
						p: 2,
						flex: '1 1',
					}}
				>
					{!fileContent && <Typography>File Preview</Typography>}
					{fileContent && (
						<Box>
							<Box sx={{ float: 'right' }}>
								<IconButton onClick={() => setFileContent(undefined)}>
									<Close />
								</IconButton>
							</Box>
							{fileContent}
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	)
}

export default DataBrowser
