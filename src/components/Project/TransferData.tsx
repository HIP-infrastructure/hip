import { CloudUpload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material'
import React, { useEffect } from 'react'
import {
	getProject,
	getProjectMetadataTree,
	importBIDSSubject,
	importDocument,
} from '../../api/projects'
import { InspectResult } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import FileBrowser from './Files/FileBrowser'
import TitleBar from '../UI/titleBar'
import TransferMetadataBrowser from './Files/MetadataBrowser'
import DatasetSubjectChooser from '../UI/DatasetSubjectChooser'

export default function TransferData() {
	const { showNotif } = useNotification()
	const {
		selectedProject: [selectedProject, setSelectedProject],
		user: [user],
		centers: [centers],
	} = useAppStore()

	const [files, setFiles] = React.useState<InspectResult>()
	const [tabIndex, setTabIndex] = React.useState(0)
	const [path] = React.useState<string>('/')
	const [sourceSelected, setSourceSelected] = React.useState<string>()
	const [targetSelected, setTargetSelected] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [transfered, setTransfered] = React.useState(false)
	const [selectedSubject, setSelectedSubject] = React.useState<string[]>()

	useEffect(() => {
		if (selectedProject) {
			getProjectMetadataTree(selectedProject.name).then(f => setFiles(f))
		}
	}, [selectedProject])

	const handleImportSubject = () => {
		if (!selectedProject?.name) return

		if (selectedSubject?.length === 0) {
			showNotif('You need to select a subject', 'warning')
			return
		}

		setLoading(true)
		const [datasetPath, subjectId] = selectedSubject || []
		importBIDSSubject({ datasetPath, subjectId }, selectedProject?.name)
			.then(() => {
				showNotif('Subject imported', 'success')
				getProjectMetadataTree(selectedProject.name).then(f => setFiles(f))
				setSelectedSubject([])
				getProject(selectedProject.name).then(project => {
					setSelectedProject(project)
				})
				setLoading(false)
			})
			.catch(e => {
				showNotif(`${e}`, 'error')
				setLoading(false)
			})
	}

	const handleImportDocument = () => {
		if (!selectedProject?.name) return

		if (!sourceSelected) {
			showNotif('You need to select a source document', 'warning')
			return
		}
		if (!targetSelected) {
			showNotif('You need to select a target folder', 'warning')
			return
		}

		setLoading(true)
		setTransfered(false)

		importDocument(
			{ sourceFilePath: sourceSelected, targetDirPath: targetSelected },
			selectedProject?.name || ''
		)
			.then(() => {
				showNotif('Document imported', 'success')
				getProjectMetadataTree(selectedProject.name).then(f => setFiles(f))
				setLoading(false)
				setTimeout(() => setTransfered(true), 1000)
			})
			.catch(e => {
				showNotif(`${e}`, 'error')
				setLoading(false)
			})
	}

	const userCenters =
		(
			user?.groups &&
			centers?.filter(center => user?.groups?.includes(center.id))
		)
			?.map(center => center.label)
			.join(', ') || null

	const projectTitle = selectedProject?.title || ''

	return (
		<Box sx={{ mb: 2 }}>
			<TitleBar
				title={`Transfer data to ${selectedProject?.title || ''} `}
				description='Transfer center data to a project '
			/>

			<Box sx={{ mt: 2, mb: 2 }}>
				<Box elevation={2} component={Paper} sx={{ mt: 2, mb: 2 }}>
					{/* <CardMedia
						component='img'
						height='160'
						title={
							'Image generated by DreamStudio, Text-to-Image Generative Art, https://beta.dreamstudio.ai/dream'
						}
						src={`${API_GATEWAY}/public/media/3281435885_dendrites__technology__meta___database__information__network__neural_path__futuristic_and_medical__r.png`}
					/> */}
				</Box>

				<Tabs
					sx={{ mt: 2 }}
					value={tabIndex}
					onChange={(event: React.SyntheticEvent, newValue: number) =>
						setTabIndex(newValue)
					}
					aria-label='Metadata tabs'
				>
					<Tab label='Transfer a document' id={'tab-1'} />
					<Tab label='Transfer a BIDS Subject' id={'tab-2'} />
				</Tabs>

				{tabIndex === 0 && (
					<Box sx={{ mt: 2 }}>
						<Box elevation={2} component={Paper} sx={{ mt: 2, mb: 2, p: 2 }}>
							<Box
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: '16px 16px',
									alignItems: 'start',
								}}
							>
								<Box width={320}>
									<Typography gutterBottom variant='h6' component='div'>
										Files in {userCenters}
									</Typography>

									<Box
										elevation={2}
										component={Paper}
										sx={{ p: 1, flex: '1 0' }}
									>
										{path && (
											<FileBrowser
												path={path}
												setSelected={setSourceSelected}
												showSearch={true}
												unselect={transfered}
											/>
										)}
									</Box>
								</Box>

								<Box sx={{ mt: 8 }} display={'flex'} justifyContent={'center'}>
									<LoadingButton
										color='primary'
										size='small'
										sx={{ my: 0.5 }}
										disabled={!sourceSelected || !targetSelected}
										onClick={handleImportDocument}
										loading={loading}
										loadingPosition='start'
										startIcon={<CloudUpload />}
										variant='outlined'
									>
										Transfer
									</LoadingButton>
								</Box>

								<Box width={320}>
									<Typography gutterBottom variant='h6' component='div'>
										Files in {projectTitle}
									</Typography>
									<Box
										elevation={2}
										component={Paper}
										sx={{ p: 1, flex: '1 0' }}
									>
										<TransferMetadataBrowser
											files={files}
											setSelected={setTargetSelected}
											unselect={transfered}
										/>
									</Box>
								</Box>
							</Box>
						</Box>

						{/* <Box sx={{ mb: 2 }} display={'flex'} justifyContent={'center'}>
							<Stack width={320} >
								<Laptop fontSize='large'/>
								{userCenters}
							</Stack>
							<Box width={320}>
								----------->
							</Box>
							<Stack width={320}>
								<Storage fontSize='large'/>
								{projectTitle}
							</Stack>
						</Box> */}

						<Typography sx={{ mb: 2 }}>
							<Box sx={{ ml: 4 }}>
								<ol>
									<li>Select a document in &quot;{userCenters}&quot;</li>
									<li>
										Select a destination folder in &quot;{projectTitle}&quot;
									</li>
									<li>Click on transfer</li>
								</ol>
							</Box>
						</Typography>
					</Box>
				)}

				{tabIndex === 1 && (
					<Box sx={{ mt: 2 }}>
						<Box elevation={2} component={Paper} sx={{ mt: 2, mb: 2, p: 2 }}>
							<Box>
								<Typography gutterBottom variant='h6' component='div'>
									{userCenters}&apos;s Datasets
								</Typography>
								<Box
									elevation={2}
									component={Paper}
									sx={{ p: 1, flex: '1 0' }}
									width={320}
								>
									<DatasetSubjectChooser
										setSelected={(datasetPath, subjectId) => {
											setSelectedSubject([datasetPath, subjectId])
										}}
									/>
								</Box>
							</Box>
							<Box sx={{ mt: 2 }}>
								<LoadingButton
									color='primary'
									size='small'
									sx={{ my: 0.5 }}
									disabled={!selectedSubject || selectedSubject?.length === 0}
									onClick={handleImportSubject}
									loading={loading}
									loadingPosition='start'
									startIcon={<CloudUpload />}
									variant='outlined'
								>
									Transfer
								</LoadingButton>
							</Box>
						</Box>

						<Typography sx={{ mb: 2 }}>
							<Box sx={{ ml: 4 }}>
								<ol>
									<li>
										Select a subject in one of &quot;{userCenters}&apos;s
										Datasets&quot;
									</li>
									<li>
										Click transfer to push the subject to &quot;{projectTitle}
										&quot;
									</li>
								</ol>
							</Box>
						</Typography>
						{/* <Box sx={{ mt: 2 }}>
								<Typography gutterBottom variant='h6' component='div'>
									BIDS dataset
								</Typography>
								<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
									<MetadataBrowser
										files={files?.children
											?.find((f: InspectResult) => f.name === 'inputs')
											?.children?.find(
												(f: InspectResult) => f.name === 'bids-dataset'
											)}
									/>
								</Box>
							</Box> */}
					</Box>
				)}
			</Box>
		</Box>
	)
}
