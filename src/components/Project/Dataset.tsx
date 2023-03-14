import { Close } from '@mui/icons-material'
import {
	Box,
	Breadcrumbs,
	Button,
	IconButton,
	Link,
	Paper,
	Tab,
	Tabs,
	Typography,
} from '@mui/material'
// import marked from 'marked'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BIDSDataset } from '../../api/types'
import { useAppStore } from '../../Store'
import FileBrowser from '../UI/FileBrowser'
import TitleBar from '../UI/titleBar'
import DatasetDescription from '../BIDS/DatasetDescription'
import DatasetInfo from '../BIDS/DatasetInfo'
import Participants from '../BIDS/Participants'
import DatasetSubjectChooser from '../UI/DatasetSubjectChooser'
import { importBIDSSubject } from '../../api/projects'

const Dataset = () => {
	const [dataset, setDataset] = useState<BIDSDataset>()
	const [fileContent, setFileContent] = useState<JSX.Element>()
	const [path, setPath] = useState<string>()
	const [tabIndex, setTabIndex] = useState(0)
	const [selectedSubject, setSelectedSubject] = useState<string[]>()
	const params = useParams()
	const {
		BIDSDatasets: [datasets],
		userProjects: [userProjects],
	} = useAppStore()

	useEffect(() => {
		if (dataset) return

		const ds = datasets?.data?.find(dataset => dataset.id === params.datasetId)
		setDataset(ds)
	}, [dataset, datasets, params])

	// FIXME: This is a temporary solution to get datasets path
	useEffect(() => {
		if (dataset) {
			const nextPath = dataset.Path?.replace(
				/mnt\/nextcloud-dp\/nextcloud\/data\/.*?\/files\//,
				''
			).replace(
				/\/mnt\/nextcloud-dp\/nextcloud\/data\/__groupfolders\/.*?\//,
				'/groupfolder/'
			)

			if (nextPath) setPath(nextPath)
		}
	}, [dataset])

	const importSubject = () => {
		const [datasetPath, subjectId] = selectedSubject || []
		importBIDSSubject({ datasetPath, subjectId }, project?.name || '')
	}

	const project = userProjects?.find(
		project => project.name === params?.projectId
	)

	return (
		<>
			<TitleBar title={`${project?.title} BIDS Dataset`} />

			<Box sx={{ mt: 2 }}>
				<Box elevation={2} component={Paper} sx={{ mt: 2, mb: 2, p: 2 }}>
					<Typography variant='h6'>{dataset?.Name}</Typography>
					<DatasetInfo dataset={dataset} />
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
						<Tab label='Copy files' id={'tab-3'} />
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
										{path && <FileBrowser path={path} showSearch={true} />}
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
										{!fileContent && <DatasetDescription dataset={dataset} />}
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

					{tabIndex === 1 && <Participants dataset={dataset} />}
					{tabIndex === 2 && (
						<Box sx={{ mt: 2 }}>
							<Typography variant='h6'>Copy Files</Typography>
							<Box
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
									gap: '16px 16px',
									alignItems: 'center',
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
								<Box
									elevation={2}
									component={Paper}
									sx={{
										overflow: 'auto',
										p: 2,
										flex: '1 1',
									}}
								>
									<Box>
										<Typography gutterBottom variant='h6' component='div'>
											{dataset?.Name}
										</Typography>
										<Box>Dataset Files</Box>
									</Box>
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
