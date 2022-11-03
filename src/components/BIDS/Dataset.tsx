import { Add } from '@mui/icons-material'
import {
	Box,
	Breadcrumbs,
	Button,
	CircularProgress,
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
import FileBrowser from '../UI/FileBrowser'
import TitleBar from '../UI/titleBar'
import DatasetDescription from './DatasetDescription'
import DatasetInfo from './DatasetInfo'
import Participants from './Participants'
import CSV2Table from '../UI/CSV2Table'

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
		// if (!/\.json|\.txt|\.[t|c]sv/.test(selectedFile)) return

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
				setFileContent(CSV2Table({ data }))
			} else if (selectedFile.endsWith('.tsv')) {
				setFileContent(CSV2Table({ data, splitChar: '\t' }))
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
				'/'
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

				<Box elevation={2} component={Paper} sx={{ mt: 2, mb: 2, p: 1 }}>
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
					</Tabs>

					{tabIndex === 0 && (
						<>
							<Box sx={{ mt: 2 }}>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Typography variant='h6'>Files</Typography>
									<Button
										color='primary'
										size='small'
										sx={{ m: 2 }}
										startIcon={<Add />}
										variant='contained'
									>
										Import Files
									</Button>
								</Box>
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
											<FileBrowser path={path} selectedFile={setSelectedFile} />
										)}
									</Box>
									<Box
										elevation={2}
										component={Paper}
										sx={{
											overflowX: 'auto',
											p: 1,
											flex: '1 0',
										}}
									>
										{!fileContent && (
											<>
												<Typography variant='h6'>Infos</Typography>
												<DatasetDescription dataset={dataset} />
											</>
										)}

										{fileContent}
									</Box>
								</Box>
							</Box>
						</>
					)}

					{tabIndex === 1 && <Participants dataset={dataset} />}
				</Box>
			</Box>
		</>
	)
}
export default Dataset
