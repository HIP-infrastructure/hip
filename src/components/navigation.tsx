import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Apps,
	Assignment,
	ExpandLess,
	ExpandMore,
	GroupWork,
	HealthAndSafety,
	HelpCenter,
	Monitor,
	Public,
	Info,
	Dashboard,
} from '@mui/icons-material'
import {
	Avatar,
	Box,
	Collapse,
	Divider,
	Drawer,
	FormControlLabel,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemAvatar,
	ListItemText,
	PaperProps,
	Switch,
	CircularProgress,
} from '@mui/material'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { APP_MARGIN_TOP, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import SmallToolTip from './UI/smallToolTip'
import GradingIcon from '@mui/icons-material/Grading'
import { Group, NavigationItem } from '../api/types'

const PRIVATE = 'private'

const Navigation = (props: { PaperProps: PaperProps }): JSX.Element => {
	const { trackPageView } = useMatomo()
	const {
		debug: [debug, setDebug],
		user: [user],
		groups: [groups],
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

	const placeholderSpaces = (
		center: Group | undefined | null = undefined
	): NavigationItem & { loading: boolean } => ({
		id: 'private',
		label: center?.label || 'WORKSPACE',
		route: null,
		color: '#efefef',
		disabled: true,
		image: center?.logo || null,
		icon: <HealthAndSafety />,
		loading: center === undefined ? true : center === null ? false : false,
		title: null,
		children: [
			{
				route: center ? `private/${center?.id}` : 'private/default',
				label: 'Dashboard',
				icon: <Dashboard />,
				title: center ? center.label : 'Dashboard',
				disabled: center === undefined ? true : center === null ? false : false,
				color: null,
				image: null,
				children: [],
			},
			{
				route: center
					? `private/${center.id}/sessions`
					: 'private/default/sessions',
				label: 'Desktops',
				icon: <Monitor />,
				title: 'Remote virtual desktops',
				disabled: false,
				color: null,
				image: null,
				children: [],
			},
			{
				route: center
					? `private/${center.id}/workflows/bids`
					: 'private/default/workflows/bids',
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

	const privateSpaces = groups
		?.filter(center => user?.groups?.includes(center.id))
		.map(center => placeholderSpaces(center)) || [placeholderSpaces()]

	const menu = [
		...(privateSpaces.length > 0 ? privateSpaces : [placeholderSpaces(null)]),
		{
			id: 'hip',
			label: 'DISCOVER',
			route: null,
			color: '#efefef',
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
			route: null,
			color: '#efefef',
			image: null,
			disabled: false,
			loading:
				user?.groups === undefined
					? true
					: user?.groups === null
					? true
					: false,
			title: null,
			children: [
				...(groups
					?.filter(center => !user?.groups?.includes(center.id))
					.map(center => ({
						id: null,
						type: 'center',
						label: `${center.label}`,
						route: `private/${center.id}`,
						color: null,
						disabled: false,
						image: center.logo ? center.logo : null,
						icon: null,
						title: null,
						children: [],
					})) || []),
			],
		},
		{
			id: 'collaborative',
			label: 'COLLABORATIVE',
			route: 'collaborative',
			title: null,
			color: '#efefef',
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
			color: '#efefef',
			image: null,
			icon: <Public />,
			disabled: true,
			title: null,
			divider: false,
			children: [],
		},
	]

	let activeStyle = {
		color: '#0277bd',
		fontWeight: 'bold',
	}

	const checkActive = (match: any, location: any) => {
		console.log(location)
		if (!location) return false
		const { pathname } = location
		const { url } = match
		return pathname === url ? true : false
	}

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
				{menu.map(
					(
						{ id, disabled, route, label, children, color, image, loading },
						index
					) => (
						<Box key={label} sx={{ bgcolor: '#fff' }}>
							<ListItemButton
								onClick={() => handleClickNavigate({ route, id })}
								sx={{ backgroundColor: color }}
								disabled={disabled}
							>
								{index === 0 && (
									<ListItemAvatar>
										{image && (
											<Avatar
												alt={label}
												src={`${process.env.REACT_APP_GATEWAY_API}/public/${image}`}
												sx={{ width: 32, height: 32 }}
											/>
										)}
										{!image && (
											<Avatar
												alt={label}
												sx={{ width: 32, height: 32, bgcolor: '#37474f' }}
											>
												{label[0]}
											</Avatar>
										)}
									</ListItemAvatar>
								)}
								<ListItemText>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											gap: 2,
										}}
									>
										<strong>{label}</strong>
										{loading && (
											<CircularProgress size={18} color='secondary' />
										)}
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
									({
										id,
										route,
										disabled,
										label,
										image,
										icon,
										color,
										children: kids,
									}) => (
										<List
											key={label}
											disablePadding
											sx={{ backgroundColor: color }}
										>
											<ListItemButton
												key={label}
												sx={{ pl: 3 }}
												disabled={disabled}
												onClick={() => handleClickNavigate({ route, id })}
											>
												{icon && <ListItemIcon>{icon}</ListItemIcon>}
												{!icon && (
													<ListItemAvatar>
														{image && (
															<Avatar
																alt={label}
																src={`${process.env.REACT_APP_GATEWAY_API}/public/${image}`}
															/>
														)}
														{!image && <Avatar alt={label}>{label[0]}</Avatar>}
													</ListItemAvatar>
												)}
												<ListItemText>
													<NavLink
														end
														to={`${ROUTE_PREFIX}/${route}`}
														style={({ isActive }) =>
															isActive ? activeStyle : { color: '#37474f' }
														}
														onClick={() => handleClickNavigate({ route, id })}
													>
														{label}
													</NavLink>
												</ListItemText>
											</ListItemButton>
											<Collapse
												in={id ? itemIsOpen[id] : itemIsOpen['']}
												timeout='auto'
												unmountOnExit
											>
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
																onClick={() =>
																	handleClickNavigate({ route, id })
																}
															>
																<ListItemIcon>{icon}</ListItemIcon>
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
					)
				)}
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
