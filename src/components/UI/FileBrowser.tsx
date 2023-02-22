import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab'
import { Box, CircularProgress, TextField } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { getFiles2, getGroupFolders, search } from '../../api/gatewayClientAPI'
import { File2, ISearch } from '../../api/types'
import { useAppStore } from '../../Store'

const MinusSquare = (props: SvgIconProps) => (
	<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
		{/* tslint:disable-next-line: max-line-length */}
		<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
	</SvgIcon>
)

const PlusSquare = (props: SvgIconProps) => (
	<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
		{/* tslint:disable-next-line: max-line-length */}
		<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
	</SvgIcon>
)

const DocumentSquare = (props: SvgIconProps) => (
	<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
		{/* tslint:disable-next-line: max-line-length */}
		<path d='M35,31.75v-25c0-2.761-2.238-5-5-5H5c-2.762,0-5,2.239-5,5v25c0,2.761,2.238,5,5,5h25C32.762,36.75,35,34.511,35,31.75z
		 M7.25,8h10.038c0.828,0,1.5,0.671,1.5,1.5s-0.672,1.5-1.5,1.5H7.25c-0.828,0-1.5-0.671-1.5-1.5S6.422,8,7.25,8z M7.25,14.5h10
		c0.828,0,1.5,0.671,1.5,1.5s-0.672,1.5-1.5,1.5h-10c-0.828,0-1.5-0.671-1.5-1.5S6.422,14.5,7.25,14.5z M27.75,30.5H7.25
		c-0.828,0-1.5-0.671-1.5-1.5s0.672-1.5,1.5-1.5h20.5c0.828,0,1.5,0.671,1.5,1.5S28.578,30.5,27.75,30.5z M27.75,24H7.25
		c-0.828,0-1.5-0.671-1.5-1.5S6.422,21,7.25,21h20.5c0.828,0,1.5,0.671,1.5,1.5S28.578,24,27.75,24z M38.5,10.214v22.113
		c0,2.442-1.979,4.423-4.423,4.423h-2.493c2.762,0,5-2.239,5-5v-25c0-0.065-0.018-0.126-0.02-0.191
		C37.732,7.355,38.5,8.694,38.5,10.214z' />
	</SvgIcon>
)

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

	const [files, setFiles] = useState<File2[]>([rootFile])
	const [groups, setGroups] = useState<string[] | null>(null)
	const [expanded, setExpanded] = useState([rootFile.path])
	const [term, setTerm] = useState('')
	const [filesCache, setFilesCache] = useState<File2[]>([])

	useEffect(() => {
		getFiles2(path || '/').then(data => {
			const r = sortFile(data)
			setFiles(r)
			setFilesCache(r)
		})
	}, [path])

	useEffect(() => {
		if (!showGroups && groups) return

		getGroupFolders(user?.uid).then(groupFolders => {
			setGroups(groupFolders?.map((g: any) => g.label))
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
				const nextFiles: File2[] = result.entries.map(file => ({
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

	const sortFile = (data: File2[]) =>
		data.sort((a: File2, b: File2) => -b.name.localeCompare(a.name))

	const renderLabel = (file: File2) => {
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

	const subFiles = (file: File2) => {
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
