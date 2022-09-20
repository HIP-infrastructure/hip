import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	Typography,
} from '@mui/material'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ContainerType } from '../api/types'
import CollaborativeImage from '../assets/dashboard__collaborative.png'
import PrivateImage from '../assets/dashboard__private.png'
import PublicImage from '../assets/dashboard__public.png'
import { ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import DocCard from './UI/DocCard'
import chuvLogo from '../assets/group__chuv__logo.png'

const spaces = [
	{
		label: 'About',
		state: 'beta',
		route: `${ROUTE_PREFIX}/private/sessions`,
		description: 'What is the HIP and why you would use it',
		link: 'https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/',
		image: PrivateImage,
		credit:
			'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
	},
	{
		label: 'Quick Start',
		state: 'beta',
		route: `${ROUTE_PREFIX}/private/sessions`,
		description:
			'See the <a href="https://hip-infrastructure.github.io/build/html/hip_beta_onboarding.html"> quick start guide</a> for a quick overview of the platform.',
		image: PrivateImage,
		credit:
			'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
	},
	// {
	// 	label: 'Known Issues',
	// 	state: 'beta',
	// 	route: `${ROUTE_PREFIX}/private/sessions`,
	// 	description: 'What is in the beta release',
	// 	image: PrivateImage,
	// 	credit:
	// 		'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
	// },
	{
		label: 'Beta Release Notes',
		state: 'beta',
		route: `${ROUTE_PREFIX}/private/sessions`,
		description: 'Features, Know issues, roadmap',
		image: PrivateImage,
		credit:
			'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
	},

	{
		label: 'Collaborate ',
		state: 'beta',
		route: `${ROUTE_PREFIX}/private/sessions`,
		description:
			'How to interact with your team, users of other centers, create shared documents,or even initiate projects.',
		image: PrivateImage,
		credit:
			'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
	},

	{
		label: "Users' Feedback ",
		state: 'beta',
		route: `${ROUTE_PREFIX}/private/sessions`,
		description: 'We need your insights!!!',
		image: PrivateImage,
		credit:
			'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
	},
	// {
	// 	label: 'Private Space',
	// 	buttonLabel: 'My private space',
	// 	state: 'beta',
	// 	route: `${ROUTE_PREFIX}/private/sessions`,
	// 	description:
	// 		'Password-protected space for each iEEG data provider to upload and curate own data.',
	// 	image: PrivateImage,
	// 	credit:
	// 		'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
	// 	counts: [2, 2, 34],
	// 	disabled: false,
	// },
	// {
	// 	label: 'Collaborative',
	// 	buttonLabel: 'Collaborative space',
	// 	state: 'not implemented',
	// 	route: `${ROUTE_PREFIX}/collaborative/sessions`,
	// 	description:
	// 		'Collaborative space where scientists accredited by the consortium of data providers perform iEEG data analyses on shared data.',
	// 	image: CollaborativeImage,
	// 	credit:
	// 		'Photo by Milad Fakurian on Unsplash, https://unsplash.com/@fakurian',
	// 	counts: [2, 4, 54],
	// 	disabled: true,
	// },
	// {
	// 	label: 'Public',
	// 	buttonLabel: 'Public space',
	// 	state: 'not implemented',
	// 	route: `${ROUTE_PREFIX}/public/sessions`,
	// 	description:
	// 		'Public space where public iEEG data are made available by individual iEEG data providers to be used by any scientist.',
	// 	image: PublicImage,
	// 	credit:
	// 		'Photo by  Jesse Martini on Unsplash, https://unsplash.com/@jessemartini',
	// 	counts: [1, 4, 17],
	// 	disabled: true,
	// },
]

const Dahsboard = () => {
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		user: [user],
	} = useAppStore()
	const navigate = useNavigate()
	const sessions = containers?.filter(c => c.type === ContainerType.SESSION)

	return (
		<Box sx={{ width: 0.75 }}>
			<Box sx={{ mb: 4 }}>
				<Typography variant='h2' sx={{ color: 'secondary.main' }}>
					The Human Intracerebral EEG Platform
				</Typography>
				<Typography gutterBottom variant='h5' sx={{ color: 'secondary.main' }}>
					The HIP - a platform for state-of-the-art processing and international
					sharing of HUMAN intracerebral EEG data
				</Typography>
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					Welcome {user?.displayName}
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					width: '75vw',
					height: '560px',
					justifyContent: 'start',
					flexWrap: 'wrap',
					gap: '32px 16px',
					alignItems: 'start',
				}}
			>
				{spaces?.map((space, i) => (
					<Card
						sx={{
							width: 320,
							display: 'flex',
							flexDirection: 'column',
							height: 320,
						}}
						key={space.label}
					>
						<Box sx={{ position: 'relative' }}>
							<CardMedia
								component='img'
								height='160'
								src={space.image}
								alt={space.label}
								title={space.credit}
							/>
						</Box>
						<CardContent sx={{ flexGrow: 1 }}>
							<Box sx={{ display: 'flex' }}>
								<Box sx={{ flex: 1 }}>
									<Box
										sx={{ display: 'flex', justifyContent: 'space-between' }}
									>
										<Typography variant='h5'>{space?.label}</Typography>

										<Chip
											label={space.state}
											color={space.state === 'beta' ? 'success' : 'warning'}
											variant='outlined'
										/>
									</Box>
									<Typography
										gutterBottom
										variant='caption'
										color='text.secondary'
									></Typography>
								</Box>
							</Box>

							<Typography
								sx={{ mt: 2 }}
								gutterBottom
								variant='body2'
								color='text.secondary'
							>
								{space.description}
							</Typography>
							{/* {!space.disabled && (
								<>
									<Typography
										sx={{ mt: 2 }}
										variant='body2'
										color='text.secondary'
									>
										{sessions?.length}{' '}
										<em>
											<a href=''>Opened desktop</a>
										</em>
									</Typography>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Box sx={{ mr: 0.5 }}>
											<Typography variant='body2' color='text.secondary'>
												{!bidsDatasets && <CircularProgress size={12} />}
												{bidsDatasets?.data?.reduce(
													(a, b) => a + (b?.participants?.length || 0),
													0
												)}{' '}
												<em>subjects</em> in{' '}
												{!bidsDatasets && <CircularProgress size={12} />}
												{bidsDatasets?.data?.length}
												<em> BIDS databases</em>
											</Typography>
										</Box>
									</Box>
								</>
							)} */}
						</CardContent>

						{/* <CardActions sx={{ p: 2, alignSelf: 'end' }}>
							<Button
								onClick={() => {
									navigate(space.route)
								}}
								disabled={space.disabled}
								variant='outlined'
							>
								{space.buttonLabel}
							</Button>
						</CardActions> */}
					</Card>
				))}
			</Box>
		</Box>
	)
}

export default Dahsboard
