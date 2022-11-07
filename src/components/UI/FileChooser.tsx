import { Article, Folder } from '@mui/icons-material'
import { Box, Divider, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { getFiles2 } from '../../api/gatewayClientAPI'
import { File2 } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'

const root: File2 = {
	name: '/',
	isDirectory: true,
	path: '/',
	parentPath: 'root',
}

const sortFile = (data: File2[]) =>
	data.sort((a: File2, b: File2) => -b.name.localeCompare(a.name))

const FileChooser = ({
	handleSelectedFile,
}: {
	handleSelectedFile?: (path: string) => void
}): JSX.Element => {
	const [files, setFiles] = useState<File2[]>([root])
	const [fileListVisible, setFileListVisible] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File2>(root)
	const [loading, setLoading] = useState(false)
	const { showNotif } = useNotification()

	const getFiles = useCallback(
		(path: string) => {
			setLoading(true)
			getFiles2(path)
				.then(data => {
					setFiles(f => sortFile([...f, ...data]))
				})
				.catch(err => {
					showNotif(err.message, 'error')
				})
				.finally(() => setLoading(false))
		},
		[setFiles, showNotif]
	)

	useEffect(() => {
		const exists = files.find(i => i.parentPath === selectedFile.path)
		const isDirectory = selectedFile.isDirectory

		if (!exists && isDirectory && !loading) {
			getFiles(selectedFile.path)
		}
		handleSelectedFile && handleSelectedFile(selectedFile.path)
	}, [loading, selectedFile, files, showNotif])

	const parent = files?.find(f => f.path === selectedFile.parentPath)
	const currentFolder: File2[] = [
		...(files
			?.filter(f => new RegExp(selectedFile.path).test(f.parentPath || ''))
			?.filter(f => {
				// filter out files that are not in the current directory
				return (
					f.path.split('/').length <= selectedFile.path.split('/').length + 1
				)
			}) || []),
	]
	const folder = parent
		? [{ ...parent, name: '..' }, ...currentFolder]
		: currentFolder

	return (
		<Box>
			<Box>
				<TextField
					id='file-textfield'
					sx={{ width: '100%', mb: 2 }}
					label='Files'
					variant='outlined'
					value={selectedFile.path}
					onFocus={() => setFileListVisible(true)}
					// onBlur={() => setFileListVisible(false)}
				/>
				<Box
					component='ul'
					sx={{ display: fileListVisible ? 'block' : 'none' }}
				>
					{folder?.map((f, i) => (
						<>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'top',
									gap: 1,
									'&:hover': { backgroundColor: 'whitesmoke' },
									cursor: 'pointer',
								}}
								component='li'
								key={f.path}
								onClick={(
									event: React.MouseEvent<HTMLDivElement, MouseEvent>
								) => {
									setSelectedFile(f)
								}}
							>
								{f.isDirectory ? (
									<Folder color='action' />
								) : (
									<Article color='action' />
								)}
								<Typography gutterBottom color='text.secondary'>
									{f.name}
								</Typography>
							</Box>
							{i === 0 && <Divider />}
						</>
					))}
				</Box>
			</Box>
		</Box>
	)
}

FileChooser.displayName = 'Files'
export default FileChooser
