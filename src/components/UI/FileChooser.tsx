import { Article, Folder } from '@mui/icons-material'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getFiles, getFiles2 } from '../../api/gatewayClientAPI'
import { File2, TreeNode } from '../../api/types'

const root = {
	name: 'root',
	isDirectory: true,
	path: '/',
	parentPath: 'root',
}

const FileChooser = (): JSX.Element => {
	const [files, setFiles] = React.useState<File2[]>([root])
	const [fileListVisible, setFileListVisible] = React.useState(false)
	const [selectedFile, setSelectedFile] = React.useState<File2>(root)

	const [tree, setTree] = useState<TreeNode[]>()
	const [options, setOptions] = React.useState<string[]>()
	const [fileInputValue, setFileInputValue] = React.useState<string>()

	useEffect(() => {
		getFiles('/').then(f => {
			setTree(f)
		})
	}, [])

	useEffect(() => {
		const exists = files.find(i => i.parentPath === selectedFile.path)
		if (!exists)
			getFiles2(selectedFile.path).then(data => {
				setFiles(f => sortFile([...f, ...data]))
			})
	}, [selectedFile, files])

	useEffect(() => {
		const selectedNode = tree?.find(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(node: { data: { path: any } }) => node.data.path === fileInputValue
		)
		const selectedPath = selectedNode?.data.path.split('/') || ['']
		const parentNode = tree?.find((node: TreeNode) => {
			const parentPath = selectedNode?.data.path.split('/')
			parentPath?.pop()

			return node.data.path === parentPath?.join('/')
		})

		const nextOptions = [
			...(parentNode
				? [parentNode]
				: [{
					key: 'root',
					label: '../',
					icon: 'dir',
					data: {
						path: '/',
						type: 'dir',
						size: 0,
						updated: 'string',
						name: '../',
						tags: [],
						id: 0,
					},
				}]),
			...(tree
				?.filter(node => new RegExp(fileInputValue || '').test(node.data.path))
				?.filter(node => {
					const pathes = node?.data.path.split('/')
					if (pathes.length <= selectedPath.length + 1) return true

					return false
				})
				?.sort(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(a: { data: { path: any } }, b: { data: { path: string } }) =>
						-b.data.path.localeCompare(a.data.path)
				) || []),
		]?.map(node => node.data.path)

		setOptions(nextOptions)
	}, [tree, fileInputValue])

	const sortFile = (data: File2[]) =>
		data.sort((a: File2, b: File2) => -b.name.localeCompare(a.name))

	const handleSelectedPath = async (newInputValue: string) => {
		const selectedNode = tree?.find(node => node.data.path === newInputValue)

		if (newInputValue === '/' || selectedNode?.data.type === 'dir') {
			if (selectedNode && !selectedNode?.children) {
				const nextNodes = await getFiles(newInputValue)
				setTree(nodes => [
					...nextNodes,
					...((nodes &&
						nodes.map(node =>
							node.data.path === selectedNode.data.path
								? { ...node, children: true }
								: node
						)) ||
						[]),
				])
			} else {
				setTree(nodes => [...(nodes?.map((t: TreeNode) => t) || [])])
			}
		}
	}

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
					{[
						...[files?.find(f => f.path === selectedFile.parentPath) || []],
						...[files
								?.filter(f =>
									new RegExp(selectedFile.path).test(f.parentPath || '')
								)
								?.filter(f => {
									// filter out files that are not in the current directory
									const pathes = f.path.split('/')
									if (pathes.length <= selectedFile.path.split('/').length + 1)
										return true

									return false
								}) || []
							],
					].map(f => (
						<Box key={`${f}`}></Box>
						// <Box
						// 	sx={{ display: 'flex', alignItems: 'center' }}
						// 	component='li'
						// 	key={f.path}
						// >
						// 	{f.isDirectory ? (
						// 		<Folder color='action' />
						// 	) : (
						// 		<Article color='action' />
						// 	)}
						// 	<Typography variant='subtitle2' color='text.secondary'>
						// 		<div
						// 			onClick={(
						// 				event: React.MouseEvent<HTMLDivElement, MouseEvent>
						// 			) => {
						// 				setSelectedFile(f)
						// 			}}
						// 		>
						// 			{f.name}
						// 		</div>
						// 	</Typography>
						// </Box>
					))}
				</Box>
			</Box>
			<Autocomplete
				options={options || []}
				inputValue={fileInputValue}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onInputChange={(event: any, newInputValue: string) => {
					handleSelectedPath(newInputValue)
					setFileInputValue(newInputValue)
				}}
				disableCloseOnSelect={true} // tree?.find(node => node.data.path === inputValue)?.data.type !== 'file'}
				id='input-tree-view'
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				renderInput={(params: any) => <TextField {...params} label='Files' />}
				renderOption={(props, option) => {
					const node = tree?.find(node => node.data.path === option)

					return node?.data.type === 'dir' ? (
						<Box
							component='li'
							sx={{ '& > svg': { mr: 1, flexShrink: 0 } }}
							{...props}
						>
							<Folder color='action' />
							{option}
						</Box>
					) : (
						<Box
							component='li'
							sx={{ '& > svg': { mr: 1, flexShrink: 0 } }}
							{...props}
						>
							<Article color='action' />
							{option}
						</Box>
					)
				}}
			/>
		</Box>
	)
}

FileChooser.displayName = 'Files'
export default FileChooser
