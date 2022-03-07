import React, {
	useState,
	useRef,
	useEffect,
	useCallback,
	RefObject,
} from 'react'
import { styled, ThemeProvider } from '@mui/system'
import {
	Button,
	Grid,
	Typography,
	Paper,
	useTheme,
	Box,
	Hidden,
	Alert,
	Avatar,
} from '@mui/material'
import FileAttachment from './fileAttachement'
import CloudUpload from '@mui/icons-material/CloudUpload'

interface Props {
	onFileChange: (files: File[]) => void
	onError: (error: string) => void
}

const StyledContainer = styled(Typography)(({ theme }) => ({
	'&::-webkit-scrollbar': {
		width: 7,
		height: 6,
	},
	'&::-webkit-scrollbar-track': {
		WebkitBoxShadow: 'inset 0 0 6px rgb(125, 161, 196, 0.5)',
	},
	'&::-webkit-scrollbar-thumb': {
		WebkitBorderRadius: 4,
		borderRadius: 4,
		background: 'rgba(0, 172, 193, .5)',
		WebkitBoxShadow: 'inset 0 0 6px rgba(25, 118, 210, .5)',
	},
	'&::-webkit-scrollbar-thumb:window-inactive': {
		background: 'rgba(125, 161, 196, 0.5)',
	},
}))

/**
 * @name FileUpload
 * @description
 * @param props
 * @returns
 */
