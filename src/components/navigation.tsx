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

	const privateSpaces = CENTERS.filter(center =>
		user?.groups?.includes(center.id)
	).map(center => ({
		id: 'private',
		label: `${center.label}`,
		route: `private/${center.id}`,
		color: '#ccc',
		image: center.logo ? center.logo : null,
		icon: <HealthAndSafety />,
		title: null,
		children: [
			{
				id: '',
				route: `private/${center.id}/sessions`,
				label: 'Desktops',
				icon: <Monitor />,
				title: 'Remote virtual desktops',
				color: '#ccc',
				image: null,
				children: [],
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
				title: 'BIDS datasets: Import, and manage data in BIDS format',
				disabled: false,
				color: '#ccc',
				image: null,
				children: [],
			},
			// {
			// 	route: 'private/projects',
			// 	label: 'Projects',
			// 	icon: <Psychology />,
			// 	title: null,
			// 	disabled: true,
			// },
		],
	}))

	const categories = [
		{
			id: 'hip',
			label: 'HIP',
			color: null,
			image: null,
			title: null,
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
					divider: true,
				},
			],
		},
		...privateSpaces,
		{
			id: 'centers',
			label: 'CENTERS',
			route: 'centers',
			color: null,
			image: null,
			title: null,
			children: [
				...CENTERS.filter(center => !user?.groups?.includes(center.id)).map(
					center => ({
						label: `${center.label}`,
						route: `private/${center.id}`,
						color: null,
						image: center.logo ? center.logo : null,
						icon: <HealthAndSafety />,
						title: null,
						children: [],
					})
				),
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
			color: null,
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
			<List sx={{ bgcolor: 'background.paper' }} component='nav'>
				{categories.map(({ id, label, children, color, image }) => (
					<Box key={label} sx={{ bgcolor: '#fff' }}>
						<ListItemButton onClick={() => handleClickItem(id)} sx={{ backgroundColor: color }}>
							<ListItemText >
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'start',
										alignItems: 'center',
										gap: 2,
									}}
								>
									{image && (
										<Avatar alt={label} src={image} sx={{ w: 32, h: 32 }} />
									)}
									<strong>{label}</strong>
								</Box>
							</ListItemText>
							{itemIsOpen[id] ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>
						<Divider />
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
										<Collapse in={itemIsOpen[id]} timeout='auto' unmountOnExit>
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
									</List>
								)
							)}
						</Collapse>
						<Divider />
					</Box>
				))}
			</List>

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
