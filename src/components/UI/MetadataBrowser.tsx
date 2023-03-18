import { ArrowDropDown, ArrowRight } from '@mui/icons-material'
import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab'
import { Box, CircularProgress } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { useState } from 'react'
import { InspectResult } from '../../api/types'
import * as React from 'react'

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
	selectedFile,
}: {
	files?: InspectResult
	selectedFile?: (path: string) => void
}) => {
	const [expanded, setExpanded] = useState(['/'])

	const expand = (file: InspectResult): string[] => {
		if (file.type === 'dir') {
			file.children?.map(expand)
			return [file.relativePath]
		}

		return []
	}

	React.useEffect(() => {
		if (files) {
			setExpanded(expand(files))
		}
	}, [files])

	const rootFile = {
		name: files?.name || 'root',
		type: 'dir',
		relativePath: files?.relativePath || '/',
	}

	const renderLabel = (file: InspectResult) => {
		return (
			<span
				onClick={event => {
					event.stopPropagation()
					event.preventDefault()
					selectedFile && selectedFile(file.relativePath)
				}}
			>
				{file.name}
			</span>
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
				defaultCollapseIcon={<ArrowDropDown />}
				defaultExpandIcon={<ArrowRight />}
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
