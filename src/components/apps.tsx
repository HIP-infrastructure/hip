import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Link,
	Modal
} from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import anywave from '../assets/anywave__logo.png'
import brainstorm from '../assets/brainstorm__logo.png'
import dcm2niix from '../assets/dcm2niix__logo.png'
import freesurfer from '../assets/freesurfer__logo.png'
import fsl from '../assets/fsl__logo.png'
import hibop from '../assets/hibop__logo.png'
import localizer from '../assets/localizer__logo.png'
import mricrogl from '../assets/mrcicogl__logo.png'
import mrideface from '../assets/mrideface__logo.png'
import slicer from '../assets/slicer__logo.png'
import tvb from '../assets/tvb__logo.png'
import { useAppStore } from '../store/appProvider'
import TitleBar from './UI/titleBar'
import WebdavForm from './webdavLoginForm'
import mne from '../assets/mne__logo.png'
import bidsmanager from '../assets/bidsmanager__logo.png'

const s: { [key: string]: string } = {
	brainstorm,
	anywave,
	localizer,
	fsl,
	hibop,
	slicer,
	mricrogl,
	freesurfer,
	dcm2niix,
	bidsmanager,
	mrideface,
	tvb,
	mne,
}

const Apps = () => {
	const { availableApps } = useAppStore()
	const [showWedavForm, setShowWedavForm] = useState(false)

	const modalStyle = {
		position: 'absolute' as 'const',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 240,
		bgcolor: 'background.paper',
		border: '1px solid #333',
		boxShadow: 4,
		p: 4,
	}

	return (
		<>
			<TitleBar
				title={'App Catalog'}
				description={
					'A list of all the applications made available to the HIP users. The applications can be started from an existing session'
				}
			/>
			<Modal open={showWedavForm} onClose={() => setShowWedavForm(false)}>
				<Box sx={modalStyle}>
					<WebdavForm />
				</Box>
			</Modal>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{availableApps?.map((app, i) => (
					<Card
						sx={{ maxWidth: 288, display: 'flex', flexDirection: 'column' }}
						key={app.name}
					>
						<CardMedia
							component='img'
							height='140'
							src={s[app.name]}
							alt={app.label}
						/>
						<CardContent sx={{ flexGrow: 1, pb: 0, mb: 0 }}>
							<Box sx={{ display: 'flex' }}>
								<Typography variant='h5' sx={{ flex: 1 }}>
									{app.label}
								</Typography>

								<Chip
									label={app.state}
									color={
										app.state === 'ready'
											? 'success'
											: app.state === 'beta'
											? 'warning'
											: 'error'
									}
									variant='outlined'
								/>
							</Box>
							<Typography gutterBottom variant='caption'>
								version: {app.version}
							</Typography>
							<Typography
								sx={{ mb: 2, mt: 2 }}
								gutterBottom
								variant='body2'
								color='text.secondary'
							>
								{app.description}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{ wordWrap: 'break-word' }}
							>
								<Link href={app.url} target='_blank'>
									{app.url}
								</Link>
							</Typography>
						</CardContent>
					</Card>
				))}
			</Box>
		</>
	)
}

export default Apps
