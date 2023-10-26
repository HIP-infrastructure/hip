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
// import marked from 'marked'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fileContent as getFileContent } from '../../../api/gatewayClientAPI'
import { BIDSDataset } from '../../../api/types'
import { useAppStore } from '../../../Store'
import CSV2Table from '../../UI/CSV2Table'
import FileBrowser from '../../UI/FileBrowser'
import TitleBar from '../../UI/titleBar'
import DatasetDescription from './DatasetDescription'
import DatasetInfo from './DatasetInfo'
import Import from './Import'
import Participants from './Participants'
import { getAllBidsDataset } from '../../../api/bids'
import { useNotification } from '../../../hooks/useNotification'

const Dataset = () => {
	const [dataset, setDataset] = useState<BIDSDataset>()
	const [fileContent, setFileContent] = useState<JSX.Element>()
	const [selectedFile, setSelectedFile] = useState<string>()
	const [tabIndex, setTabIndex] = useState(0)
	const [bidsDatasets, setBidsDatasets] = useState<BIDSDataset[]>()

	const params = useParams()
	const navigate = useNavigate()
	const { showNotif } = useNotification()

	const {
		user: [user],
	} = useAppStore()

	useEffect(() => {
		if (!user?.uid) return

		getAllBidsDataset(user?.uid)
			.then(datasets => {
				if (datasets) setBidsDatasets(datasets)
			})
			.catch(e => {
				showNotif(e.message, 'error')
			})
	}, [user])

	useEffect(() => {
		if (dataset) return

		const ds = bidsDatasets?.find(dataset => dataset.id === params.datasetId)
		setDataset(ds)
	}, [dataset, bidsDatasets, params])

	useEffect(() => {
		if (!selectedFile) return
		if (/\.png|\.jpg|\.eeg|\.gz|\.zip|\.xdf/.test(selectedFile)) {
			setFileContent(
				<Box>
					<Typography>No visualization available yet</Typography>
					<Link
						target='_blank'
						href={`${window.location.protocol}//${
							window.location.host
						}/apps/files/?dir=${selectedFile
							.split('/')
							.slice(0, -1)
							.join('/')}`}
					>
						View file in NextCloud
					</Link>
				</Box>
			)

			return
		}

		getFileContent(selectedFile)
			.then(data => {
				if (selectedFile.endsWith('.md')) {
					setFileContent(
						<div dangerouslySetInnerHTML={{ __html: data }} /> // marked(data) }} />
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
			.catch(e => {
				showNotif(e.message, 'error')
			})
	}, [selectedFile])

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
					<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
						id: {dataset?.id}
					</Typography>
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
										{dataset?.Path && (
											<FileBrowser
												path={dataset.Path}
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
					{tabIndex === 1 && (
						<Participants dataset={dataset} setDataset={setDataset} />
					)}
					{tabIndex === 2 && <Import dataset={dataset} />}
				</Box>
			</Box>
		</>
	)
}
export default Dataset
