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
	Stack,
} from '@mui/material'
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ContainerType, Group, User } from '../api/types'
import { ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import DocCard from './UI/DocCard'
import chuvLogo from '../assets/group__chuv__logo.png'
import { useParams } from 'react-router-dom'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import TitleBar from './UI/titleBar'
import { getUser, getUsersForGroup } from '../api/gatewayClientAPI'
import { useEffect, useState } from 'react'

const linkStyle = {
	textDecoration: 'underline',
	color: '#0277bd',
}

const Dashboard = () => {
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		groups: [groups],
		user: [user],
	} = useAppStore()

	const [userIds, setUserIds] = useState([])
	const [users, setUsers] = useState<User[]>([])
	const [center, setCenter] = useState<Group | undefined>()

	const { trackEvent } = useMatomo()
	const navigate = useNavigate()

	const { id } = useParams()

	useEffect(() => {
		const center = groups
			?.filter(group => group.id === id)
			?.find((_, i) => i === 0)

		if (center) setCenter(center)
	}, [id])

	useEffect(() => {
		if (!center) return

		getUsersForGroup(center.label).then(({ users }) => {
			setUserIds(users)
		})
	}, [center])

	useEffect(() => {
		if (!userIds) return

		userIds.map(user => {
			getUser(user).then(user => {
				if (!user) return

				setUsers(users => [...users, user])
			})
		})
	}, [userIds])

	const sessions = containers?.filter(c => c.type === ContainerType.SESSION)

	return (
		<>
			<TitleBar title={`${center?.label || ''} Private Space`} description={''} />
			<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
				Welcome {user?.displayName}
			</Typography>

			{groups && !center && (
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					You don't seem to belong to any group. Please contact
					your administrator.
				</Typography>
			)}

			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '16px 16px',
					mt: 2,
				}}
			>
				<Box sx={{ width: 0.75 }}>
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
						{/* GROUP */}
						{center && (
							<>
								<Card
									sx={{
										width: 320,
										display: 'flex',
										flexDirection: 'column',
									}}
									key={center.label}
								>
									<Box sx={{ position: 'relative' }}>
										{center.logo && (
											<CardMedia
												component='img'
												height='160'
												src={`${process.env.REACT_APP_GATEWAY_API}/public/${center.logo}`}
												alt={center.label}
												title={center.label}
											/>
										)}
									</Box>
									<CardContent sx={{ flexGrow: 1 }}>
										<Box sx={{ display: 'flex' }}>
											<Box sx={{ flex: 1 }}>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
													}}
												>
													<Typography variant='h5'>{center?.label}</Typography>

													{/* <Chip
													label={space.state}
													color={space.state === 'beta' ? 'success' : 'warning'}
													variant='outlined'
												/> */}
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
											{center.description}
										</Typography>
										<>
											<Stack>
												<Typography>{center.pi}</Typography>
												<Typography>
													{center.city}, {center.country}
												</Typography>
												{center.website && (
													<Typography>
														<Link
															to={center.website}
															target='_blank'
															style={linkStyle}
														>
															{center.website}
														</Link>
													</Typography>
												)}
												<Typography>
													{JSON.stringify(center.socialnetworks, null)}
												</Typography>
											</Stack>

											{/* <Typography
												sx={{ mt: 2 }}
												variant='body2'
												color='text.secondary'
											>
												{sessions?.length}{' '}
												<em>
													<a href=''>Opened desktop</a>
												</em>
											</Typography> */}
											{/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
													<em> BIDS datasets</em>
												</Typography>
											</Box>
										</Box> */}
										</>
									</CardContent>

									{center.website && (
										<CardActions sx={{ p: 2, alignSelf: 'end' }}>
											<Button
												onClick={() => {
													window.open(`${center.website}`, '_blank')
												}}
												variant='outlined'
											>
												{center.label} website
											</Button>
										</CardActions>
									)}
								</Card>

								{/* Members */}
								<Card
									sx={{
										width: 320,
										display: 'flex',
										flexDirection: 'column',
									}}
									key={center.label}
								>
									<Box sx={{ position: 'relative' }}>
										{/* {center.logo && (
										<CardMedia
											component='img'
											height='160'
											src={`${process.env.REACT_APP_GATEWAY_API}/public/${center.logo}`}
											alt={center.label}
											title={center.label}
										/>
									)} */}
									</Box>
									<CardContent sx={{ flexGrow: 1 }}>
										<Box sx={{ display: 'flex' }}>
											<Box sx={{ flex: 1 }}>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
													}}
												>
													<Typography variant='h5'>Members</Typography>
													{!users && (
														<CircularProgress size={18} color='secondary' />
													)}
													{/* <Chip
													label={space.state}
													color={space.state === 'beta' ? 'success' : 'warning'}
													variant='outlined'
												/> */}
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
										></Typography>
										<Stack spacing={2}>
											{users?.map(user => (
												<Stack>
													<Typography>{user.displayName}</Typography>
													<Typography>{user.email}</Typography>
													<Typography>
														<Link
															to={`/u/${user.id}`}
															target='_blank'
															style={linkStyle}
														>
															Chat with {user.displayName}
														</Link>
													</Typography>
												</Stack>
											))}
										</Stack>
									</CardContent>
								</Card>

								{/* RESOURCES */}
								<Card
									sx={{
										width: 320,
										display: 'flex',
										flexDirection: 'column',
									}}
									key={center.label}
								>
									<Box sx={{ position: 'relative' }}>
										{/* {center.logo && (
										<CardMedia
											component='img'
											height='160'
											src={`${process.env.REACT_APP_GATEWAY_API}/public/${center.logo}`}
											alt={center.label}
											title={center.label}
										/>
									)} */}
									</Box>
									<CardContent sx={{ flexGrow: 1 }}>
										<Box sx={{ display: 'flex' }}>
											<Box sx={{ flex: 1 }}>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
													}}
												>
													<Typography variant='h5'>Data</Typography>

													{/* <Chip
													label={space.state}
													color={space.state === 'beta' ? 'success' : 'warning'}
													variant='outlined'
												/> */}
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
											{center.description}
										</Typography>
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
														<em> BIDS datasets</em>
													</Typography>
												</Box>
											</Box>
										</>
									</CardContent>
								</Card>
							</>
						)}
					</Box>
				</Box>
			</Box>
		</>
	)
}

export default Dashboard
