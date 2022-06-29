import {
	Card,
	CardContent,
	CircularProgress,
	Link,
	Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getSubject } from '../../../api/bids'
import { BIDSSubjectFile } from '../../../api/types'
import { useAppStore } from '../../../store/appProvider'

type IExistingFile =
	| {
			modality: string
			files: string[]
	  }[]
	| undefined

const ParticipantInfo = ({ subject }: { subject?: string }) => {
	const {
		user: [user],
		selectedBidsDatabase: [selectedBidsDatabase],
	} = useAppStore()

	const [
		selectedSubjectExistingBIDSFiles,
		setSelectedSubjectExistingBIDSFiles,
	] = useState<BIDSSubjectFile[]>()
	const [subjectExists, setSubjectExists] = useState(false)

	useEffect(() => {
		setSelectedSubjectExistingBIDSFiles(undefined)

		if (!(selectedBidsDatabase?.path && user?.uid && subject)) {
			return
		}

		setSubjectExists(true)
		getSubject(
			selectedBidsDatabase?.path,
			user?.uid,
			subject.replace('sub-', '')
		)
			.then(d => {
				if (d) setSelectedSubjectExistingBIDSFiles(d)
			})
			.catch(e => {
				setSelectedSubjectExistingBIDSFiles(undefined)
				setSubjectExists(false)
			})
	}, [subject, selectedBidsDatabase, user])

	const existingFiles: IExistingFile = selectedSubjectExistingBIDSFiles?.reduce(
		(p, c) => {
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
		},
		[] as IExistingFile
	)

	return (
		<Card sx={{ minWidth: 480 }}>
			<CardContent>
				{subjectExists && (
					<>
						{!existingFiles && <CircularProgress sx={{ m: 2 }} size={16} />}

						{existingFiles && (
							<>
								<Typography
									gutterBottom
									variant='subtitle2'
									color='text.secondary'
								>
									Existing files for BIDS subject {}
									<Link
										target='_blank'
										href={`${window.location.protocol}//${window.location.host}/apps/files/?dir=${selectedBidsDatabase?.path}/${subject}`}
									>
										{subject}
									</Link>
								</Typography>
								<Typography variant='body1' component={'ul'}>
									{existingFiles?.map(f => (
										<li key={f.modality}>
											<strong>
												{f.files.length} x {f.modality}
											</strong>
											<ul>
												{f.files.map(file => (
													<li key={file}>{file}</li>
												))}
											</ul>
										</li>
									))}
								</Typography>
							</>
						)}
					</>
				)}
			</CardContent>
		</Card>
	)
}

export default ParticipantInfo
