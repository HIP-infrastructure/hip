import {
	Alert,
	Box,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Link,
	Modal,
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

	return (
		<>
			<TitleBar
				title={'App Catalog'}
				description={
					'A list of all the applications made available to the HIP users. The applications can be started from an existing desktop'
				}
			/>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{availableApps?.error && availableApps?.error && (
					<Alert severity='error'>{availableApps?.error.message}</Alert>
				)}
				{availableApps?.data?.map((app, i) => (
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
