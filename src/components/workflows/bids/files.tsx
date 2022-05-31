import { Article, Delete, Folder, Save, Info } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Autocomplete,
	Box,
	Grid,
	IconButton,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { type } from '@testing-library/user-event/dist/type'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { getSubject } from '../../../api/bids'
import { getFiles } from '../../../api/gatewayClientAPI'
import { BIDSSubjectFile, File, IEntity, TreeNode } from '../../../api/types'
import { ENTITIES, MODALITIES } from '../../../constants'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'
import EntityOptions from './entityOptions'

type IExistingFile =
	| {
			modality: string
			files: string[]
	  }[]
	| undefined

const Files = (): JSX.Element => {
	const [ignored, forceUpdate] = React.useReducer((x: number) => x + 1, 0)
	const [tree, setTree] = useState<TreeNode[]>()
	const [options, setOptions] = React.useState<string[]>()
	const [inputValue, setInputValue] = React.useState<string>('')
	const [submitted, setSubmitted] = useState(false)
	const { showNotif } = useNotification()
	const [currentBidsFile, setCurrentBidsFile] = useState<File>()
	const [modality, setModality] = useState<{ name: string; type: string }>()
	const [selectedSubject, setSelectedSubject] = useState<string>()
	const [selectedBIDSSubjectFiles, setSelectedBIDSSubjectFiles] =
		useState<BIDSSubjectFile[]>()
	const [selectedEntities, setSelectedEntities] =
		useState<Record<string, string>>()
	const [entities, setEntites] = useState<IEntity[]>()

	const {
		containers: [containers],
		user: [user, setUser],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
		selectedFiles: [selectedFiles, setSelectedFiles],
	} = useAppStore()

	useEffect(() => {
		getFiles('/').then(f => {
			setTree(f)
		})
	}, [])

	useEffect(() => {
		if (!(selectedBidsDatabase?.path && user?.uid && selectedSubject)) return

		// existing participant
		const subject = selectedSubject.replace('sub-', '')
		getSubject(selectedBidsDatabase?.path, user?.uid, subject)
			.then(d => {
				if (d) setSelectedBIDSSubjectFiles(d)
			})
			.catch(e => {
				console.log(e)
			})
	}, [selectedSubject])

	useEffect(() => {
		if (!modality) return

		const entitiesForModality =
			(modality &&
				ENTITIES.filter(e =>
					e.requirements.map(r => r.dataType).includes(modality?.type)
				)) ||
			[]
		setEntites(entitiesForModality)

		if (!selectedBIDSSubjectFiles) {
			return
		}

		const nextEntities = entitiesForModality?.map(e => {
			const entries = selectedBIDSSubjectFiles
				.filter(i => i.modality === modality?.name)
				.find(eem => {
					return Object.keys(eem).find(k => k === e.name)
				})
			if (!entries) return e

			const mod = (entries as Record<string, any>)[e.name]

			if (mod)
				return {
					...e,
					options: Array.from(new Set([...e.options, mod])).map(label => ({
						label,
					})),
				}
			else return e
		})

		if (nextEntities) setEntites(nextEntities)
	}, [modality])

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
				?.filter(node => {
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
		} else {
			if (selectedNode?.data.type === 'file') {
				setCurrentBidsFile((f: any) => ({
					...f,
					path: selectedNode?.data.path,
				}))
			}
		}
	}

	const handleDeleteFile = (file: File) => {
		const nextFiles = selectedFiles.filter(f => f.path !== file.path)
		setSelectedFiles(nextFiles)
	}

	const handleAddFile = () => {
		const participant = selectedBidsDatabase?.participants?.find(
			p => p.participant_id === selectedSubject
		)

		if (
			participant &&
			!selectedParticipants
				?.map(s => s.participant_id)
				.includes(participant.participant_id)
		) {
			setSelectedParticipants(s => [...(s || []), participant])
		}

		if (!(modality && selectedSubject && currentBidsFile)) return

		const file: File = {
			modality: modality?.name,
			subject: selectedSubject.replace('sub-', ''),
			path: currentBidsFile?.path?.substring(1),
			entities: {
				sub: selectedSubject.replace('sub-', ''),
				...selectedEntities,
			},
		}

		setSelectedFiles(f => [...(f || []), file])
		showNotif('File added.', 'success')
	}

	const handleEditFile = (file: File) => {
		const nextFiles = selectedFiles.filter(f => f.path !== file.path)
	}

	const existingFiles: IExistingFile = selectedBIDSSubjectFiles?.reduce(
		(p, c) => {
			const mods = p?.map(f => f.modality)
			if (mods?.includes(c.modality)) {
				return [
					...(p?.map(f =>
						f.modality === c.modality
							? { ...f, files: [...f.files, c.fileLoc] }
							: f
					) || []),
				]
			} else {
				return [...(p || []), { modality: c.modality, files: [c.fileLoc] }]
			}
		},
		[] as IExistingFile
	)

	return (
		<Grid container spacing={2}>
			<Grid item xs={8}>
				<Typography
					sx={{ mt: 1, mb: 2 }}
					variant='subtitle1'
					color='text.secondary'
				>
					Select modalities, entities and files to be imported
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '0.8em 0.8em',
					}}
				>
					{selectedBidsDatabase?.participants && (
						<Box>
							<TextField
								fullWidth
								select
								size='small'
								disabled={submitted}
								name='subject'
								label='Subject'
								value={selectedSubject}
								onChange={event => {
									setSelectedSubject(event.target.value)
								}}
								// error={touched.subject && errors.subject ? true : false}
								// helperText={
								// 	touched.subject && errors.subject ? errors.subject : null
								// }
							>
								{selectedBidsDatabase?.participants?.map(p => (
									<MenuItem key={p.participant_id} value={p.participant_id}>
										{p.participant_id}
									</MenuItem>
								))}
							</TextField>
						</Box>
					)}
					{existingFiles && (
						<Box sx={{ mb: 1 }}>
							<Typography
								gutterBottom
								variant='subtitle2'
								color='text.secondary'
							>
								Existing Files for {selectedSubject}
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{existingFiles.map(f => (
									<Box>
										{f.modality}: {f.files.length} file
										{f.files.length > 1 ? 's' : ''} ({f.files.toString()})
									</Box>
								))}
							</Typography>
						</Box>
					)}
					{selectedSubject && (
						<Box>
							<TextField
								fullWidth
								select
								size='small'
								disabled={submitted}
								name='modality'
								label='Modality'
								value={modality}
								onChange={event => {
									const m = MODALITIES.find(m => m.name === event.target.value)
									if (m) setModality(m)
								}}
								// onBlur={handleBlur}
								// error={touched.modality && errors.modality ? true : false}
								// helperText={
								// 	touched.modality && errors.modality ? errors.modality : null
								// }
							>
								{MODALITIES?.map(m => (
									<MenuItem value={m.name} key={m.name}>
										{m.name}
									</MenuItem>
								))}
							</TextField>
						</Box>
					)}
					{modality && (
						<Typography sx={{ mt: 1 }} variant='body2' color='text.secondary'>
							BIDS entities
						</Typography>
					)}
					{modality && (
						<Box
							sx={{
								display: 'flex',
								gap: '0.8em 0.8em',
								flexWrap: 'wrap',
							}}
						>
							{entities?.map(entity => (
								<Box>
									<Box
										key={entity.name}
										sx={{
											maxWidth: '200px',
											flex: 'inherit',
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<EntityOptions
											entity={entity}
											onChange={option => {
												setSelectedEntities(s => ({
													...(s || {}),
													[entity.name]: option,
												}))
												//handleChange()
											}}
										/>
										<Tooltip title={entity.description}>
											<Info color='action' />
										</Tooltip>
									</Box>
									<Typography
										gutterBottom
										variant='caption'
										color='text.secondary'
									>
										{entity.requirements.find(
											r => r.dataType === modality?.type
										)?.required
											? 'required *'
											: ''}
									</Typography>
								</Box>
							))}
						</Box>
					)}
					{modality && (
						<Box
							sx={{
								display: 'flex',
								gap: '0.8em 0.8em',
								mt: 2,
							}}
						>
							<Autocomplete
								sx={{ flexGrow: 1 }}
								options={options || []}
								inputValue={inputValue}
								onInputChange={(event: any, newInputValue: string) => {
									handleSelectedPath(newInputValue)
									setInputValue(newInputValue)
								}}
								disableCloseOnSelect={true} // tree?.find(node => node.data.path === inputValue)?.data.type !== 'file'}
								id='input-tree-view'
								renderInput={(params: unknown) => (
									<TextField {...params} label='Files' />
								)}
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
							<LoadingButton
								color='primary'
								type='submit'
								size='small'
								loading={submitted}
								onClick={handleAddFile}
								loadingPosition='start'
								startIcon={<Save />}
								variant='contained'
							>
								Add
							</LoadingButton>
						</Box>
					)}
					{modality && (
						<Box>
							<Typography
								sx={{ mt: 1, mb: 1 }}
								variant='caption'
								color='text.secondary'
							>
								Select files to be imported
							</Typography>
						</Box>
					)}{' '}
				</Box>
			</Grid>
			<Grid item xs={4}>
				<Paper elevation={3} sx={{ p: 1 }}>
					<Typography
						sx={{ mt: 1, mb: 2 }}
						variant='subtitle1'
						color='text.secondary'
					>
						Files to be imported
					</Typography>
					<TableContainer component={Paper}>
						<Table size='small' aria-label='simple table'>
							<TableHead>
								<TableRow>
									<TableCell>Actions</TableCell>
									<TableCell>Subject</TableCell>
									<TableCell>Modality</TableCell>
									<TableCell>Info</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{selectedFiles?.reverse().map(file => (
									<TableRow
										key={file.path}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align='right'>
											{/* <IconButton color='primary' aria-label='edit'>
											<Edit onClick={() => handleEditFile(file)}/>
										</IconButton> */}
											<IconButton color='primary' aria-label='delete'>
												<Delete onClick={() => handleDeleteFile(file)} />
											</IconButton>
										</TableCell>
										<TableCell>{file.subject}</TableCell>
										<TableCell>{file.modality}</TableCell>
										<TableCell>{file.path}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</Grid>
		</Grid>
	)
}

Files.displayName = 'Files'
export default Files
