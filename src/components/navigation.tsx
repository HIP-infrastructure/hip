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

const PRIVATE = 'private'

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
		[PRIVATE]: true,
	})

	const handleClickNavigate = ({
		route,
		id,
	}: {
		route?: string | null
		id?: string | null
	}) => {
		if (route !== null && route !== undefined) {
			trackPageView({ documentTitle: route })
			navigate(route)
		}

		if (id && id !== PRIVATE) {
			setItemIsOpen(o => ({
				...o,
				[id]: !o[id],
			}))
		}
	}

	const isRouteActive = (route: string) => {

		// const current = `${ROUTE_PREFIX}/${route}`
		// const resolved = useResolvedPath(current)
		// const match = useMatch({ path: resolved.pathname, end: true })
		
		// return match !== null

		return false
	}

	interface NavigationItem {
		id?: string
		route?: string | null
		icon: JSX.Element
		label: string
		children: NavigationItem[]
		title?: string | null
		color?: string | null
		image?: string | null
		disabled: boolean,
	}

	const privateSpaces: NavigationItem[] = user?.groups
		? CENTERS.filter(center => user?.groups?.includes(center.id)).map(
				center => ({
					id: 'private',
					label: `${center.label}`,
					route: `private/${center.id}`,
					color: null,
					disabled: false,
					image: center.logo ? center.logo : null,
					icon: <HealthAndSafety />,
					title: null,
					children: [
						{
							route: `private/${center.id}/sessions`,
							label: 'Desktops',
							icon: <Monitor />,
							title: 'Remote virtual desktops',
							disabled: false,
							color: null,
							image: null,
							children: [],
						},
						{
							route: `private/${center.id}/workflows/bids`,
							label: 'BIDS',
							icon: <Assignment />,
							title: 'BIDS datasets: Import, and manage data in BIDS format',
							disabled: false,
							color: null,
							image: null,
							children: [],
						},
					],
				})
		  )
		: [
				{
					id: 'private',
					label: `LOADING...`,
					route: null,
					color: '#ccc',
					disabled: true,
					image: null,
					icon: <HealthAndSafety />,
					title: null,
					children: [
						{
							route: null,
							label: 'Desktops',
							icon: <Monitor />,
							disabled: true,

							title: 'Remote virtual desktops',
							color: null,
							image: null,
							children: [],
						},
						{
							route: null,
							label: 'BIDS',
							icon: <Assignment />,
							disabled: true,
							title: 'BIDS datasets: Import, and manage data in BIDS format',
							color: null,
							image: null,
							children: [],
						},
					],
				},
		  ]

	const categories = [
		...privateSpaces,
		{
			id: 'hip',
			label: 'DISCOVER',
			color: null,
			image: null,
			disabled: false,

			title: null,
			children: [
				{
					id: null,
					route: '',
					label: 'About',
					icon: <Info />,
					title: null,
					disabled: false,

					color: null,
					image: null,
					children: [],
				},
				{
					id: null,
					route: 'apps',
					label: 'App Catalog',
					icon: <Apps />,
					title: 'List of applications available on the HIP',
					color: null,
					disabled: false,

					image: null,
					children: [],
				},
				{
					id: null,
					route: 'documentation',
					label: 'Documentation',
					icon: <HelpCenter />,
					title: null,
					color: null,
					disabled: false,

					image: null,
					children: [],
				},
				{
					id: null,
					route: 'feedback',
					link: 'https://hip.collab.local/apps/forms/AF468tdy9qx2mmfF/submit',
					label: 'Feedback form',
					icon: <GradingIcon />,
					title: null,
					color: null,
					disabled: false,

					image: null,
					children: [],
					divider: true,
				},
			],
		},
		{
			id: 'centers',
			label: 'CENTERS',
			route: 'centers',
			color: null,
			image: null,
			disabled: false,

			title: null,
			children: [
				...CENTERS.filter(center => !user?.groups?.includes(center.id)).map(
					center => ({
						id: null,
						label: `${center.label}`,
						route: `private/${center.id}`,
						color: null,
						disabled: false,

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
			disabled: true,
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
			disabled: true,
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
				{categories.map(({ id, disabled, route, label, children, color, image }) => (
					<Box key={label} sx={{ bgcolor: '#fff' }}>
						<ListItemButton
							onClick={() => handleClickNavigate({ route, id })}
							sx={{ backgroundColor: color }}
							disabled={disabled}
						>
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
										<Avatar alt={label} src={image} sx={{ w: 32, h: 32 }} />
									)}
									<strong>{label}</strong>
								</Box>
							</ListItemText>
							{id &&
								id !== PRIVATE &&
								(id && itemIsOpen[id] ? <ExpandLess /> : <ExpandMore />)}
						</ListItemButton>
						<Divider />
						<Collapse
							in={(id && itemIsOpen[id]) || false}
							timeout='auto'
							unmountOnExit
						>
							{children.map(
								({ id, route, disabled, label, image, icon, color, children: kids }) => (
									<List
										key={label}
										disablePadding
										sx={{ backgroundColor: color }}
									>
										<ListItemButton
											key={label}
											sx={{ pl: 3 }}
											disabled={disabled}
											selected={(route && isRouteActive(route)) || false}
											onClick={() => handleClickNavigate({ route, id })}
										>
											{!image && icon && (
												<ListItemIcon
													sx={{
														color:
															route && isRouteActive(route) ? 'white' : 'grey',
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
										<Collapse in={id ? itemIsOpen[id] : label} timeout='auto' unmountOnExit>
											<List disablePadding>
												{kids.map(({ id, route, label, icon, title }) => (
													<SmallToolTip
														title={title || ''}
														placement='right'
														arrow
														key={label}
													>
														<ListItemButton
															key={label}
															sx={{ ml: 3 }}
															selected={
																(route && isRouteActive(route)) || false
															}
															onClick={() => handleClickNavigate({ route, id })}
														>
															<ListItemIcon
																sx={{
																	color:
																		route && isRouteActive(route)
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
