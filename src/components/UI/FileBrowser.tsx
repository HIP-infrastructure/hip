import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab'
import { Box, CircularProgress, TextField } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { getFiles2, getGroupFolders, search } from '../../api/gatewayClientAPI'
import { ISearch, Node } from '../../api/types'
import { useAppStore } from '../../Store'
import { DocumentSquare, MinusSquare, PlusSquare } from './Icons'

const StyledTreeItem = styled((props: TreeItemProps) => (
	<TreeItem {...props} />
))(({ theme }) => ({
	[`& .${treeItemClasses.iconContainer}`]: {
		'& .close': {
			opacity: 0.3,
		},
	},
	[`& .${treeItemClasses.group}`]: {
		marginLeft: 15,
		paddingLeft: 18,
		borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
	},
}))

const FileBrowser = ({
	path,
	showGroups,
	showSearch,
	selectedFile,
}: {
	path?: string
	showGroups?: boolean
	showSearch?: boolean
	selectedFile?: (path: string) => void
}) => {
	const rootFile = {
		name: 'root',
		isDirectory: true,
		path: path || '/',
		parentPath: 'root',
	}

	const {
		user: [user],
	} = useAppStore()

	const [files, setFiles] = useState<Node[]>([rootFile])
	const [groups, setGroups] = useState<string[] | null>(null)
	const [expanded, setExpanded] = useState([rootFile.path])
	const [term, setTerm] = useState('')
	const [filesCache, setFilesCache] = useState<Node[]>([])

	useEffect(() => {
		getFiles2(path || '/').then(data => {
			const r = sortFile(data)
			setFiles(r)
			setFilesCache(r)
		})
	}, [path])

	useEffect(() => {
		if (!showGroups) return

		getGroupFolders(user?.uid).then(groupFolders => {
			setGroups(groupFolders?.map(g => g.label))
		})
	}, [showGroups, user, setGroups])

	useEffect(() => {
		setFiles(files =>
			sortFile([
				...files,
				...(groups?.map(name => ({
					name,
					isDirectory: true,
					path: `/groupfolder/${name}`,
					parentPath: '/',
				})) || []),
			])
		)
	}, [groups])

	useEffect(() => {
		if (term.length > 1) {
			search(term).then((result: ISearch) => {
				const nextFiles: Node[] = result.entries.map(file => ({
					name: file.title,
					isDirectory: false,
					path: file.attributes.path,
					parentPath: file.attributes.path.split('/').slice(0, -1).join('/'),
				}))

				const tf = new Set<string>()
				const parentPathes = new Set(nextFiles?.map(f => f.parentPath) || [])
				Array.from(parentPathes).forEach(path => {
					const parts = path?.split('/')
					let p = ''
					parts?.forEach(part => {
						p += part
						tf.add(p)
						p += '/'
					})
				})
				Array.from(tf).forEach((path: string) => {
					if (path) {
						const p = path.split('/').slice(0, -1).join('/')

						nextFiles.push({
							name: path.split('/').pop() || 'unknown',
							isDirectory: true,
							path: path === '' ? '/' : path,
							parentPath: p === '' ? '/' : p,
						})
					}
				})
				setFiles(nextFiles)
				setExpanded([...(nextFiles?.map(n => n.parentPath || '') || [])])
			})
		} else {
			setFiles(filesCache)
		}
	}, [term, filesCache, setFiles])

	const sortFile = (data: Node[]) =>
		data.sort((a: Node, b: Node) => -b.name.localeCompare(a.name))

	const renderLabel = (file: Node) => {
		return (
			// file exists, don't load it again
			(files.find(i => i.parentPath === file.path) && (
				<span>{file.name}</span>
			)) || (
				<span
					onClick={event => {
						event.stopPropagation()
						event.preventDefault()

						if (file.isDirectory) {
							getFiles2(file.path)
								.then(data => setFiles(f => [...f, ...data]))
								.then(() => {
									setExpanded(items => [...items, file.path])
								})
						} else {
							selectedFile && selectedFile(file.path)
						}
					}}
				>
					{file.name}
				</span>
			)
		)
	}

	const subFiles = (file: Node) => {
		const items = files
			?.filter(f => new RegExp(file.path).test(f.parentPath || ''))
			?.filter(f => {
				// filter out files that are not in the current directory
				const pathes = f.path.split('/')
				if (pathes.length <= file.path.split('/').length + 1) return true

				return false
			})
			.map(f => (
				<StyledTreeItem key={f.path} label={renderLabel(f)} nodeId={f.path}>
					{subFiles(f)}
				</StyledTreeItem>
			))

		// At root: display a fake item to show the expand icon
		return file.isDirectory ? (
			items.length > 0 ? (
				items
			) : (
				<StyledTreeItem label='...' nodeId={'...'} />
			)
		) : null
	}

	return (
		<Box>
			{!files && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ top: 10, left: 10 }}
				/>
			)}
			{showSearch && (
				<TextField
					id='search-textfield'
					sx={{ width: '100%', mb: 2 }}
					onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
						setTerm(e.target.value)
					}
					label='Search'
					variant='outlined'
				/>
			)}
			<TreeView
				aria-label='file system navigator'
				defaultExpanded={[rootFile.path]}
				defaultCollapseIcon={<MinusSquare />}
				defaultExpandIcon={<PlusSquare />}
				defaultEndIcon={<DocumentSquare />}
				onNodeToggle={(_event, filesIds: string[]) => {
					const clickedId = filesIds[0]
					const directoryExists = files.find(f => f.parentPath === clickedId)

					if (directoryExists) {
						setExpanded(filesIds)
					} else {
						getFiles2(clickedId)
							.then(data => setFiles(f => [...f, ...data]))
							.then(() => {
								setExpanded(items => [...items, clickedId])
							})
					}
				}}
				expanded={expanded}
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
				}}
			>
				{files
					.filter(f => f.parentPath === rootFile.path)
					.map(file => (
						<StyledTreeItem
							key={file.path}
							label={renderLabel(file)}
							nodeId={file.path}
						>
							{subFiles(file)}
						</StyledTreeItem>
					))}
			</TreeView>
		</Box>
	)
}

export default FileBrowser
