import { Article, Folder } from '@mui/icons-material'
import {
	Box,
	TextField,
	Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import { getFiles2 } from '../../api/gatewayClientAPI'
import { File2 } from '../../api/types'


const root: File2 = {
	name: '/',
	isDirectory: true,
	path: '/',
	parentPath: 'root',
}

const FileChooser = (): JSX.Element => {
	const [files, setFiles] = React.useState<File2[]>([root])
	const [fileListVisible, setFileListVisible] = React.useState(false)
	const [selectedFile, setSelectedFile] = React.useState<File2>(root)

	useEffect(() => {
		const exists = files.find(i => i.parentPath === selectedFile.path)
		if (!exists)
			getFiles2(selectedFile.path).then(data => {
				setFiles(f => sortFile([...f, ...data]))
			})
	}, [selectedFile, files])

	const sortFile = (data: File2[]) =>
		data.sort((a: File2, b: File2) => -b.name.localeCompare(a.name))

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
					id='search-textfield'
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
								sx={{ display: 'flex', alignItems: 'bottom', gap: 1 }}
								component='li'
								key={f.path}
							>
								{f.isDirectory ? (
									<Folder color='action' />
								) : (
									<Article color='action' />
								)}
								<Typography gutterBottom color='text.secondary'>
									<div
										onClick={(
											event: React.MouseEvent<HTMLDivElement, MouseEvent>
										) => {
											setSelectedFile(f)
										}}
									>
										{f.name}
									</div>
								</Typography>
							</Box>
							{/* {i === 0 && f.path !== '/' && <Divider />} */}
						</>
					))}
				</Box>
			</Box>
		</Box>
	)
}

FileChooser.displayName = 'Files'
export default FileChooser
