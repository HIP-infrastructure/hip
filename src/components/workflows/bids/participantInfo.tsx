import {
	Card,
	CardContent,
	CircularProgress,
	Link,
	Typography
} from '@mui/material'
import { BIDSSubjectFile } from '../../../api/types'
type IExistingFile =
	| {
			modality: string
			files: string[]
	  }[]
	| undefined

const ParticipantInfo = ({
	subject,
	files,
	path,
	isNew,
}: {
	subject?: string
	files?: BIDSSubjectFile[]
	path?: string
	isNew: boolean
}) => {
	const existingFiles: IExistingFile = files?.reduce((p, c) => {
		const mods = p?.map(f => f.modality)
		if (mods?.includes(c.modality)) {
			return [
				...(p?.map(f =>
					f.modality === c.modality
						? { ...f, files: [...f.files, c.fileLoc] }
						: f
				) || []),
			]
		} else {
			return [...(p || []), { modality: c.modality, files: [c.fileLoc] }]
		}
	}, [] as IExistingFile)

	return (
		<Card sx={{ minWidth: 480 }}>
			{subject && (
				<CardContent>
					{isNew && (
						<Typography gutterBottom variant='subtitle2' color='text.secondary'>
							New subject
						</Typography>
					)}
					{!isNew && !existingFiles && (
						<CircularProgress sx={{ m: 2 }} size={16} />
					)}
					{!isNew && existingFiles && (
						<>
							<Typography
								gutterBottom
								variant='subtitle2'
								color='text.secondary'
							>
								Existing files for BIDS subject {}
								<Link
									target='_blank'
									href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${path}`}
								>
									{subject}
								</Link>
							</Typography>
							<Typography variant='body1'>
								<ul>
									{existingFiles?.map(f => (
										<li>
											<strong>
												{f.files.length} x {f.modality}
											</strong>
											<ul>
												{f.files.map(file => (
													<li>{file}</li>
												))}
											</ul>
										</li>
									))}
								</ul>
							</Typography>
						</>
					)}
				</CardContent>
			)}
		</Card>
	)
}

export default ParticipantInfo
