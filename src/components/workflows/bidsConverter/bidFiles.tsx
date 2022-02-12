import DynamicForm from '../bidsConverter/../../UI/dynamicForm'
import {
	Box,
	Button,
	InputLabel,
	Select,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import React, { useState, useEffect, ChangeEvent } from 'react'
import {
	getJsonFileContent,
	getFiles,
	TreeNode,
	search,
	getFileContent,
	createFolder,
} from '../../../api/gatewayClientAPI'
import { BIDSDatabase, BIDSSubject } from '../../bidsConvert'
import FileBrowser from '../../UI/fileBrowser'
import CreateField from '../../UI/createField'

interface IBIDSFiles {
	subject?: BIDSSubject
	database?: BIDSDatabase
}

interface Modality {
	name: string
	type: string
}

interface Session {
	label: string
}

interface File {
	path: string
	session: Session
	modality: Modality
}

const modalities: Modality[] = [
	{ name: 'T1w', type: 'Anat' },
	{ name: 'T2w', type: 'Anat' },
	{ name: 'T1rho', type: 'Anat' },
	{ name: 'T2start', type: 'Anat' },
	{ name: 'FLAIR', type: 'Anat' },
	{ name: 'CT', type: 'Anat' },
	{ name: 'ieeg', type: 'IEEG' },
	{ name: 'electrodes', type: 'IeegGlobalSidecars' },
	{ name: 'coordsystem', type: 'IeegGlobalSidecars' },
	{ name: 'photo', type: 'IeegGlobalSidecars' },
]

const entities1 = {
	Anat: [
		'defacemask',
		'MESE MEGRE',
		'VFA',
		'IRT1',
		'MP2RAGE',
		'MPM MTS',
		'MTR',
	],
}

const entities = {
	Session: '',
	Acquisition: '',
	Reconstruction: '',
	Processed: '',
}

const BIDSFiles = ({ subject, database }: IBIDSFiles) => {
	const [filesPanes, setFilesPanes] = useState<TreeNode[][]>()
	const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0)
	const [currentBidsFile, setCurrentBidsFile] = useState<File>()
	const [bidsFiles, setBidsFiles] = useState<File[]>()

	useEffect(() => {
		files('/').then(f => setFilesPanes([f]))
	}, [])

	const files = async (path: string) => {
		return await getFiles(path)
	}

	const handleSelectedPath = async (pathes: string[]) => {
		const path = pathes.join('')
		setCurrentBidsFile(f => (f ? { ...f, path } : { path }))

		const result = await files(path)
		setFilesPanes(prev => {
			if (!prev) return [result]

			prev[pathes.length - 1] = result
			prev.splice(pathes.length)

			return prev
		})
		forceUpdate()
	}

	const handleAddFile = () => {
		if (currentBidsFile) setBidsFiles([...(bidsFiles || []), currentBidsFile])

		setCurrentBidsFile(undefined)
	}

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>File</TableCell>
								<TableCell align='right'>Modality</TableCell>
								<TableCell align='right'>Entities</TableCell>
								<TableCell align='right'>Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{bidsFiles?.map(file => (
								<TableRow
									key={file.path}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component='th' scope='row'>
										{file.path}
									</TableCell>
									<TableCell align='right'>{file.modality}</TableCell>
									<TableCell align='right'>{file.session}</TableCell>
									<TableCell align='right'>
										<Button variant='outlined' size='small' sx={{ mt: 2 }}>
											Edit
										</Button>
										<Button variant='outlined' size='small' sx={{ mt: 2 }}>
											Remove
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Box
				sx={{
					display: 'flex',
					mt: 1,
					maxWidth: 'inherit',
					flexGrow: 1,
					p: 1,
					border: 1,
					borderColor: 'grey.400',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexFlow: 'column',
						border: 1,
						borderColor: 'grey.400',
						mr: 1,
						p: 1,
					}}
				>
					<Typography>Modality</Typography>
					<Select
						labelId='bids-modality'
						id='bids-modality-select'
						value={currentBidsFile?.modality}
						label='Modality'
						onChange={event => {
							setCurrentBidsFile(f =>
								f
									? { ...f, modality: event?.target.value }
									: { modality: event.target.value }
							)
						}}
					>
						{modalities.map(m => (
							<MenuItem key={m.name} value={m.name}>{m.name}</MenuItem>
						))}
					</Select>
					<Typography sx={{ mt: 2 }}>Entities</Typography>
					<DynamicForm
						fields={entities}
						handleChangeFields={event => {
							setCurrentBidsFile(f =>
								f
									? { ...f, entity: event?.target.value }
									: { entity: event.target.value }
							)
						}}
					/>

					<Box sx={{ m: 2 }}>
						<CreateField
							handleCreateField={({ key, value }) => {
								// if (key && value)
								// setSubject(s => ({
								//     ...s,
								//     participant: {
								//         ...s?.participant,
								//         [key]: isNaN(value) ? value : Number(value)
								//     }
								// }))
							}}
						/>
					</Box>
				</Box>
				<Box>
					<FileBrowser
						nodesPanes={filesPanes}
						handleSelectedPath={handleSelectedPath}
					></FileBrowser>
					<Button
						onClick={handleAddFile}
						variant='contained'
						sx={{ mt: 2, float: 'right' }}
					>
						Add file
					</Button>
				</Box>
			</Box>
		</>
	)
}

export default BIDSFiles
