import { Close } from '@mui/icons-material'
import { Box, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getProjectMetadataTree } from '../../api/projects'
import { InspectResult } from '../../api/types'
import { useAppStore } from '../../Store'
import DatasetDescription from '../BIDS/DatasetDescription'
import DatasetInfo from '../BIDS/DatasetInfo'
import MetadataBrowser from '../UI/MetadataBrowser'
import TitleBar from '../UI/titleBar'
import ParticipantsTab from './ParticipantsTab'

const Dataset = () => {
	const [files, setFiles] = useState<InspectResult>()
	const [fileContent, setFileContent] = useState<JSX.Element>()
	const [tabIndex, setTabIndex] = useState(0)

	const {
		selectedProject: [selectedProject],
	} = useAppStore()

	useEffect(() => {
		if (selectedProject) {
			getProjectMetadataTree(selectedProject.name).then(f => setFiles(f))
		}
	}, [selectedProject])

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
												?.find((f: InspectResult) => f.name === 'inputs')
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
						<ParticipantsTab dataset={selectedProject?.dataset} />
					)}
				</Box>
			</Box>
		</>
	)
}
export default Dataset
