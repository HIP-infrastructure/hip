import * as React from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Apps,
	Assignment,
	Dashboard,
	ExpandLess,
	ExpandMore,
	GroupWork,
	HealthAndSafety,
	HelpCenter,
	Info,
	Monitor,
	Public,
	AdminPanelSettings,
} from '@mui/icons-material'
import GradingIcon from '@mui/icons-material/Grading'
import {
	Avatar,
	Box,
	CircularProgress,
	Collapse,
	Divider,
	Drawer,
	Link,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	PaperProps,
} from '@mui/material'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HIPGroup, NavigationItem } from '../api/types'
import { APP_MARGIN_TOP, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import SmallToolTip from './UI/smallToolTip'

const PRIVATE = 'private'

const Navigation = (props: { PaperProps: PaperProps }): JSX.Element => {
	const { trackPageView } = useMatomo()
	const {
		user: [user],
		hipGroups: [groups],
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
		center: HIPGroup | undefined | null = undefined
	): NavigationItem & { loading: boolean } => ({
		id: 'private',
		label: center?.label || 'WORKSPACE',
		route: center ? `private/${center?.id}` : 'private/default',
		link: null,
		color: '#efefef',
		disabled: center === undefined ? true : center === null ? true : false,
		image: center?.logo || null,
		icon: <HealthAndSafety />,
		loading: center === undefined ? true : center === null ? false : false,
		title: null,
		children: [
			{
				route: center ? `private/${center?.id}` : 'private/default',
				link: null,
				label: 'Dashboard',
				icon: <Dashboard />,
				title: center ? center.label : 'Dashboard',
				disabled: center === undefined ? true : center === null ? true : false,
				color: null,
				image: null,
				children: [],
			},
			{
				route: center
					? `private/${center.id}/sessions`
					: 'private/default/sessions',
				link: null,
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
					? `private/${center.id}/datasets`
					: 'private/default/datasets',
				link: null,
				label: 'BIDS Datasets',
				icon: <Assignment />,
				title: 'Browse and manage datasets',
				disabled: false,
				color: null,
				image: null,
				children: [],
			},
			{
				route: center
					? `private/${center.id}/workflows/bidsimport`
					: 'private/default/workflows/bidsimport',
				link: null,
				label: 'BIDS Importer',
				icon: <Assignment />,
				title: 'BIDS datasets: Import, and manage data in BIDS format',
				disabled: false,
				color: null,
				image: null,
				children: [],
			},
			{
				route: center
					? `private/${center.id}/workflows/bidssearch`
					: 'private/default/workflows/bidssearch',
				link: null,
				label: 'BIDS Browser',
				icon: <Assignment />,
				title: 'Browse the datasets in the BIDS format',
				disabled: false,
				color: null,
				image: null,
				children: [],
			},
			...((user?.isAdmin && [
				{
					route: 'admin',
					link: null,
					label: 'Admin',
					icon: <AdminPanelSettings />,
					title: '',
					disabled: false,
					color: null,
					image: null,
					children: [],
				},
			]) ||
				[]),
		],
	})

	const privateSpaces = groups
		?.filter(center => user?.groups?.includes(center.id))
		.map(center => placeholderSpaces(center)) || [placeholderSpaces(null)]

	const menu = [
		...(privateSpaces.length > 0 ? privateSpaces : [placeholderSpaces(null)]),
		{
			id: 'hip',
			label: 'DISCOVER',
			route: null,
			link: null,
			color: '#efefef',
			image: null,
			disabled: false,
			title: null,
			children: [
				{
					id: null,
					route: '',
					link: null,
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
					link: null,
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
					link: null,
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
					route: null,
					link: 'https://thehip.app/apps/forms/X6fZisdX6sc5R9ZW',
					label: 'Bug Report',
					icon: <GradingIcon />,
					title: null,
					color: null,
					disabled: false,
					image: null,
					children: [],
					divider: true,
				},
				{
					id: null,
					route: null,
					link: 'https://thehip.app/apps/forms/QdcG7wcKEGDHHH87',
					label: 'Feedback',
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
			link: null,
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
				...(groups?.map((center: HIPGroup) => ({
					id: null,
					type: 'center',
					label: `${center.label}`,
					route: `private/${center.id}`,
					link: null,
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
			link: null,
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
			link: null,
			color: '#efefef',
			image: null,
			icon: <Public />,
			disabled: true,
			title: null,
			divider: false,
			children: [],
		},
	]

	const activeStyle = {
		color: '#0277bd',
		fontWeight: 'bold',
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
										link,
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
												onClick={() =>
													link
														? window.location.href = link
														: handleClickNavigate({ route, id })
												}
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
													<>
														{!link && (
															<NavLink
																end
																to={`${ROUTE_PREFIX}/${route}`}
																style={({ isActive }) =>
																	isActive ? activeStyle : { color: '#37474f' }
																}
																onClick={() =>
																	handleClickNavigate({ route, id })
																}
															>
																{label}
															</NavLink>
														)}
														{link && (
															<Link
																href={void 0}
																style={{
																	color: 'rgb(55, 71, 79)',
																	textDecoration: 'none',
																	border: 0,
																}}
															>
																{label}
															</Link>
														)}
													</>
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
		</Drawer>
	)
}

export default Navigation
