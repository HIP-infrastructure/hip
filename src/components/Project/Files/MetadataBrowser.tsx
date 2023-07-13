import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab'
import { Box, Checkbox, CircularProgress } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { useState } from 'react'
import { InspectResult } from '../../../api/types'
import React, { useEffect } from 'react'
import { MinusSquare, PlusSquare } from '../../UI/Icons'

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

const MetadataBrowser = ({
	files,
	setSelected,
	unselect,
}: {
	files?: InspectResult
	setSelected?: (path: string | undefined) => void
	unselect: boolean
}) => {
	const [expanded, setExpanded] = useState<string[] | undefined>()
	const [selectedNode, setSelectedNode] = useState<InspectResult>()

	React.useEffect(() => {
		if (setSelected && selectedNode) setSelected(selectedNode.relativePath)
	}, [setSelected, selectedNode])

	useEffect(() => {
		if (!unselect) return
		// select last uploaded file's folder
		selectedNode?.relativePath && setExpanded([selectedNode?.relativePath])

		setSelectedNode(undefined)
		setSelected && setSelected(undefined)
	}, [unselect, selectedNode, setSelected])

	const rootFile = {
		name: files?.name || 'root',
		type: 'dir',
		relativePath: files?.relativePath || '/',
	}

	const renderLabel = (file: InspectResult) => {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
				onClick={event => {
					event.stopPropagation()
					event.preventDefault()
					if (file.type === 'dir') setSelectedNode(file)
				}}
			>
				<Box>{file.name}</Box>
				{file.type === 'dir' && (
					<Checkbox
						checked={file.relativePath === selectedNode?.relativePath}
						sx={{ p: 0, m: 0 }}
					/>
				)}
			</Box>
		)
	}

	const subFiles = (file: InspectResult) => {
		const items =
			file?.children &&
			file.children.map(f => (
				<StyledTreeItem
					key={f.relativePath}
					label={renderLabel(f)}
					nodeId={f.relativePath}
				>
					{subFiles(f)}
				</StyledTreeItem>
			))

		if (file.type === 'dir' && items.length === 0) {
			return null
		}

		return items
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
			<TreeView
				aria-label='file system navigator'
				defaultExpanded={[rootFile.relativePath]}
				defaultCollapseIcon={<MinusSquare />}
				defaultExpandIcon={<PlusSquare />}
				onNodeToggle={(_event, filesIds: string[]) => {
					if (filesIds) setExpanded(filesIds)
				}}
				expanded={expanded}
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
				}}
			>
				{files?.children?.map((file: InspectResult) => (
					<StyledTreeItem
						key={file.relativePath}
						label={renderLabel(file)}
						nodeId={file.relativePath}
					>
						{subFiles(file)}
					</StyledTreeItem>
				))}
			</TreeView>
		</Box>
	)
}

export default MetadataBrowser
