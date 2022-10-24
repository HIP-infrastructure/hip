import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab'
import { Box, CircularProgress, TextField } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import * as React from 'react'
import { useEffect } from 'react'
import { getFiles2, search } from '../../api/gatewayClientAPI'
import { File2, ISearch } from '../../api/types'

function MinusSquare(props: SvgIconProps) {
	return (
		<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
			{/* tslint:disable-next-line: max-line-length */}
			<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
		</SvgIcon>
	)
}

function PlusSquare(props: SvgIconProps) {
	return (
		<SvgIcon fontSize='inherit' style={{ width: 14, height: 14 }} {...props}>
			{/* tslint:disable-next-line: max-line-length */}
			<path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
		</SvgIcon>
	)
}

function CloseSquare(props: SvgIconProps) {
	return (
		<SvgIcon
			className='close'
			fontSize='inherit'
			style={{ width: 14, height: 14 }}
			{...props}
		>
			{/* tslint:disable-next-line: max-line-length */}
			<path d='M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z' />
		</SvgIcon>
	)
}

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

const root = {
	name: 'root',
	isDirectory: true,
	path: '/',
	parentPath: 'root',
}

const DataBrowser = ({ groups }: { groups?: string[] }) => {
	const [files, setFiles] = React.useState<File2[]>([root])
	const [expanded, setExpanded] = React.useState(['/'])
	const [term, setTerm] = React.useState('')
	const [filesCache, setFilesCache] = React.useState<File2[]>([])

	useEffect(() => {
		getFiles2('/').then(data => {
			const r = sortFile(data)
			setFiles(r)
			setFilesCache(r)
		})
	}, [])

	useEffect(() => {
		const r = sortFile([
			...files,
			...(groups?.map(name => ({
				name,
				isDirectory: true,
				path: `/groupfolder/${name}`,
				parentPath: '/',
			})) || [])])

		setFiles(r)
	}, [groups, files])

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

	const renderLabel = (item: File2) => {
		return (
			(files.find(i => i.parentPath === item.path) && (
				<span>{item.name}</span>
			)) || (
				<span
					onClick={event => {
						event.stopPropagation()
						event.preventDefault()

						getFiles2(item.path)
							.then(data => setFiles(f => [...f, ...data]))
							.then(() => {
								setExpanded(items => [...items, item.path])
							})
					}}
				>
					{item.name}
				</span>
			)
		)
	}

	const subItems = (file: File2) => {
		const items = files
			?.filter(f => new RegExp(file.path).test(f.parentPath || ''))
			?.filter(f => {
				// filter out files that are not in the current directory
				const pathes = f.path.split('/')
				if (pathes.length <= file.path.split('/').length + 1) return true

				return false
			})
			.map(f => (
				<StyledTreeItem key={file.path} label={renderLabel(f)} nodeId={f.path}>
					{subItems(f)}
				</StyledTreeItem>
			))

		// Display a fake item to show the expand icon
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
			<TextField
				id='search-textfield'
				sx={{ width: '100%', mb: 2 }}
				onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
					setTerm(e.target.value)
				}
				label='Search'
				variant='outlined'
			/>
			<TreeView
				aria-label='file system navigator'
				defaultExpanded={[root.path]}
				defaultCollapseIcon={<MinusSquare />}
				defaultExpandIcon={<PlusSquare />}
				defaultEndIcon={<CloseSquare />}
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
					.filter(f => f.parentPath === '/')
					.map(file => (
						<StyledTreeItem
							key={file.path}
							label={renderLabel(file)}
							nodeId={file.path}
						>
							{subItems(file)}
						</StyledTreeItem>
					))}
			</TreeView>
		</Box>
	)
}

export default DataBrowser