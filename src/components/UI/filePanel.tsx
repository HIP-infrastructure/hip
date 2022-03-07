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
import React, {
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
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
			backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.primary})`,
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
	const [files, setFiles] = useState([])
	const [error, setError] = useState<string | null>(null)
	const [animate, setAnimate] = useState(false)

	const onNodeSelect = (
		event: React.SyntheticEvent,
		nodeId: string | string[]
	) => {
		const node = nodes?.find(n => n.key === (nodeId as string))

		handleSelectedNode(node)
	}

	/**
	 * @name renderPreview
	 * @description
	 * @param event
	 * @param filesTab
	 * @returns void
	 */
	const renderPreview = (
		event: React.ChangeEventHandler<HTMLInputElement>,
		filesTab: any
	) => {
		setAnimate(false)
		setError(null)
		if (!filesTab && event?.target?.files) {
			filesTab = event?.target?.files
		}
		if (!filesTab) {
			// return onError(`Empty file input`)
		}

		//
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			for (let i = 0; i < filesTab?.length; i++) {
				const file = filesTab[i]
				const extension = file?.type?.split('/')[1]

				//
				const reader = new FileReader()
				reader.addEventListener(
					'load',
					function () {
						const obj = {
							lastModified: file.lastModified,
							name: file.name,
							size: file.size,
							path: this.result,
							extension: extension?.toLowerCase(),
							contentType: file.type,
						}
						files.push(obj)
						setFiles([...files])
					},
					false
				)
				reader.readAsDataURL(file)
			}
			event?.dataTransfer?.clearData()
		}
	}

	/**
	 * @name handleDragEnter
	 * @description
	 * @returns void
	 */
	const handleDragEnter = useCallback(event => {
		event.preventDefault()
		setAnimate(true)
	}, [])

	/**
	 * @name handleDragOver
	 * @description
	 * @returns void
	 */
	const handleDragOver = useCallback(event => {
		event.stopPropagation()
		event.preventDefault()
		setAnimate(true)
	}, [])

	/**
	 * @name handleDrop
	 * @description
	 * @returns void
	 */
	const handleDrop = useCallback(event => {
		event.stopPropagation()
		event.preventDefault()
		const dt = event.dataTransfer
		if (dt.files) renderPreview(event, dt.files)
	}, [])

	/**
	 * @name handleDragLeave
	 * @description
	 * @returns void
	 */
	const handleDragLeave = useCallback(event => {
		setAnimate(false)
	}, [])

	useEffect(() => {
		const dragDiv = filesCardRef.current
		if (dragDiv) {
			dragDiv.ondragenter = handleDragEnter
			dragDiv.ondragover = handleDragOver
			dragDiv.ondrop = handleDrop
			dragDiv.ondragleave = handleDragLeave
		}
	}, [filesCardRef.current])

	const background = animate ? theme.palette.text.disabled : theme.palette.grey

	return (
		<ThemeProvider theme={theme}>
			<Box
				ref={filesCardRef}
				sx={{
					transition: 500,
					background,
				}}
			>
				<TreeView
					onNodeSelect={onNodeSelect}
					aria-label='tree view'
					// defaultExpanded={['3']}
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
									standalone || node.data.type !== 'dir' ? null : <ArrowRight />
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

FilePanel.DisplayName = 'FilePanel'
export default FilePanel
