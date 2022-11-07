import { Close } from '@mui/icons-material'
import {
	Box,
	Breadcrumbs,
	IconButton,
	Link,
	Paper,
	Tab,
	Tabs,
	Typography,
} from '@mui/material'
import { marked } from 'marked'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fileContent as getFileContent } from '../../api/gatewayClientAPI'
import { BIDSDataset } from '../../api/types'
import { useAppStore } from '../../store/appProvider'
import CSV2Table from '../UI/CSV2Table'
import FileBrowser from '../UI/FileBrowser'
import TitleBar from '../UI/titleBar'
import DatasetDescription from './DatasetDescription'
import DatasetInfo from './DatasetInfo'
import Import from './Import'
import Participants from './Participants'

const Dataset = () => {
	const [dataset, setDataset] = useState<BIDSDataset>()
	const [fileContent, setFileContent] = useState<JSX.Element>()
	const [selectedFile, setSelectedFile] = useState<string>()
	const [path, setPath] = useState<string>()
	const [tabIndex, setTabIndex] = useState(0)
	const params = useParams()
	const navigate = useNavigate()
	const {
		BIDSDatasets: [datasets],
	} = useAppStore()

	useEffect(() => {
		if (dataset) return

		const ds = datasets?.data?.find(dataset => dataset.id === params.datasetId)
		setDataset(ds)
	}, [dataset, datasets, params])

	useEffect(() => {
		if (!selectedFile) return
		if (/\.png|\.jpg|\.eeg|\.gz|\.zip|\.xdf/.test(selectedFile)) {
			setFileContent(
				<Box>
					<Typography>No visualization available yet</Typography>
					<Link
						target='_blank'
						href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${selectedFile.split('/').slice(0, -1).join('/')}`}
					>
						View file in NextCloud
					</Link>
				</Box>
			)

			return
		}

		getFileContent(selectedFile).then(data => {
			if (selectedFile.endsWith('.md')) {
				setFileContent(
					<div dangerouslySetInnerHTML={{ __html: marked(data) }} />
				)
			} else if (selectedFile.endsWith('.json')) {
				setFileContent(
					<pre style={{ whiteSpace: 'pre-wrap' }}>
						{JSON.stringify(JSON.parse(data), null, 2)}
					</pre>
				)
			} else if (selectedFile.endsWith('.csv')) {
				setFileContent(
					<Box sx={{ overflow: 'auto', maxWidth: '45vw' }}>
						{CSV2Table({ data })}
					</Box>
				)
			} else if (selectedFile.endsWith('.tsv')) {
				setFileContent(
					<Box sx={{ overflow: 'auto', maxWidth: '45vw' }}>
						{CSV2Table({ data, splitChar: '\t' })}
					</Box>
				)
			} else {
				setFileContent(<div>{data}</div>)
			}
		})
	}, [selectedFile])

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

	return (
		<>
			<TitleBar title='BIDS Dataset' />

			<Box sx={{ mt: 2 }}>
				<Box>
					<Breadcrumbs aria-label='breadcrumb'>
						<Link onClick={() => navigate(-1)}>Datasets</Link>
						<Typography color='text.primary'>{dataset?.Name}</Typography>
					</Breadcrumbs>
				</Box>

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
						<Tab label='Import files' id={'tab-3'} />
						{/* <Tab label='Add Participant' id={'tab-4'} /> */}
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
										{path && (
											<FileBrowser
												path={path}
												selectedFile={setSelectedFile}
												showSearch={true}
											/>
										)}
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
					{tabIndex === 2 && <Import dataset={dataset} />}
					{/* {tabIndex === 3 && <CreateParticipant dataset={dataset} />} */}
				</Box>
			</Box>
		</>
	)
}
export default Dataset