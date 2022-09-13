import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Apps,
	Assignment,
	Dashboard,
	ExpandLess,
	ExpandMore,
	Folder,
	GroupWork,
	HealthAndSafety,
	HelpCenter,
	Monitor,
	Psychology,
	Public,
	Info,
} from '@mui/icons-material'
import {
	Avatar,
	Box,
	Collapse,
	Divider,
	Drawer,
	FormControlLabel,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	PaperProps,
	Switch,
	Typography,
} from '@mui/material'
import { CENTERS } from '../constants'
import React, { useState } from 'react'
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import { APP_MARGIN_TOP, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import SmallToolTip from './UI/smallToolTip'
import chuvLogo from '../assets/group__chuv__logo.png'
import GradingIcon from '@mui/icons-material/Grading'

const Navigation = (props: { PaperProps: PaperProps }): JSX.Element => {
	const { trackPageView } = useMatomo()
	const {
		debug: [debug, setDebug],
		user: [user],
	} = useAppStore()
	const navigate = useNavigate()

	const [itemIsOpen, setItemIsOpen] = useState<{ [key: string]: boolean }>({
		hip: true,
		centers: true,
		private: true,
	})

	const handleClickItem = (id: string) => {
		setItemIsOpen(o => ({
			...o,
			[id]: !o[id],
		}))
	}

	const handleClickNavigate = (route: string) => {
		trackPageView({ documentTitle: route })
		navigate(route)
	}

	const isRouteActive = (route: string) => {
		// const current = `${ROUTE_PREFIX}/${route}`
		// const resolved = useResolvedPath(current)
		// const match = useMatch({ path: resolved.pathname, end: true })

		// // open space for current selected tab
		// if (match) {
		// 	const space = route.split('/')[0]
		// 	if (!itemIsOpen[space]) {
		// 		setItemIsOpen(o => ({
		// 			...o,
		// 			[space]: true,
		// 		}))
		// 	}
		// }

		// return match !== null
		return false
	}

	const categories = [
		{
			id: 'hip',
			label: 'HIP',
			color: '#415795',
			image: null,
			title: null,
			divider: false,
			children: [
				{
					route: '',
					label: 'About',
					icon: <Info />,
					title: null,
					color: null,
					image: null,
					children: [],
				},
				{
					route: 'apps',
					label: 'App Catalog',
					icon: <Apps />,
					title: 'List of applications available on the HIP',
					color: null,
					image: null,
					children: [],
				},
				{
					route: 'documentation',
					label: 'Documentation',
					icon: <HelpCenter />,
					title: null,
					color: null,
					image: null,
					children: [],
				},
				{
					route: 'feedback',
					link: 'https://hip.collab.local/apps/forms/AF468tdy9qx2mmfF/submit',
					label: 'Feedback form',
					icon: <GradingIcon />,
					title: null,
					color: null,
					image: null,
					children: [],
				},
			],
		},
		{
			id: 'centers',
			label: 'CENTERS',
			route: 'centers',
			color: null,
			image: null,
			title: null,
			divider: true,
			children: [
				...CENTERS.sort(center =>
					user?.groups?.includes(center.id) ? -1 : 1
				).map(center => ({
					label: `${center.label}`,
					route: `private/${center.id}`,
					color: user?.groups?.includes(center.id) ? '#eee' : null,
					image: center.logo ? center.logo : null,
					icon: <HealthAndSafety />,
					title: null,
					children: user?.groups?.includes(center.id)
						? [
								{
									route: `private/${center.id}/sessions`,
									label: 'Desktops',
									icon: <Monitor />,
									title: 'Remote virtual desktops',
									color: null,
									image: null,
								},
								// {
								// 	route: 'private/data',
								// 	label: 'Data',
								// 	icon: <Folder />,
								// 	title: null,
								// 	disabled: true,
								// },
								{
									route: `private/${center.id}/workflows/bids`,
									label: 'BIDS',
									icon: <Assignment />,
									title:
										'BIDS datasets: Import, and manage data in BIDS format',
									disabled: false,
									color: null,
									image: null,
								},
								// {
								// 	route: 'private/projects',
								// 	label: 'Projects',
								// 	icon: <Psychology />,
								// 	title: null,
								// 	disabled: true,
								// },
						  ]
						: [],
				})),
			],
		},
		{
			id: 'collaborative',
			label: 'COLLABORATIVE',
			route: 'collaborative',
			title: null,
			color: null,
			image: null,
			divider: false,
			icon: <GroupWork />,
			children: [],
		},
		{
			id: 'public',
			label: 'PUBLIC',
			route: 'public',
			color: '#5f5d5c',
			image: null,
			icon: <Public />,
			title: null,
			divider: false,
			children: [],
		},
	]

	return (
		<Drawer
			variant='permanent'
			{...props}
			sx={{
				'& .MuiDrawer-paper': {
					boxSizing: 'border-box',
					top: `${APP_MARGIN_TOP}px`,
				},
				'& .Mui-selected': {
					color: 'white',
					backgroundColor: '#37474f !important',
				},
			}}
		>
			{user && user.groups && (
				<List sx={{ bgcolor: 'background.paper' }} component='nav'>
					{categories.map(category => {
						const { id, label, children, divider } = category
						return (
							<Box key={label} sx={{ bgcolor: '#fff' }}>
								<ListItemButton onClick={() => handleClickItem(id)}>
									<ListItemText color='text.secondary'>{label}</ListItemText>
									{itemIsOpen[id] ? <ExpandLess /> : <ExpandMore />}
								</ListItemButton>
								{divider && <Divider />}
								<Collapse in={itemIsOpen[id]} timeout='auto' unmountOnExit>
									{children.map(
										({ label, image, route, icon, color, children: kids }) => (
											<List
												key={label}
												disablePadding
												sx={{ backgroundColor: color }}
											>
												<ListItemButton
													key={label}
													sx={{ pl: 3 }}
													selected={isRouteActive(route)}
													onClick={() => handleClickNavigate(route)}
												>
													{!image && icon && (
														<ListItemIcon
															sx={{
																color: isRouteActive(route) ? 'white' : 'grey',
															}}
														>
															{icon}
														</ListItemIcon>
													)}
													<ListItemText>
														<Box
															sx={{
																display: 'flex',
																justifyContent: 'start',
																alignItems: 'center',
																gap: 2,
															}}
														>
															{image && (
																<Avatar
																	alt={label}
																	src={image}
																	sx={{ w: 32, h: 32 }}
																/>
															)}
															{label}
														</Box>
													</ListItemText>
												</ListItemButton>
												<Collapse
													in={itemIsOpen[id]}
													timeout='auto'
													unmountOnExit
												>
													<List disablePadding>
														{kids.map(({ label, route, icon, title }) => (
															<SmallToolTip
																title={title}
																placement='right'
																arrow
																key={label}
															>
																<ListItemButton
																	key={label}
																	sx={{ ml: 3 }}
																	selected={isRouteActive(route)}
																	onClick={() => handleClickNavigate(route)}
																>
																	<ListItemIcon
																		sx={{
																			color: isRouteActive(route)
																				? 'white'
																				: 'black',
																		}}
																	>
																		{icon}
																	</ListItemIcon>
																	<ListItemText>{label}</ListItemText>
																</ListItemButton>
															</SmallToolTip>
														))}
													</List>
												</Collapse>
												{divider && <Divider />}
											</List>
										)
									)}
								</Collapse>
							</Box>
						)
					})}
				</List>
			)}
			<Box sx={{ ml: 2, mt: 8 }}>
				<FormControlLabel
					control={<Switch checked={debug} onChange={() => setDebug(!debug)} />}
					label='Debug'
				/>
			</Box>
		</Drawer>
	)
}

export default Navigation
