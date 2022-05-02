import { Delete, Edit, Folder } from '@mui/icons-material'
import {
	Autocomplete,
	Box,
	Button,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getBidsDatabase } from '../../../api/bids'
import { getFiles } from '../../../api/gatewayClientAPI'
import {
	BIDSDatabase,
	Entity,
	File as IFile,
	Participant,
	TreeNode
} from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'
import DynamicForm from '../../UI/dynamicForm'

export const bIDSEntity = {
	subject: {
		id: 'subject',
		label: 'Subject',
		format: 'sub-',
		modalities: undefined,
	},
	session: {
		id: 'session',
		label: 'Session',
		format: 'ses-',
		modalities: ['presurgery', 'postsurgery'],
	},
	task: {
		id: 'task',
		label: 'Task',
		format: 'task-',
		modalities: ['eyesclosed'],
	},
	acquisition: {
		id: 'acquisition',
		label: 'Acquisition',
		format: 'acq-',
		modalities: ['lowres'],
	},
	reconstruction: {
		id: 'reconstruction',
		label: 'Reconstruction',
		format: 'rec-',
		modalities: undefined,
	},
	run: {
		id: 'run',
		label: 'Run',
		format: 'run-',
		modalities: undefined,
	},
	correspondingmodality: {
		id: 'correspondingmodality',
		label: 'Corresponding Modality',
		format: 'mod-',
		modalities: undefined,
	},
	echo: {
		id: 'echo',
		label: 'Echo',
		format: 'echo-',
		modalities: undefined,
	},
}

export type EntityIndex = 'subject' | 'session' | 'task' | 'acquisition'

export const bIDSDataType = [
	{
		name: 'anat',
		entities: [
			{
				entity: bIDSEntity.subject,
				required: true,
			},
			{
				entity: bIDSEntity.session,
				required: false,
			},
			{
				entity: bIDSEntity.acquisition,
				required: false,
			},
		],
	},
	{
		name: 'ieeg',
		entities: [
			{
				entity: bIDSEntity.subject,
				required: true,
			},
			{
				entity: bIDSEntity.session,
				required: false,
			},
			{
				entity: bIDSEntity.task,
				required: false,
			},
			{
				entity: bIDSEntity.acquisition,
				required: false,
			},
			{
				entity: bIDSEntity.run,
				required: false,
			},
		],
		// dwi = 'dwi',
		// fmap = 'fmap',
		// func = 'func',
		// perf = 'perf',
		// ieeg = 'ieeg',
		// meg = 'meg',
		// pet = 'pet',
		// beh = 'beh'
	},
]

const modalities = [
	{ name: 'T1w', type: 'anat' },
	{ name: 'T2w', type: 'anat' },
	{ name: 'T1rho', type: 'anat' },
	{ name: 'T2start', type: 'anat' },
	{ name: 'FLAIR', type: 'anat' },
	{ name: 'CT', type: 'anat' },
	{ name: 'ieeg', type: 'ieeg' },
	{ name: 'electrodes', type: 'ieeg' },
	{ name: 'coordsystem', type: 'ieeg' },
	{ name: 'photo', type: 'ieeg' },
]
interface Props {
	selectedBidsDatabase?: BIDSDatabase
	selectedParticipant?: Participant
	selectedFiles?: IFile[]
	handleSelectFiles: (files: IFile[]) => void
}

