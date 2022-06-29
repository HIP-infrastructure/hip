import {
	ArrowDropDown,
	ArrowRight,
	Folder,
	InsertDriveFile,
} from '@mui/icons-material'
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import { Box, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { SvgIconProps } from '@mui/material/SvgIcon'
import { ThemeProvider } from '@mui/system'
import React, { RefObject, useRef } from 'react'
import { TreeNode } from '../../api/types'

declare module 'react' {
	interface CSSProperties {
		'--tree-view-color'?: string
		'--tree-view-bg-color'?: string
	}
}

type StyledTreeItemProps = TreeItemProps & {
	bgColor?: string
	color?: string
	labelIcon: React.ElementType<SvgIconProps>
	labelInfo?: string
	labelText: string
}

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.text.secondary,
	[`& .${treeItemClasses.content}`]: {
		color: theme.palette.text.secondary,
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
		paddingRight: theme.spacing(1),
		fontWeight: theme.typography.fontWeightMedium,
		'&.Mui-expanded': {
			fontWeight: theme.typography.fontWeightRegular,
		},
		'&:hover': {
			backgroundColor: theme.palette.action.hover,
		},
		'&.Mui-focused': {
			backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.focus})`,
			color: 'var(--tree-view-color)',
		},
		'&.Mui-selected, &.Mui-selected.Mui-focused': {
			backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
			color: 'var(--tree-view-color)',
		},
		[`& .${treeItemClasses.label}`]: {
			fontWeight: 'inherit',
			color: 'inherit',
		},
	},
	[`& .${treeItemClasses.group}`]: {
		marginLeft: 0,
		[`& .${treeItemClasses.content}`]: {
			paddingLeft: theme.spacing(2),
		},
	},
}))

function StyledTreeItem(props: StyledTreeItemProps) {
	const {
		bgColor,
		color,
		labelIcon: LabelIcon,
		labelInfo,
		labelText,
		...other
	} = props

	return (
		<StyledTreeItemRoot
			label={
				<Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
					<Box component={LabelIcon} color='inherit' sx={{ mr: 1 }} />
					<Typography
						variant='body2'
						sx={{ fontWeight: 'inherit', flexGrow: 1 }}
					>
						{labelText}
					</Typography>
					<Typography variant='caption' color='inherit'>
						{labelInfo}
					</Typography>
				</Box>
			}
			style={{
				'--tree-view-color': color,
				'--tree-view-bg-color': bgColor,
			}}
			{...other}
		/>
	)
}

interface ITreeSelect {
	nodes?: TreeNode[]
	handleSelectedNode: (node?: TreeNode) => void
	standalone?: boolean
}

const FilePanel = ({
	nodes,
	handleSelectedNode,
	standalone = true,
}: ITreeSelect) => {
	const theme = useTheme()
	const filesCardRef = useRef<RefObject<HTMLDivElement>>(null)

	const onNodeSelect = (
		event: React.SyntheticEvent,
		nodeId: string | string[]
	) => {
		const node = nodes?.find(n => n.key === (nodeId as string))

		handleSelectedNode(node)
	}

	return (
		<ThemeProvider theme={theme}>
			<Box ref={filesCardRef}>
				<TreeView
					onNodeSelect={onNodeSelect}
					aria-label='tree view'
					defaultCollapseIcon={<ArrowDropDown />}
					defaultExpandIcon={<ArrowRight />}
					defaultEndIcon={<div style={{ width: 24 }} />}
					sx={{
						height: 292,
						maxWidth: 400,
						minWidth: 240,
						mr: 1,
						overflowY: 'auto',
						border: 1,
						borderColor: 'grey.400',
					}}
				>
					{nodes &&
						nodes.map((node: TreeNode) => (
							<StyledTreeItem
								key={node.key}
								nodeId={node.key}
								labelText={node.label}
								labelIcon={node.data.type === 'dir' ? Folder : InsertDriveFile}
								labelInfo={
									standalone || node.data.type !== 'dir' ? undefined : '>'
								}
							/>
						))}
					{nodes?.length === 0 && (
						<Typography variant='body2' sx={{ fontWeight: 'inherit', p: 0.5 }}>
							Empty
						</Typography>
					)}
				</TreeView>
			</Box>
		</ThemeProvider>
	)
}

FilePanel.displayName = 'FilePanel'
export default FilePanel
