import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Article, Delete, Folder, Info, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Autocomplete,
	Box,
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
import React, { useEffect, useState } from 'react'
import { importSubject } from '../../api/bids'
import { getFiles } from '../../api/gatewayClientAPI'
import {
	BIDSDataset,
	CreateSubjectDto,
	File,
	IEntity,
	Participant,
	TreeNode,
} from '../../api/types'
import { ENTITIES, MODALITIES } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../store/appProvider'
import EntityOptions from './EntityOptions'
import ParticipantInfo from './ParticipantInfo'

const Import = ({ dataset }: { dataset?: BIDSDataset }): JSX.Element => {
	const [tree, setTree] = useState<TreeNode[]>()
	const [options, setOptions] = React.useState<string[]>()
	const [fileInputValue, setFileInputValue] = React.useState<string>()
	const [submitted] = useState(false)
	const { showNotif } = useNotification()
	const [currentBidsFile, setCurrentBidsFile] = useState<File>()
	const [modality, setModality] = useState<{
		name: string
		type: 'anat' | 'ieeg'
	}>({ name: 'T1w', type: 'anat' })
	const [selectedSubject, setSelectedSubject] = useState<string>('')
	const [selectedEntities, setSelectedEntities] =
		useState<Record<string, string>>()
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [selectedParticipants, setSelectedParticipants] =
		useState<Participant[]>()
	const [entities, setEntites] = useState<IEntity[]>()
	const { trackEvent } = useMatomo()

	const {
		user: [user],
	} = useAppStore()

	useEffect(() => {
		getFiles('/').then(f => {
			setTree(f)
		})
	}, [])

	useEffect(() => {
		if (!modality) return

		const entitiesForModality =
			(modality &&
				ENTITIES.filter(e =>
					e.requirements.map(r => r.dataType).includes(modality?.type)
				)) ||
			[]
		setEntites(entitiesForModality)

		// if (!selectedSubjectExistingBIDSFiles) {
		// 	return
		// }

		// const nextEntities = entitiesForModality?.map(e => {
		// 	const entries = selectedSubjectExistingBIDSFiles
		// 		.filter(i => i.modality === modality?.name)
		// 		.find(eem => {
		// 			return Object.keys(eem).find(k => k === e.name)
		// 		})
		// 	if (!entries) return e

		// 	const mod = (entries as Record<string, any>)[e.name]

		// 	if (mod)
		// 		return {
		// 			...e,
		// 			options: Array.from(new Set([...e.options, mod])).map(label => ({
		// 				label,
		// 			})),
		// 		}
		// 	else return e
		// })

		// if (nextEntities) setEntites(nextEntities)
	}, [modality])

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
				// filter file types by modality
				// FIXME: -> constants/types
				?.filter(node => {
					if (node.data.type === 'dir') return true

					if (modality?.type === 'anat') {
						return /nii|dcm/.test(node.data.path)
					}

					if (modality?.type === 'ieeg') {
						return /vhdr|vmrk|eeg|edf|bdf|set|/.test(node.data.path)
					}

					return true
				})
				?.sort(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(a: { data: { path: any } }, b: { data: { path: string } }) =>
						-b.data.path.localeCompare(a.data.path)
				) || []),
		]?.map(node => node.data.path)

		setOptions(nextOptions)
	}, [tree, fileInputValue, modality])

	const handleImportSubject = async () => {
		if (!user?.uid && !dataset?.Path) {
			showNotif('No dataset selected', 'error')
			return
		}

		const subjects = selectedParticipants?.map(s => {
			const { participant_id, ...other } = s

			return {
				...other,
				sub: participant_id.replace('sub-', ''),
			}
		})

		const createSubjectDto: Partial<CreateSubjectDto> = {
			owner: user?.uid,
			dataset: dataset?.Name,
			path: dataset?.Path,
			files: selectedFiles,
			subjects,
		}

		trackEvent({
			category: 'bids',
			action: 'import',
		})

		importSubject(createSubjectDto as CreateSubjectDto)
			.then(data => {
				showNotif('Subject imported', 'success')
			})
			.catch(error => {
				showNotif('Subject importation failed', 'error')
			})
	}

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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setCurrentBidsFile((f: any) => ({
			...f,
			path: selectedNode?.data.path,
		}))
	}

	const handleDeleteFile = (file: File) => {
		const nextFiles = selectedFiles?.filter(f => f.path !== file.path)
		setSelectedFiles(nextFiles)
	}

	// const handleEditFile = (file: File) => {
	// 	setSelectedSubject(file.subject)
	// 	if (file.modality) {
	// 		const m = MODALITIES.find(mod => mod.name === file.modality)
	// 		if (m) setModality(m)
	// 	}

	// 	if (file.entities) setSelectedEntities(file.entities)
	// 	if (file.path) {
	// 		const path = `/${file.path}`
	// 		handleSelectedPath(path)
	// 		setFileInputValue(path)
	// 	}

	// 	handleDeleteFile(file)
	// }

	const handleAddFile = () => {
		const participant = dataset?.Participants?.find(
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

	return (
		<Box sx={{ mt: 2 }}>
			<Typography variant='h6'>Files to be imported</Typography>

			<Box sx={{ mt: 1 }}>
				<TableContainer component={Paper}>
					<Table size='small' aria-label='Files to be imported'>
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell>Subject</TableCell>
								<TableCell>Modality</TableCell>
								<TableCell>File</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedFiles?.reverse().map(file => (
								<TableRow key={file.path}>
									<TableCell padding='checkbox'>
										{/* <IconButton color='primary' aria-label='edit'>
												<Edit onClick={() => handleEditFile(file)} />
											</IconButton> */}
										<IconButton color='primary' aria-label='delete'>
											<Delete onClick={() => handleDeleteFile(file)} />
										</IconButton>
									</TableCell>
									<TableCell>{file.subject}</TableCell>
									<TableCell>{file.modality}</TableCell>
									<TableCell sx={{ overflow: 'auto' }}>
										{
											file.path //.split('/').pop()
										}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Box sx={{ m: 3, textAlign: 'center' }}>
					<LoadingButton
						sx={{ width: 320 }}
						color='primary'
						type='submit'
						disabled={selectedFiles !== undefined}
						loading={submitted}
						onClick={handleImportSubject}
						loadingPosition='start'
						startIcon={<Save />}
						variant='contained'
					>
						Import Files
					</LoadingButton>
				</Box>
			</Box>
			<Box sx={{ mt: 2 }}>
				<Typography variant='h6'>
					Add new files to be imported / converted
				</Typography>
				<Box sx={{ mt: 1 }}>
					<Box>
						<Paper
							elevation={2}
							sx={{ display: 'flex', p: 1, mb: 4, gap: '8px' }}
						>
							<Box sx={{ flex: '2 0' }}>
								<Typography
									sx={{ mt: 1, mb: 2 }}
									variant='body2'
									color='text.secondary'
								>
									Select the subject, modality, the BIDS entities, and the
									corresponding file or folder
								</Typography>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: '0.8em 0.8em',
									}}
								>
									{dataset?.Participants && (
										<TextField
											select
											fullWidth
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
											{dataset?.Participants?.map(p => (
												<MenuItem
													key={p.participant_id}
													value={p.participant_id}
												>
													{p.participant_id}
												</MenuItem>
											))}
										</TextField>
									)}
									{selectedSubject && (
										<Box sx={{ display: 'flex' }}>
											<TextField
												sx={{ flex: '1 1' }}
												select
												size='small'
												disabled={submitted}
												name='modality'
												label='Modality'
												value={modality}
												onChange={event => {
													const m = MODALITIES.find(
														modality => modality.name === event.target.value
													)
													if (m) setModality(m)
												}}
											>
												{MODALITIES?.map(m => (
													<MenuItem value={m.name} key={m.name}>
														{m.name} ({m.type})
													</MenuItem>
												))}
											</TextField>
											<Box sx={{ flex: '1 1' }} />
										</Box>
									)}
									{modality && (
										<Typography
											sx={{ mt: 1 }}
											variant='body2'
											color='text.secondary'
										>
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
												<Box key={entity.name}>
													<Box
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
										<Autocomplete
											sx={{ mt: 2 }}
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
											renderInput={(params: any) => (
												<TextField {...params} label='Files' />
											)}
											renderOption={(props, option) => {
												const node = tree?.find(
													node => node.data.path === option
												)

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
									)}
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										<Box></Box>
									</Box>
								</Box>
							</Box>
							<Box sx={{ flex: '1 0' }}>
								<Typography
									sx={{ mt: 1, mb: 2 }}
									variant='body2'
									color='text.secondary'
								>
									Subject description
								</Typography>
								<ParticipantInfo dataset={dataset} subject={selectedSubject} />
							</Box>
						</Paper>
						<Box sx={{ m: 3, textAlign: 'center' }}></Box>
					</Box>
					<Box sx={{ m: 3, textAlign: 'center' }}>
						<LoadingButton
							sx={{ width: 320 }}
							color='primary'
							type='submit'
							disabled={currentBidsFile === undefined}
							loading={submitted}
							onClick={handleAddFile}
							loadingPosition='start'
							startIcon={<Save />}
							variant='contained'
						>
							Add File
						</LoadingButton>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

Import.displayName = 'Import'
export default Import
