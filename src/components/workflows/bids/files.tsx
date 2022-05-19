import { Article, Delete, Folder, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Autocomplete,
	Box, Grid,
	IconButton,
	MenuItem,
	Paper, Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { getFiles } from '../../../api/gatewayClientAPI'
import {
	BidsDatabaseDefinitionDto, File, TreeNode
} from '../../../api/types'
import { ENTITIES, MODALITIES } from '../../../constants'
import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'

const validationSchema = Yup.object().shape({
	subject: Yup.string().required('Subject is required'),
	modality: Yup.string().required('Modality is required'),
})

const initialValues = {
	subject: '',
	modality: '',
}

const Files = (): JSX.Element => {
	const [ignored, forceUpdate] = React.useReducer((x: number) => x + 1, 0)
	const [tree, setTree] = useState<TreeNode[]>()
	const [options, setOptions] = React.useState<string[]>()
	const [inputValue, setInputValue] = React.useState<string>('')
	const [submitted, setSubmitted] = useState(false)
	const { showNotif } = useNotification()
	const [definitions, setDefinitions] = useState<BidsDatabaseDefinitionDto>()
	const [currentBidsFile, setCurrentBidsFile] = useState<File>()

	const {
		containers: [containers],
		user: [user, setUser],
		bidsDatabases: [bidsDatabases, setBidsDatabases],
		selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
		participants: [participants, setParticipants],
		selectedParticipants: [selectedParticipants, setSelectedParticipants],
		selectedFiles: [selectedFiles, setSelectedFiles],
	} = useAppStore()

	useEffect(() => {
		getFiles('/').then(f => {
			setTree(f)
		})
	}, [])

	useEffect(() => {
		// console.log(tree?.map((t: { data: { path: any } }) => t.data.path))
		const selectedNode = tree?.find(
			(node: { data: { path: any } }) => node.data.path === inputValue
		)
		const selectedPath = selectedNode?.data.path.split('/') || ['']
		const parentNode = tree?.find((node: TreeNode) => {
			const parentPath = selectedNode?.data.path.split('/')
			parentPath?.pop()

			return node.data.path === parentPath?.join('/')
		})

		const nextOptions = [
			...(parentNode
				? [parentNode]
				: [
					{
						key: 'root',
						label: '../',
						icon: 'dir',
						data: {
							path: '/',
							type: 'dir',
							size: 0,
							updated: 'string',
							name: '../',
							tags: [],
							id: 0,
						},
					},
				]),
			...(tree
				?.filter((node: { data: { path: string } }) =>
					new RegExp(inputValue).test(node.data.path)
				)
				?.filter(node => {
					const pathes = node?.data.path.split('/')
					if (pathes.length <= selectedPath.length + 1) return true

					return false
				})
				?.sort(
					(a: { data: { path: any } }, b: { data: { path: string } }) =>
						-b.data.path.localeCompare(a.data.path)
				) || []),
		]?.map(node => node.data.path)

		// console.log(nextOptions)

		setOptions(nextOptions)
	}, [tree])

	const handleSelectedPath = async (newInputValue: string) => {
		const selectedNode = tree?.find(node => node.data.path === newInputValue)

		if (newInputValue === '/' || selectedNode?.data.type === 'dir') {
			if (selectedNode && !selectedNode?.children) {
				const nextNodes = await getFiles(newInputValue)
				setTree((nodes: TreeNode[]) => [
					...nextNodes,
					...((nodes &&
						nodes.map((node: { data: { path: any } }) =>
							node.data.path === selectedNode.data.path
								? { ...node, children: true }
								: node
						)) ||
						[]),
				])
			} else {
				setTree((nodes: TreeNode[]) => [
					...((nodes && nodes.map((t: TreeNode) => t)) || []),
				])
			}
		} else {
			if (selectedNode?.data.type === 'file') {
				setCurrentBidsFile((f: any) => ({
					...f,
					path: selectedNode?.data.path,
				}))
			}
		}
	}

	const handleDeleteFile = (file: File) => {
		const nextFiles = selectedFiles.filter(f => f.path !== file.path)
		setSelectedFiles(nextFiles)
	}

	const handleEditFile = (file: File) => {
		const nextFiles = selectedFiles.filter(f => f.path !== file.path)
	}

	return (
		<Box sx={{ display: 'flex' }}>
			<Box sx={{ flex: '1 1'}}>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={async (values, { resetForm }) => {
						setSubmitted(true)

						const participant = participants?.find(
							p => p.participant_id === values.subject
						)
						if (
							participant &&
							!selectedParticipants
								?.map(s => s.participant_id)
								.includes(participant.participant_id)
						) {
							setSelectedParticipants(s => [...(s || []), participant])
						}

						const file: File = {
							modality: values.modality,
							subject: values.subject.replace('sub-', ''),
							path: currentBidsFile?.path?.substring(1),
							entities: {
								sub: values.subject.replace('sub-', ''),
								...ENTITIES?.reduce(
									(a, k) => ({
										...a,
										...((values as any)[k] ? { [k]: (values as any)[k] } : {}),
									}),
									{}
								),
							},
						}

						setSelectedFiles(f => [...(f || []), file])

						// resetForm()
						// showNotif('File added.', 'success')

						setSubmitted(false)
					}}
				>
					{({ errors, handleChange, touched, values }) => (
						<Form>
							<Grid container columnSpacing={2} rowSpacing={2}>
								{participants && (
									<Grid item xs={6}>
										<TextField
											fullWidth
											select
											size='small'
											disabled={submitted}
											name='subject'
											label='Subject'
											value={values.subject}
											onChange={handleChange}
											error={touched.subject && errors.subject ? true : false}
											helperText={
												touched.subject && errors.subject
													? errors.subject
													: null
											}
										>
											{participants?.map(p => (
												<MenuItem
													key={p.participant_id}
													value={p.participant_id}
												>
													{p.participant_id}
												</MenuItem>
											))}
										</TextField>
									</Grid>
								)}

								<Grid item xs={6}>
									<TextField
										fullWidth
										select
										size='small'
										disabled={submitted}
										name='modality'
										label='Modality'
										value={values.modality}
										onChange={handleChange}
										error={touched.modality && errors.modality ? true : false}
										helperText={
											touched.modality && errors.modality
												? errors.modality
												: null
										}
									>
										{MODALITIES?.map(m => (
											<MenuItem value={m}>{m}</MenuItem>
										))}
									</TextField>
								</Grid>

								{ENTITIES.map(k => (
									<Grid item xs={2} key={k}>
										<TextField
											size='small'
											disabled={submitted}
											name={k}
											label={k}
											value={(values as Record<string, string>)[k]}
											onChange={handleChange}
											error={
												(touched as Record<string, string>)[k] &&
													(errors as Record<string, string>)[k]
													? true
													: false
											}
											helperText={
												(touched as Record<string, string>)[k] &&
													(errors as Record<string, string>)[k]
													? (errors as Record<string, string>)[k]
													: null
											}
										/>
									</Grid>
								))}
								<Grid item xs={10}>
									<Autocomplete
										options={options || []}
										inputValue={inputValue}
										onInputChange={(event: any, newInputValue: string) => {
											handleSelectedPath(newInputValue)
											setInputValue(newInputValue)
										}}
										disableCloseOnSelect={true} // tree?.find(node => node.data.path === inputValue)?.data.type !== 'file'}
										id='input-tree-view'
										renderInput={(params: unknown) => (
											<TextField {...params} label='Files' />
										)}
										renderOption={(props, option) => {
											const node = tree?.find(node => node.data.path === option)

											return node?.data.type === 'dir' ? (
												<Box
													component='li'
													sx={{ '& > svg': { mr: 1, flexShrink: 0 } }}
													{...props}
												>
													<Folder color='action' />
													{option}
												</Box>
											) : (
												<Box
													component='li'
													sx={{ '& > svg': { mr: 1, flexShrink: 0 } }}
													{...props}
												>
													<Article color='action' />
													{option}
												</Box>
											)
										}}
									/>
								</Grid>
								<Grid item xs={2}>
									<LoadingButton
										color='primary'
										type='submit'
										loading={submitted}
										loadingPosition='start'
										startIcon={<Save />}
										variant='contained'
									>
										Add
									</LoadingButton>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Box>
			<Box sx={{ flex: '1 1'}}>
				<TableContainer component={Paper}>
					<Table size='small' aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>Actions</TableCell>
								<TableCell>Subject</TableCell>
								<TableCell>Modality</TableCell>
								<TableCell>Path</TableCell>
								{ENTITIES?.map((k: string) => (
									<TableCell key={k}>{k}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedFiles?.reverse().map(file => (
								<TableRow
									key={file.path}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell align='right'>
										{/* <IconButton color='primary' aria-label='edit'>
											<Edit onClick={() => handleEditFile(file)}/>
										</IconButton> */}
										<IconButton color='primary' aria-label='delete'>
											<Delete onClick={() => handleDeleteFile(file)} />
										</IconButton>
									</TableCell>
									<TableCell>{file.subject}</TableCell>
									<TableCell>{file.modality}</TableCell>
									<TableCell>{file.path}</TableCell>
									{file.entities &&
										ENTITIES.map(k => (
											<TableCell key={k}>
												{file.entities ? file.entities[k] : ''}
											</TableCell>
										))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	)
}

Files.displayName = 'Files'
export default Files
