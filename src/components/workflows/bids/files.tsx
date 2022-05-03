import { Delete, Edit, Folder, Save, Article } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
	Autocomplete,
	Box,
	Button,
	Grid,
	IconButton, MenuItem, Paper, SelectChangeEvent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { getBidsDatabase } from '../../../api/bids'
import { getFiles } from '../../../api/gatewayClientAPI'
import {
	BIDSDatabase,
	BidsDatabaseDefinitionDto,
	CreateSubjectDto,
	File,
	Participant,
	TreeNode
} from '../../../api/types'
import * as Yup from 'yup'

import { useNotification } from '../../../hooks/useNotification'
import { useAppStore } from '../../../store/appProvider'

const validationSchema = Yup.object().shape({
	subject: Yup.string().required('Subject is required'),
	modality: Yup.string().required('Modality is required'),
})

const initialValues = {
	subject: '',
	modality: ''
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
		selectedParticipant: [selectedParticipant, setSelectedParticipant],
		selectedFiles: [selectedFiles, setSelectedFiles]
	} = useAppStore()


	useEffect(() => {
		getFiles('/').then(f => {
			setTree(f)
		})
	}, [])

	useEffect(() => {
		if (user && selectedBidsDatabase) {
			const getBidsDatabaseDto = {
				owner: user.uid!,
				database: selectedBidsDatabase.path!,
				BIDS_definitions: ['Anat']
			}

			getBidsDatabase(getBidsDatabaseDto).then(response => {
				setDefinitions(response)
			})
		}
	}, [user, selectedBidsDatabase])

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
				?.filter((node) => {
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
		const selectedNode = tree?.find(
			(node: { data: { path: string } }) => node.data.path === newInputValue
		)

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
			handleSelectedNode(selectedNode)
		}
	}

	const handleSelectedNode = async (node?: TreeNode) => {
		if (node?.data.type === 'file') {
			setCurrentBidsFile((f: any) => ({ ...f, path: node?.data.path }))

			return
		}

		setCurrentBidsFile((f: any) => ({ ...f, path: undefined }))
		const pathes = node?.data.path.split('/').map(p => `${p}/`)
		const path = node?.data.path

		if (pathes && path) {
			const result = await getFiles(path)

			setFilesPanes((prev: any[]) => {
				if (!prev) return [result]

				prev[pathes.length - 1] = result
				prev.splice(pathes.length)

				return prev
			})
			forceUpdate()
		}
	}

	const anatKeyList = definitions?.BIDS_definitions.Anat.keylist
		.filter(k => !['sub', 'modality', 'fileLoc', 'AnatJSON'].includes(k))

	return (
		<Box sx={{ maxWidth: '100%', width: '100%' }}>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={async (values, { resetForm }) => {
					setSubmitted(true)

					// const data: CreateSubjectDto = {
					// 	owner: user?.uid,
					// 	database: selectedBidsDatabase.path,
					// 	subjects: [],
					// 	files: [
					// 		modality: values.modality,
					// 		subject: '',
					// 		path: 'values.files',
					// 		entities: anatKeyList.reduce((a, k) => {}, [])
					// 	]
					// }

					const file: File = {
						modality: values.modality,
						subject: values.subject,
						path: '',
						entities: anatKeyList?.reduce((a, k) => ({ ...a, [k]: values[k] }), {})
					}

					setSelectedFiles(f => [...f, file])

					console.log(values)

					resetForm()
					showNotif('Participant created.', 'success')

					setSubmitted(false)
				}}
			>
				{({ errors, handleChange, touched, values }) => (
					<Form>
						<Grid container columnSpacing={2} rowSpacing={2}>
							{participants &&
								<Grid item xs={6}>
									<TextField
										fullWidth
										select
										size="small"
										disabled={submitted}
										name="subject"
										label="Subject"
										value={values.subject}
										onChange={handleChange}
										error={touched.subject && errors.subject ? true : false}
										helperText={touched.subject && errors.subject ? errors.subject : null}
									>
										{participants?.map(p =>
											<MenuItem key={p.participant_id} value={p.participant_id}>
												{p.participant_id} ({p.sex}/{p.age})
											</MenuItem>)}
									</TextField>
								</Grid>
							}

							{definitions &&
								<Grid item xs={6}>
									<TextField
										fullWidth
										select
										size="small"
										disabled={submitted}
										name="modality"
										label="Modality"
										value={values.modality}
										onChange={handleChange}
										error={touched.modality && errors.modality ? true : false}
										helperText={touched.modality && errors.modality ? errors.modality : null}
									>
										{definitions.BIDS_definitions.Anat.allowed_modalities?.map(m =>
											<MenuItem key={m} value={m}>
												{m}
											</MenuItem>)}
									</TextField>
								</Grid>
							}
							<Grid item xs={12}>
								<Autocomplete
									options={options || []}
									inputValue={inputValue}
									onInputChange={(event: any, newInputValue: string) => {
										handleSelectedPath(newInputValue)
										setInputValue(newInputValue)
									}}
									disableCloseOnSelect
									id='input-tree-view'
									sx={{ width: 640 }}
									renderInput={(params: unknown) => (
										<TextField {...params} label='Files' />
									)}
									renderOption={(props, option) => {
										const node = tree?.find(node => node.data.path === option)

										return node?.data.type === 'dir' ?
											<Box component="li" sx={{ '& > svg': { mr: 1, flexShrink: 0 } }} {...props}>
												<Folder />
												{option}
											</Box> :
											<Box component="li" sx={{ '& > svg': { mr: 1, flexShrink: 0 } }} {...props}>
												<Article />
												{option}
											</Box>
									}}

								/>
							</Grid>

							{anatKeyList &&
								anatKeyList
									.map(k =>
										<Grid item xs={2}>
											<TextField
												size="small"
												disabled={submitted}
												name={k}
												label={k}
												value={values[k]}
												onChange={handleChange}
												error={touched[k] && errors[k] ? true : false}
												helperText={touched[k] && errors[k] ? errors[k] : null}
											/>
										</Grid>)

							}



							<Grid xs={12}>
								<LoadingButton
									color="primary"
									type="submit"
									loading={submitted}
									loadingPosition="start"
									startIcon={<Save />}
									variant="contained"
								>
									Add
								</LoadingButton>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>



			< Box sx={{ mt: 4, mb: 4 }}>
				<TableContainer component={Paper}>
					<Table size='small' sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>Actions</TableCell>
								<TableCell>Subject</TableCell>
								<TableCell>Modality</TableCell>
								<TableCell>Path</TableCell>
								{anatKeyList?.map((k: string) => (
									<TableCell key={k}>
										{k}
									</TableCell>
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
										<IconButton color='primary' aria-label='edit'>
											<Edit />
										</IconButton>
										<IconButton color='primary' aria-label='delete'>
											<Delete />
										</IconButton>
									</TableCell>
									<TableCell>{file.subject}</TableCell>
									<TableCell>{file.modality}</TableCell>
									<TableCell>{file.path}</TableCell>
									{anatKeyList?.map((k: string) => (
										<TableCell key={k}>
											{k}
										</TableCell>
									))}

								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box >
		</Box >
	)
}

Files.displayName = 'Files'
export default Files
