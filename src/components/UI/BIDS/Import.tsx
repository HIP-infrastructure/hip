import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Delete, Info, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Box,
	Button,
	CircularProgress,
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
import { importSubject } from '../../../api/bids'
import {
	BIDSDataset,
	CreateSubjectDto,
	BIDSFile,
	IEntity,
	Participant,
} from '../../../api/types'
import { ENTITIES, MODALITIES } from '../../../constants'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../Store'
import FileChooser from '../../UI/FileChooser'
import EntityOptions from './EntityOptions'
import ParticipantInfo from './ParticipantInfo'

const Import = ({ dataset }: { dataset?: BIDSDataset }): JSX.Element => {
	const [entities, setEntites] = useState<IEntity[]>()
	const [selectedParticipants, setSelectedParticipants] =
		useState<Participant[]>()
	const [selectedParticipant, setSelectedParticipant] = useState<string>('')
	const [selectedModality, setSelectedModality] = useState<{
		name: string
		type: 'anat' | 'ieeg' | 'ct'
	}>({ name: 'T1w', type: 'anat' })
	const [selectedEntities, setSelectedEntities] =
		useState<Record<string, string>>()
	const [selectedFile, setSelectedFile] = useState<string>()
	const [filesToImport, setFilesToImport] = useState<BIDSFile[]>([])
	const [submitted, setSubmitted] = useState(false)
	const [importResponse, setImportResponse] = useState<{
		error?: Error
		data?: CreateSubjectDto
	}>()

	const { trackEvent } = useMatomo()
	const { showNotif } = useNotification()

	const {
		user: [user],
	} = useAppStore()

	useEffect(() => {
		if (!selectedModality) return

		const entitiesForModality =
			(selectedModality &&
				ENTITIES.filter(e =>
					e.requirements.map(r => r.dataType).includes(selectedModality?.type)
				)) ||
			[]
		setEntites(entitiesForModality)
	}, [selectedModality])

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
			dataset_path: dataset?.Path,
			files: filesToImport,
			subjects,
		}

		trackEvent({
			category: 'bids',
			action: 'import',
		})

		setImportResponse(undefined)
		setSubmitted(true)
		importSubject(createSubjectDto as CreateSubjectDto)
			.then(data => {
				setImportResponse({ data })
				showNotif('Subject imported', 'success')

				setSelectedParticipants(undefined)
				setSelectedParticipant('')

				setSubmitted(false)
			})
			.catch(error => {
				setImportResponse({ error })
				showNotif('Subject importation failed', 'error')

				setSubmitted(false)
			})
	}

	const handleDeleteFile = (file: BIDSFile) => {
		const nextFiles = filesToImport?.filter(f => f.path !== file.path)
		setFilesToImport(nextFiles)
	}

	const handleAddFile = () => {
		const participant = dataset?.Participants?.find(
			p => p.participant_id === selectedParticipant
		)

		if (!participant) showNotif('Please select a subject', 'error')

		if (
			participant &&
			!selectedParticipants
				?.map(s => s.participant_id)
				.includes(participant.participant_id)
		) {
			setSelectedParticipants(s => [...(s || []), participant])
		}

		if (!(selectedModality && selectedParticipant && selectedFile)) return

		const file: BIDSFile = {
			modality: selectedModality?.name,
			subject: selectedParticipant.replace('sub-', ''),
			path: selectedFile,
			entities: {
				sub: selectedParticipant.replace('sub-', ''),
				...selectedEntities,
			},
		}

		setFilesToImport(f => [file, ...(f || [])])
		showNotif('File added.', 'success')
	}

	return (
		<Box sx={{ mt: 2 }}>
			{filesToImport.length > 0 && (
				<Box>
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
									{filesToImport?.map(file => (
										<TableRow key={file.path}>
											<TableCell padding='checkbox'>
												{/* <IconButton color='primary' aria-label='edit'>
												<Edit onClick={() => handleEditFile(file)} />
											</IconButton> */}
												{!submitted && (
													<IconButton
														onClick={() => handleDeleteFile(file)}
														color='primary'
														aria-label='delete'
													>
														<Delete />
													</IconButton>
												)}
												{submitted && !importResponse && (
													<CircularProgress size={16} />
												)}
												{importResponse?.data && (
													<Tooltip
														title={JSON.stringify(
															importResponse?.data,
															null,
															2
														)}
														placement='bottom'
													>
														<Info color='success' />
													</Tooltip>
												)}
												{importResponse?.error && (
													<Tooltip
														title={importResponse?.error.message}
														placement='bottom'
													>
														<Info color='error' />
													</Tooltip>
												)}
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
								disabled={filesToImport.length === 0 || submitted}
								loading={submitted}
								onClick={handleImportSubject}
								loadingPosition='start'
								startIcon={<Save />}
								variant='contained'
							>
								Import Files
							</LoadingButton>
							{filesToImport.length > 0 && importResponse && !submitted && (
								<Button
									sx={{ flex: '1 1' }}
									color='primary'
									type='submit'
									onClick={() => {
										setFilesToImport([])
										setImportResponse(undefined)
									}}
									variant='contained'
								>
									Clear imported files
								</Button>
							)}
						</Box>
					</Box>
				</Box>
			)}
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
								<Typography sx={{ mt: 1, mb: 2 }} variant='body2'>
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
											value={selectedParticipant || ''}
											onChange={event => {
												setSelectedParticipant(event.target.value)
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
									<Box sx={{ display: 'flex' }}>
										<TextField
											sx={{ flex: '1 1' }}
											select
											size='small'
											disabled={submitted}
											name='modality'
											label='Modality'
											value={selectedModality.name || ''}
											onChange={event => {
												const m = MODALITIES.find(
													modality => modality.name === event.target.value
												)
												if (m) setSelectedModality(m)
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
									{selectedModality && (
										<Typography sx={{ mt: 1 }} variant='body2'>
											BIDS entities
										</Typography>
									)}
									{selectedModality && (
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
															r => r.dataType === selectedModality?.type
														)?.required
															? 'required *'
															: ''}
													</Typography>
												</Box>
											))}
										</Box>
									)}

									<Box
										sx={{
											mt: 2,
											display: 'flex',
											alignItems: 'start',
											justifyContent: 'space-between',
											gap: '1em',
										}}
									>
										<Box sx={{ flex: '4', width: '100%' }}>
											<FileChooser
												handleSelectedFile={path => setSelectedFile(path)}
											/>
										</Box>
										<Button
											sx={{ flex: '1 1' }}
											color='primary'
											type='submit'
											disabled={selectedFile === undefined || submitted}
											onClick={handleAddFile}
											variant='contained'
										>
											Add File
										</Button>
									</Box>
								</Box>
							</Box>
							<Box sx={{ flex: '1 0' }}>
								<Typography sx={{ mt: 1, mb: 2, ml: 2 }} variant='body2'>
									Subject description
								</Typography>
								<ParticipantInfo
									dataset={dataset}
									subject={selectedParticipant}
								/>
							</Box>
						</Paper>

						<Box sx={{ m: 3, textAlign: 'center' }}></Box>
					</Box>
					<Box sx={{ m: 3, textAlign: 'center' }}></Box>
				</Box>
			</Box>
		</Box>
	)
}

Import.displayName = 'Import'
export default Import
