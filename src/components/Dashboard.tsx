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
import {

	useParams
  } from "react-router-dom";
const spaces = [
	{
		label: 'Private Space',
		buttonLabel: 'My private space',
		state: 'beta',
		description:
			'Password-protected space for each iEEG data provider to upload and curate own data.',
		image: PrivateImage,
		credit:
			'Photo by Hal Gatewood on Unsplash, https://unsplash.com/@halacious',
		counts: [2, 2, 34],
		disabled: false,
	},
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
		bIDSDatabases: [bidsDatabases],
	} = useAppStore()
	const navigate = useNavigate()
	const { id } = useParams();
	const sessions = containers?.filter(c => c.type === ContainerType.SESSION)

	return (
		<Box sx={{ width: 0.75 }}>
			<Box sx={{ mb: 6 }}>
				<Typography variant='h5'>
					{id} Private Space
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					width: '75vw',
					height: '560px',
					justifyContent: 'start',
					flexWrap: 'wrap',
					gap: '64px 64px',
					alignItems: 'start',
				}}
			>
				{spaces?.map((space, i) => (
					<Card
						sx={{
							width: 320,
							display: 'flex',
							flexDirection: 'column',
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
									<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
							{!space.disabled && (
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
												{!bidsDatabases && <CircularProgress size={12} />}
												{bidsDatabases?.data?.reduce(
													(a, b) => a + (b?.participants?.length || 0),
													0
												)}{' '}
												<em>subjects</em> in{' '}
												{!bidsDatabases && <CircularProgress size={12} />}
												{bidsDatabases?.data?.length}
												<em> BIDS databases</em>
											</Typography>
										</Box>
									</Box>
								</>
							)}
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