const Files = (): JSX.Element => {
	const [filesPanes, setFilesPanes] = useState<TreeNode[][]>()
	const [ignored, forceUpdate] = React.useReducer((x: number) => x + 1, 0)
	const [currentBidsFile, setCurrentBidsFile] = useState<IFile>()
	const [tree, setTree] = useState<TreeNode[]>()
	// const [selectedNode, setSelectedNode] = useState<TreeNode>()
	const [options, setOptions] = React.useState<string[]>()
	const [inputValue, setInputValue] = React.useState<string>('')

	const {
		containers: [containers],
		user: [user, setUser],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		participants: [participants, setParticipants],
		selectedParticipant: [selectedParticipant, setSelectedParticipant],
		selectedFiles: [selectedFiles, setSelectedFiles]
	} = useAppStore()
	

	useEffect(() => {
		populateEntities('T1w')
		getFiles('/').then(f => {
			setFilesPanes([f])
			setTree(f)
		})
	}, [])

	useEffect(() => {
		getBidsDatabase({
			owner: '',
			database: '',
			BIDS_definitions: ['']
		}).then(response => console.log(response))
	}, [])

	useEffect(() => {
		// console.log(tree?.map((t: { data: { path: any } }) => t.data.path))
		const selectedNode = tree?.find(
			(node: { data: { path: any } }) => node.data.path === inputValue
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
				: [
					{
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
					},
				]),
			...(tree
				?.filter((node: { data: { path: string } }) =>
					new RegExp(inputValue).test(node.data.path)
				)
				?.filter((node) => {
					const pathes = node?.data.path.split('/')
					if (pathes.length <= selectedPath.length + 1) return true

					return false
				})
				?.sort(
					(a: { data: { path: any } }, b: { data: { path: string } }) =>
						-b.data.path.localeCompare(a.data.path)
				) || []),
		]?.map(node => node.data.path)

		// console.log(nextOptions)

		setOptions(nextOptions)
	}, [tree])

	const handleSelectedPath = async (newInputValue: string) => {
		const selectedNode = tree?.find(
			(node: { data: { path: string } }) => node.data.path === newInputValue
		)

		if (newInputValue === '/' || selectedNode?.data.type === 'dir') {
			if (selectedNode && !selectedNode?.children) {
				const nextNodes = await getFiles(newInputValue)
				setTree((nodes: TreeNode[]) => [
					...nextNodes,
					...((nodes &&
						nodes.map((node: { data: { path: any } }) =>
							node.data.path === selectedNode.data.path
								? { ...node, children: true }
								: node
						)) ||
						[]),
				])
			} else {
				setTree((nodes: TreeNode[]) => [
					...((nodes && nodes.map((t: TreeNode) => t)) || []),
				])
			}
		} else {
			handleSelectedNode(selectedNode)
		}
	}

	const handleSelectedNode = async (node?: TreeNode) => {
		if (node?.data.type === 'file') {
			setCurrentBidsFile((f: any) => ({ ...f, path: node?.data.path }))

			return
		}

		setCurrentBidsFile((f: any) => ({ ...f, path: undefined }))
		const pathes = node?.data.path.split('/').map(p => `${p}/`)
		const path = node?.data.path

		if (pathes && path) {
			const result = await getFiles(path)

			setFilesPanes((prev: any[]) => {
				if (!prev) return [result]

				prev[pathes.length - 1] = result
				prev.splice(pathes.length)

				return prev
			})
			forceUpdate()
		}
	}

	const populateEntities = (modality: string) => {
		if (modality) {
			const type = modalities.find(b => b.name === modality)?.type
			const dataTypes = bIDSDataType.find(b => b.name === type)?.entities
			const entities: Entity[] | undefined = dataTypes?.map(e =>
				e.entity.id === 'subject'
					? {
						id: e.entity.id,
						label: e.entity.label,
						required: e.required,
						type: 'string',
						value: selectedParticipant?.participant_id,
						modalities: participants?.map(
							p => p.participant_id
						),
					}
					: {
						id: e.entity.id,
						label: e.entity.label,
						required: e.required,
						type: 'string',
						value: '',
						modalities: e.entity.modalities ? e.entity.modalities : undefined,
					}
			)

			if (entities) {
				setCurrentBidsFile({
					modality,
					entities,
				})
			}
		}
	}

	const handleSelectModality = (event: SelectChangeEvent) => {
		const modality = event?.target.value
		populateEntities(modality)
	}

	const handleChangeEntities = (entities: Entity[]) => {
		setCurrentBidsFile((f: any) => ({ ...f, entities }))
	}

	const handleAddFile = () => {
		if (currentBidsFile) {
			handleSelectFiles([...(selectedFiles || []), currentBidsFile])
		}

		setFilesPanes((prev: any[]) => {
			if (!prev) return []

			prev.splice(1)

			return prev
		})
		forceUpdate()

		populateEntities('T1w')
	}

	const handleFileUploadError = (error: Error) => {
		// Do something...
	}

	const handleFileChange = (file: File) => {
		if (currentBidsFile && handleSelectFiles) {
			handleSelectFiles([
				...(selectedFiles || []),
				{
					...currentBidsFile,
					path: `file.path` || '/new file',
				},
			])
		}
	}

	const boxStyle = {
		border: 1,
		borderColor: 'grey.400',
		p: 2,
		mr: 1,
		display: 'flex',
		flex: '1 0 auto',
		flexFlow: 'column',
	}

	return (
		<Box>
			<Box sx={boxStyle}>
				<InputLabel id='bids-modality'>Modality</InputLabel>
				<Box
					sx={{ display: 'flex', alignItems: 'center', gap: '0px 8px', mb: 2 }}
				>
					<Box>
						<Select
							labelId='bids-modality'
							id='bids-modality-select'
							value={currentBidsFile?.modality || 'T1w'}
							label='Modality'
							onChange={handleSelectModality}
						>
							{modalities.map(m => (
								<MenuItem key={m.name} value={m.name}>
									{m.name}
								</MenuItem>
							))}
						</Select>
					</Box>
					{currentBidsFile?.entities && (
						<DynamicForm
							fields={currentBidsFile?.entities}
							handleChangeFields={handleChangeEntities}
						/>
					)}
				</Box>
				<Box sx={{ width: 960 }}>
					{/* <Search /> */}

					<Box
						sx={{
							width: 960,
							border: 1,
							borderColor: 'grey.300',
							overflowY: 'auto',
							p: 1,
							display: 'flex',
						}}
					>
						{/* <FileBrowser
							nodesPanes={filesPanes}
							handleSelectedNode={handleSelectedNode}
						/> */}
						<Autocomplete
							options={options || []}
							inputValue={inputValue}
							onInputChange={(event: any, newInputValue: string) => {
								handleSelectedPath(newInputValue)
								setInputValue(newInputValue)
							}}
							disableCloseOnSelect
							id='input-tree-view'
							sx={{ width: 640 }}
							renderInput={(params: unknown) => (
								<TextField {...params} label='Files' />
							)}
							renderOption={(props, option) => {
								const node = tree?.find(node => node.data.path === option)

								return node?.data.type === 'dir' ?
									<Box component="li" sx={{ '& > button': { mr: 2, flexShrink: 0 } }} {...props}>
										<Folder />
										{option}
									</Box> :
									<Box component="li" sx={{ ml: 2 }}  {...props}>{option}</Box>
							}}
						/>
					</Box>
					<Box>
						<Button
							disabled={
								!(
									currentBidsFile?.entities &&
									currentBidsFile?.modality &&
									currentBidsFile?.path
								)
							}
							sx={{ float: 'right', mt: 2, mb: 2 }}
							variant='contained'
							onClick={handleAddFile}
						>
							Add file
						</Button>
					</Box>
				</Box>
			</Box>
			<Box sx={{ mt: 4, mb: 4 }}>
				<TableContainer component={Paper}>
					<Table size='small' sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>Actions</TableCell>
								<TableCell>Modality</TableCell>
								<TableCell>Path</TableCell>
								{Object.keys(bIDSEntity).map((k: string) => (
									<TableCell key={bIDSEntity[k as EntityIndex].id}>
										{bIDSEntity[k as EntityIndex].label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedFiles?.reverse().map(file => (
								<TableRow
									key={file.path}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell align='right'>
										<IconButton color='primary' aria-label='edit'>
											<Edit />
										</IconButton>
										<IconButton color='primary' aria-label='delete'>
											<Delete />
										</IconButton>
									</TableCell>
									<TableCell>{file.path}</TableCell>
									{Object.keys(bIDSEntity).map((k: string) => (
										<TableCell key={k}>
											{file?.entities?.find(
												f => f.id === bIDSEntity[k as EntityIndex].id
											)?.value || ''}
										</TableCell>
									))}
									<TableCell>{file.modality}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box >
	)
}

Files.displayName = 'Files'
export default Files
