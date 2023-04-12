import { Upload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material'
import * as React from 'react'
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
import MetadataBrowser from '../UI/MetadataBrowser'

export default function TransferData() {
	const { showNotif } = useNotification()
	const {
		selectedProject: [selectedProject, setSelectedProject],
	} = useAppStore()
	const [files, setFiles] = React.useState<InspectResult>()
	const [tabIndex, setTabIndex] = React.useState(0)
	const [path] = React.useState<string>('/')
	const [sourceSelected, setSourceSelected] = React.useState<string>()
	const [targetSelected, setTargetSelected] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [transfered, setTransfered] = React.useState(false)
	const [selectedSubject, setSelectedSubject] = React.useState<string[]>()

	React.useEffect(() => {
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

	return (
		<Box sx={{ mb: 2 }}>
			<TitleBar title={`Transfer data to ${selectedProject?.title || ''} `} />

			<Tabs
				value={tabIndex}
				onChange={(event: React.SyntheticEvent, newValue: number) =>
					setTabIndex(newValue)
				}
				aria-label='Matadata tabs'
			>
				<Tab label='Transfer BIDS Subject' id={'tab-1'} />
				<Tab label='Transfer Files' id={'tab-2'} />
			</Tabs>

			{tabIndex === 0 && (
				<Box sx={{ mt: 2 }}>
					<Typography variant='h6'>
						Transfer BIDS Subject from your Center
					</Typography>
					<Typography sx={{ mb: 2 }}>
						Select a subject on the left, then click import
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '16px 16px',
							alignItems: 'start',
							mt: 2,
						}}
					>
						<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
							<Typography gutterBottom variant='h6' component='div'>
								My Datasets
							</Typography>
							<DatasetSubjectChooser
								setSelected={(datasetPath, subjectId) => {
									setSelectedSubject([datasetPath, subjectId])
								}}
							/>
						</Box>
						<LoadingButton
							color='primary'
							size='small'
							sx={{ my: 0.5 }}
							disabled={selectedSubject?.length === 0}
							onClick={handleImportSubject}
							loading={loading}
							loadingPosition='start'
							startIcon={<Upload />}
							variant='outlined'
						>
							Import
						</LoadingButton>
						<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
							<Typography gutterBottom variant='h6' component='div'>
								BIDS dataset
							</Typography>
							<MetadataBrowser
								files={files?.children
									?.find((f: InspectResult) => f.name === 'inputs')
									?.children?.find(
										(f: InspectResult) => f.name === 'bids-dataset'
									)}
							/>
						</Box>
					</Box>
				</Box>
			)}
			{tabIndex === 1 && (
				<Box sx={{ mt: 2 }}>
					<Typography variant='h6'>Transfer Files</Typography>
					<Typography sx={{ mb: 2 }}>
						Select a source document on the left and a target directory on the
						right then click import
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '16px 16px',
							alignItems: 'start',
							mt: 2,
						}}
					>
						<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
							<Typography gutterBottom variant='h6' component='div'>
								My Files
							</Typography>

							{path && (
								<FileBrowser
									path={path}
									setSelected={setSourceSelected}
									showSearch={true}
									unselect={transfered}
								/>
							)}
						</Box>
						<Box>
							<LoadingButton
								color='primary'
								size='small'
								sx={{ my: 0.5 }}
								disabled={!sourceSelected || !targetSelected}
								onClick={handleImportDocument}
								loading={loading}
								loadingPosition='start'
								startIcon={<Upload />}
								variant='outlined'
							>
								Import
							</LoadingButton>
						</Box>
						<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
							<Typography gutterBottom variant='h6' component='div'>
								Project Files
							</Typography>

							<TransferMetadataBrowser
								files={files}
								setSelected={setTargetSelected}
								unselect={transfered}
							/>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	)
}