function FileUpload({ onFileChange, onError }: Props) {
	const theme = useTheme()
	const [error, setError] = useState<string | null>(null)
	const [animate, setAnimate] = useState(false)
	const [files, setFiles] = useState([])
	const [disabled, setDisabled] = useState(false)

	const oneMega = 1024 * 1024
	const filesCardRef = useRef<RefObject<HTMLDivElement>>(null)

	// useEffect(() => {
	//     if (defaultFiles?.length > 0) {
	//         setFiles(defaultFiles)
	//     }
	//     // eslint-disable-next-line
	// }, [defaultFiles])

	useEffect(() => {
		if (files) onFileChange([...files])
	}, [files])

	/**
	 * @name renderPreview
	 * @description
	 * @param event
	 * @param filesTab
	 * @returns void
	 */
	const renderPreview = (
		event: React.ChangeEventHandler<HTMLInputElement>,
		filesTab: any
	) => {
		setAnimate(false)
		setError(null)
		if (!filesTab && event?.target?.files) {
			filesTab = event?.target?.files
		}
		if (!filesTab) {
			return onError(`Empty file input`)
		}

		//
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			for (let i = 0; i < filesTab?.length; i++) {
				let file = filesTab[i]
				let extension = file?.type?.split('/')[1]

				//
				let reader = new FileReader()
				reader.addEventListener(
					'load',
					function () {
						let obj = {
							lastModified: file.lastModified,
							name: file.name,
							size: file.size,
							path: this.result,
							extension: extension?.toLowerCase(),
							contentType: file.type,
						}
						files.push(obj)
						setFiles([...files])
					},
					false
				)
				reader.readAsDataURL(file)
			}
			event?.dataTransfer?.clearData()
		}
	}

	/**
	 * @name handleRemoveFile
	 * @description
	 * @param index
	 * @returns void
	 */
	const handleRemoveFile = (index: number) => {
		setError(null)
		document.getElementById('input-files').value = ''

		if (typeof index !== 'number') {
			setFiles([])
			return onFileChange([])
		}

		if (index < 0 || index > files.length - 1) return

		files?.splice(index, 1)
		setFiles([...files])
	}

	/**
	 * @name handleDragEnter
	 * @description
	 * @returns void
	 */
	const handleDragEnter = useCallback(event => {
		event.preventDefault()
		setAnimate(true)
	}, [])

	/**
	 * @name handleDragOver
	 * @description
	 * @returns void
	 */
	const handleDragOver = useCallback(event => {
		event.stopPropagation()
		event.preventDefault()
		setAnimate(true)
	}, [])

	/**
	 * @name handleDrop
	 * @description
	 * @returns void
	 */
	const handleDrop = useCallback(event => {
		event.stopPropagation()
		event.preventDefault()
		let dt = event.dataTransfer
		if (dt.files) renderPreview(event, dt.files)
	}, [])

	/**
	 * @name handleDragLeave
	 * @description
	 * @returns void
	 */
	const handleDragLeave = useCallback(event => {
		setAnimate(false)
	}, [])

	useEffect(() => {
		let dragDiv = filesCardRef.current
		if (dragDiv && !disabled) {
			dragDiv.ondragenter = handleDragEnter
			dragDiv.ondragover = handleDragOver
			dragDiv.ondrop = handleDrop
			dragDiv.ondragleave = handleDragLeave
		}
	}, [filesCardRef.current])

	let background = animate
		? theme.palette.secondary.light
		: theme.palette.primary.light

	return (
		<ThemeProvider theme={theme}>
			<Paper sx={{ p: 1 }} elevation={0} ref={filesCardRef}>
				<Typography
					gutterBottom
					component='div'
					color='textSecondary'
					sx={{ display: 'flex' }}
				>
					<Box sx={{ flexGrow: 1, fontSize: 12 }}>Upload file</Box>
				</Typography>
				<Paper
					elevation={0}
					sx={{ p: 1, transition: 500, background: background }}
				>
					<Grid
						container
						spacing={2}
						alignItems='center'
						justifyContent='center'
					>
						<Grid item xs={12} sm={3} md={4} sx={{ textAlign: 'center' }}>
							<Avatar sx={{ h: 120, w: 120 }}>
								<CloudUpload />
							</Avatar>
						</Grid>
						<Grid
							item
							xs={12}
							sm={9}
							md={8}
							sx={{ color: '#fff', textAlign: 'center' }}
						>
							<Typography variant='h6'>
								<b>{'Upload file'}</b>
							</Typography>
							<Typography variant='caption'>
								{'or'}
								<Button
									size='small'
									color='secondary'
									variant='outlined'
									disabled={disabled}
									sx={{
										m: 0.5,
										color: theme.palette.grey['50'],
										borderColor: theme.palette.grey['50'],
										'&:hover': { borderColor: theme.palette.grey['50'] },
									}}
									onClick={() =>
										document.getElementById('input-files')?.click()
									}
								>
									Choose
								</Button>
							</Typography>
							<input
								type='file'
								accept={`*/*`}
								id='input-files'
								multiple={false}
								onChange={renderPreview}
								style={{ display: 'none' }}
							/>
						</Grid>
					</Grid>
				</Paper>
				{error && (
					<Alert color='error' severity='error' sx={{ mt: 1 }}>
						{error}
					</Alert>
				)}
				{files?.length > 0 && (
					<>
						<StyledContainer
							component='div'
							sx={{
								overflowY: 'auto',
								mt: 2,
								mr: -1,
								pr: 1,
								height: 240,
								maxHeight: 360,
							}}
						>
							{files?.map((file: File, index: number) => {
								const size = file.size
								const humanSize =
									size > oneMega
										? `${(file.size / oneMega).toFixed(2)} Mb`
										: `${(file.size / 1024).toFixed(2)} Kb`

								return (
									<FileAttachment
										file={file}
										size={humanSize}
										index={index}
										disabled={disabled}
										key={`upload-file--${index}`}
										hanfleRemoveFile={handleRemoveFile}
									/>
								)
							})}
						</StyledContainer>
						<Typography component='div' align='right' sx={{ mt: 1 }}>
							<Button
								size='small'
								disabled={disabled}
								onClick={handleRemoveFile}
							>
								Remove all
							</Button>
						</Typography>
					</>
				)}
			</Paper>
		</ThemeProvider>
	)
}

export default FileUpload
