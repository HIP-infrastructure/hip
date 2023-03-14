import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab'
import { Box, Checkbox, CircularProgress } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { BIDSDataset, Participant } from '../../api/types'
import { useAppStore } from '../../Store'
import { MinusSquare, PlusSquare } from './Icons'

interface Node {
	id: string
	name: string
	isDirectory: boolean
	path: string
	parentPath: string
	parentNodeId?: string
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

const DatasetSubjectChooser = ({
	selected,
}: {
	selected?: (datasetId: string, subjectId: string) => void
}) => {
	const {
		BIDSDatasets: [datasets],
	} = useAppStore()

	const [nodes, setNodes] = useState<Node[]>([])
	const [selectedNode, setSelectedNode] = useState<Node>()
	const [expanded, setExpanded] = useState<string[]>([])

	useEffect(() => {
		if (datasets?.data) {
			const nextNodes: Node[] = []
			datasets.data.forEach((d: BIDSDataset) => {
				nextNodes.push({
					id: d.id,
					name: d.Name,
					isDirectory: true,
					path: d.Path || '/',
					parentPath: '/',
				})
				d.Participants?.forEach((p: Participant) => {
					nextNodes.push({
						id: p.participant_id,
						parentNodeId: d.id,
						name: `${p.participant_id} (${p.age}/${p.sex})`,
						isDirectory: false,
						path: `${d.Path}/${p.participant_id}`,
						parentPath: d.Path || '/',
					})
				})
			})
			setNodes(nextNodes)
		}
	}, [datasets])

	useEffect(() => {
		if (selected && selectedNode && selectedNode?.parentNodeId)
			selected(selectedNode.parentNodeId, selectedNode.id)
	}, [selectedNode])

	const renderNode = (node: Node) => (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
			onClick={event => {
				event.stopPropagation()
				event.preventDefault()
				setSelectedNode(node)
			}}
		>
			<Box>{node.name}</Box>
			{!node.isDirectory && (
				<Checkbox
					checked={node.path === selectedNode?.path}
					sx={{ p: 0, m: 0 }}
				/>
			)}
		</Box>
	)

	const childrenOf = (file: Node) => {
		if (!file.isDirectory) return null

		const items = nodes
			?.filter(f => new RegExp(file.path).test(f.parentPath))
			.map(f => (
				<StyledTreeItem key={f.path} label={renderNode(f)} nodeId={f.path}>
					{childrenOf(f)}
				</StyledTreeItem>
			))

		if (items.length > 0) {
			return items
		}

		return <StyledTreeItem label='...' nodeId={'...'} />
	}

	return (
		<Box>
			{!nodes && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ top: 10, left: 10 }}
				/>
			)}
			<TreeView
				aria-label='Dataset participant navigator'
				defaultExpanded={[]}
				defaultCollapseIcon={<MinusSquare />}
				defaultExpandIcon={<PlusSquare />}
				onNodeToggle={(_event, nodeIds: string[]) => {
					setExpanded(nodeIds)
				}}
				expanded={expanded}
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
				}}
			>
				{nodes
					.filter(f => f.parentPath === '/')
					.map(file => (
						<StyledTreeItem
							key={file.path}
							label={renderNode(file)}
							nodeId={file.path}
						>
							{childrenOf(file)}
						</StyledTreeItem>
					))}
			</TreeView>
		</Box>
	)
}

export default DatasetSubjectChooser
