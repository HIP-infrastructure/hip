import {
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
// import { useNavigate } from "react-router-dom";
// import {
// 	Application,
// 	createSessionAndApp
// } from '../api/gatewayClientAPI';
import anywaveLogo from '../assets/anywave__logo.png'
import bidsManagerLogo from '../assets/bidsmanager__logo.png'
import brainstormLogo from '../assets/brainstorm__logo.png'
import dcm2niixLogo from '../assets/dcm2niix__logo.png'
import freesurferLogo from '../assets/freesurfer__logo.png'
import fslLogo from '../assets/fsl__logo.png'
import hibopLogo from '../assets/hibop__logo.png'
import localizerLogo from '../assets/localizer__logo.png'
import mricroglLogo from '../assets/mrcicogl__logo.png'
import slicerLogo from '../assets/slicer__logo.png'
import tvbLogo from '../assets/tvb__logo.png'
// import { ROUTE_PREFIX } from '../constants';
import { useAppStore } from '../store/appProvider'
import TitleBar from './UI/titleBar'
import WebdavForm from './webdavLoginForm'

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
	tvbLogo,
]

const Apps = () => {
	const { availableApps } = useAppStore()
	// const [startApp, setStartApp] = useState<Application>()
	const [showWedavForm, setShowWedavForm] = useState(false)
	const {
		containers: [containers],
		// user: [user, setUser],
	} = useAppStore()
	// const navigate = useNavigate();

	// Start an app in the session after getting user's password
	// useEffect(() => {
	// 	if (!(startApp && user)) {
	// 		return;
	// 	}

	// 	setShowWedavForm(false)
	// 	createSessionAndApp(user, startApp.name)
	// 		.then(container => {
	// 			navigate(`${ROUTE_PREFIX}/sessions/${container.id}`)
	// 		})

	// 	// Remove password after use
	// 	const { password, ...nextUser } = user
	// 	setUser(nextUser)
	// 	setStartApp(undefined)
	// }, [user])

	// const handleCreateApp = (app: Application) => {
	// 	setStartApp(app)
	// 	setShowWedavForm(true)
	// }

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
				{availableApps.error && (
					<Typography gutterBottom variant='body2' color='error'>
						{availableApps.error.message}
					</Typography>
				)}
				{availableApps.apps?.map((app, i) => (
					<Card
						sx={{ maxWidth: 288, display: 'flex', flexDirection: 'column' }}
						key={app.name}
					>
						<CardMedia
							component='img'
							height='140'
							src={importedImages[i]}
							alt={app.label}
						/>
						<CardContent sx={{ flexGrow: 1, pb: 0, mb: 0 }}>
							<Box sx={{ display: 'flex' }}>
								<Typography variant='h5' sx={{ flex: 1 }}>
									{app.label}
								</Typography>

								<Chip
									label={app.state}
									color={app.state !== 'faulty' ? 'success' : 'error'}
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
						{/* <CardActions sx={{ alignSelf: 'end' }} >
						<Button size="small" onClick={() => { window.open(app.url, '_blank') }}>App Website</Button> */}
						{/* <Button size="small" onClick={() => handleCreateApp(app)}>Start</Button> */}
						{/* </CardActions> */}
					</Card>
				))}
			</Box>
		</>
	)
}

export default Apps
