import { Close } from '@mui/icons-material'
import {
	Box,
	Button,
	IconButton,
	Paper,
	Tab,
	Tabs,
	Typography,
} from '@mui/material'
// import marked from 'marked'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { getProjectMetadataTree, importBIDSSubject } from '../../api/projects'
import { InspectResult } from '../../api/types'
import { useAppStore } from '../../Store'
import DatasetDescription from '../BIDS/DatasetDescription'
import DatasetInfo from '../BIDS/DatasetInfo'
import Participants from './ParticipantsTab'
import DatasetSubjectChooser from '../UI/DatasetSubjectChooser'
import MetadataBrowser from '../UI/MetadataBrowser'
import TitleBar from '../UI/titleBar'

const Dataset = () => {
	const [files, setFiles] = useState<InspectResult>()
	const [fileContent, setFileContent] = useState<JSX.Element>()
	const [tabIndex, setTabIndex] = useState(0)
	const [selectedSubject, setSelectedSubject] = useState<string[]>()
	const {
		selectedProject: [selectedProject],
	} = useAppStore()

	useEffect(() => {
		if (selectedProject) {
			getProjectMetadataTree(selectedProject.name).then(f => setFiles(f))
		}
	}, [selectedProject])

	const importSubject = () => {
		const [datasetPath, subjectId] = selectedSubject || []
		importBIDSSubject({ datasetPath, subjectId }, selectedProject?.name || '')
	}

	return (
		<>
			<TitleBar title={`BIDS Dataset: ${selectedProject?.title || ''} `} />

			<Box sx={{ mt: 2 }}>
				<Box elevation={2} component={Paper} sx={{ mt: 2, mb: 2, p: 2 }}>
					<Typography variant='h6'>{selectedProject?.dataset?.Name}</Typography>
					<DatasetInfo dataset={selectedProject?.dataset} />
				</Box>

				<Box>
					<Tabs
						value={tabIndex}
						onChange={(event: React.SyntheticEvent, newValue: number) =>
							setTabIndex(newValue)
						}
						aria-label='BIDS info tabs'
					>
						<Tab label='Files' id={'tab-1'} />
						<Tab label='Participants' id={'tab-2'} />
						<Tab label='Transfer Participant' id={'tab-3'} />
					</Tabs>

					{tabIndex === 0 && (
						<>
							<Box sx={{ mt: 2 }}>
								<Typography variant='h6'>Files</Typography>
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: '16px 16px',
										mt: 2,
									}}
								>
									<Box
										elevation={2}
										component={Paper}
										sx={{ p: 1, flex: '1 0' }}
									>
										<MetadataBrowser
											files={files?.children
												.find((f: InspectResult) => f.name === 'inputs')
												?.children?.find(
													(f: InspectResult) => f.name === 'bids-dataset'
												)}
										/>
									</Box>
									<Box
										elevation={2}
										component={Paper}
										sx={{
											overflow: 'auto',
											p: 2,
											flex: '1 1',
										}}
									>
										{!fileContent && (
											<DatasetDescription dataset={selectedProject?.dataset} />
										)}
										{fileContent && (
											<Box>
												<Box sx={{ float: 'right' }}>
													<IconButton onClick={() => setFileContent(undefined)}>
														<Close />
													</IconButton>
												</Box>
												{fileContent}
											</Box>
										)}
									</Box>
								</Box>
							</Box>
						</>
					)}

					{tabIndex === 1 && (
						<Participants dataset={selectedProject?.dataset} />
					)}
					{tabIndex === 2 && (
						<Box sx={{ mt: 2 }}>
							<Typography variant='h6'>Copy Files</Typography>
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
										selected={(datasetPath, subjectId) => {
											setSelectedSubject([datasetPath, subjectId])
										}}
									/>
								</Box>
								<Button
									sx={{ my: 0.5 }}
									variant='outlined'
									size='small'
									aria-label='move selected right'
									onClick={importSubject}
								>
									&gt;
								</Button>
								<Box elevation={2} component={Paper} sx={{ p: 1, flex: '1 0' }}>
									<Typography gutterBottom variant='h6' component='div'>
										BIDS dataset {selectedProject?.dataset?.Name} Files
									</Typography>
									<MetadataBrowser
										files={files?.children
											.find((f: InspectResult) => f.name === 'inputs')
											?.children?.find(
												(f: InspectResult) => f.name === 'bids-dataset'
											)}
									/>
								</Box>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</>
	)
}
export default Dataset
