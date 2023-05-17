import { Article, Folder } from '@mui/icons-material'
import {
	Box,
	CircularProgress,
	Divider,
	TextField,
	Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { getFiles2, getGroupFolders } from '../../api/gatewayClientAPI'
import { Node } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'

const root: Node = {
	name: '/',
	isDirectory: true,
	path: '/',
	parentPath: 'root',
}

const sortFile = (data: Node[]) =>
	data.sort((a: Node, b: Node) => -b.name.localeCompare(a.name))

const FileChooser = ({
	handleSelectedFile,
}: {
	handleSelectedFile?: (path: string) => void
}): JSX.Element => {
	const [files, setFiles] = useState<Node[]>([root])
	const [groups, setGroups] = useState<string[] | null>(null)
	const [fileListVisible, setFileListVisible] = useState(false)
	const [selectedFile, setSelectedFile] = useState<Node>(root)
	const [loading, setLoading] = useState(false)
	const { showNotif } = useNotification()

	const {
		user: [user],
	} = useAppStore()

	useEffect(() => {
		handleSelectedFile && handleSelectedFile(selectedFile.path)

		const exists =
			files.find(i => i.parentPath === selectedFile.path)?.name !== undefined
		const isDirectory = selectedFile.isDirectory

		if (!exists && isDirectory) {
			setLoading(true)
			getFiles2(selectedFile.path || '/')
				.then(data => {
					// remove duplicates
					const nextData = Array.from(new Set([...files, ...data]))
					setFiles(f => sortFile(nextData))
					setLoading(false)
				})
				.catch(err => {
					showNotif(err.message, 'error')
				})
				.finally(() => setLoading(false))
		}
	}, [selectedFile.path, setFiles])

	useEffect(() => {
		if (groups) return

		getGroupFolders(user?.uid).then(groupFolders => {
			setGroups(groupFolders?.map(g => g.label))
		})
	}, [user, setGroups, groups])

	useEffect(() => {
		const hasGroup = groups && files.some(f => groups.includes(f.name))
		if (hasGroup) return

		setFiles(files =>
			sortFile([
				...files,
				...(groups?.map(name => ({
					name,
					isDirectory: true,
					path: `/GROUP_FOLDER/${name}`,
					parentPath: '/',
				})) || []),
			])
		)
	}, [groups, files, setFiles])

	const parent = files?.find(f => f.path === selectedFile.parentPath)
	const currentFolder: Node[] = [
		...(files?.filter(f => selectedFile.path === f.parentPath) || []),
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
					value={selectedFile.path.replace('/GROUP_FOLDER/', '')}
					onFocus={() => setFileListVisible(true)}
					// onBlur={() => setFileListVisible(false)}
				/>

				<Box
					component='ul'
					sx={{ display: fileListVisible ? 'block' : 'none' }}
				>
					{loading && (
						<CircularProgress
							size={16}
							color='secondary'
							sx={{ top: 10, left: 10 }}
						/>
					)}
					{!loading && folder?.map((f, i) => (
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
							{i === 0 && f.name === '..' && <Divider />}
						</>
					))}
				</Box>
			</Box>
		</Box>
	)
}

FileChooser.displayName = 'Files'
export default FileChooser
