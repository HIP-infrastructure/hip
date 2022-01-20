import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip } from '@mui/material';
import { useAppStore } from '../store/appProvider'
import TitleBar from './titleBar';

import brainstormLogo from '../assets/brainstorm__logo.png'
import anywaveLogo from '../assets/anywave__logo.png'
import localizerLogo from '../assets/localizer__logo.png'
import fslLogo from '../assets/fsl__logo.png'
import hibopLogo from '../assets/hibop__logo.png'
import slicerLogo from '../assets/slicer__logo.png'
import mricroglLogo from '../assets/mrcicogl__logo.png'
import freesurferLogo from '../assets/freesurfer__logo.png'
import dcm2niixLogo from '../assets/dcm2niix__logo.png'
import bidsManagerLogo from '../assets/bidsmanager__logo.png'

const importedImages = [
	anywaveLogo,
	bidsManagerLogo,
	brainstormLogo,
	dcm2niixLogo,
	freesurferLogo,
	fslLogo,
	hibopLogo,
	localizerLogo,
	mricroglLogo,
	slicerLogo,
]

const Apps = () => {
	const { availableApps } = useAppStore()

	return <>
		<TitleBar title={'Available Applications'} description={'A list of all the applications made available to the HIP users. The applications can be started from an existing session, or right here in a new session.'} />
		<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
			{availableApps?.map((app, i) =>
				<Card sx={{ maxWidth: 320 }} key={app.name}>
					<CardMedia
						component="img"
						height="140"
						src={importedImages[i]}
						alt={app.label}
					/>
					<CardContent>
						<Box sx={{ display: 'flex' }}>
							<Typography gutterBottom variant="h5" sx={{ flex: 1 }}>
								{app.label} {app.version}
							</Typography>
							<Chip label={app.state} color={app.state !== 'faulty' ? "success" : "error"} variant="outlined" />
						</Box>

						<Typography gutterBottom variant="body2" color="text.secondary">
							{app.description}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{app.url}
						</Typography>

					</CardContent>
					<CardActions>

						<Button size="small" onClick={() => { window.open(app.url, '_blank') }}>Open Website </Button>
						<Button disabled size="small">Launch App</Button>
					</CardActions>
				</Card>
			)}
		</Box></>
}

export default Apps