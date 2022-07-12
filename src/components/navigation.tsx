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
	Public
} from '@mui/icons-material'
import {
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
	Switch
} from '@mui/material'
import React, { useState } from 'react'
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import { APP_MARGIN_TOP, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import SmallToolTip from './UI/smallToolTip'

const Navigation = (props: { PaperProps: PaperProps }): JSX.Element => {
	const { trackPageView } = useMatomo()
	const [spaceIsOpen, setSpaceIsOpen] = useState<{ [key: string]: boolean }>({
		hip: true,
		private: true,
	})
	const {
		debug: [debug, setDebug],
	} = useAppStore()
	const navigate = useNavigate()

	const handleClick = (route: string) => {
		trackPageView({ documentTitle: route })
		navigate(route)
	}

	const handleClickSpace = (route: string) => {
		setSpaceIsOpen(o => ({
			...o,
			[route]: !o[route],
		}))
	}

	const IsActive = (route: string) => {
		const current = `${ROUTE_PREFIX}/${route}`
		const resolved = useResolvedPath(current)
		const match = useMatch({ path: resolved.pathname, end: true })

		// open space for current selected tab
		if (match) {
			const space = route.split('/')[0]
			if (!spaceIsOpen[space]) {
				setSpaceIsOpen(o => ({
					...o,
					[space]: true,
				}))
			}
		}

		return match !== null
	}

	const categories = [
		{
			label: 'HIP',
			route: 'hip',
			title: null,
			children: [
				{
					route: '',
					label: 'Dashboard',
					icon: <Dashboard />,
					title: null,
					disabled: false,
				},
				{
					route: 'apps',
					label: 'App Catalog',
					icon: <Apps />,
					title: 'List of applications available on the HIP',
					disabled: false,
				},
				{
					route: 'documentation',
					label: 'Documentation',
					icon: <HelpCenter />,
					title: null,
					disabled: false,
				},
			],
		},
		{
			label: 'Private Space',
			route: 'private',
			color: '#415795',
			icon: <HealthAndSafety />,
			title: null,
			children: [
				{
					route: 'private/sessions',
					label: 'Desktops',
					icon: <Monitor />,
					title: 'Remote virtual desktops',
					disabled: false,
				},
				{
					route: 'private/data',
					label: 'Data',
					icon: <Folder />,
					title: null,
					disabled: true,
				},
				{
					route: 'private/workflows/bids',
					label: 'BIDS',
					icon: <Assignment />,
					title: 'BIDS databsases: Import, and manage data in BIDS format',
					disabled: false,
				},
				{
					route: 'private/projects',
					label: 'Projects',
					icon: <Psychology />,
					title: null,
					disabled: true,
				},
			],
		},
		{
			label: 'Collaborative Space',
			route: 'collaborative',
			color: '#9c406e',
			title: null,
			icon: <GroupWork />,
			children: [
				{
					route: 'collaborative/sessions',
					label: 'Desktops',
					icon: <Monitor />,
					title: null,
					disabled: true,
				},
				{
					route: 'collaborative/data',
					label: 'Data',
					icon: <Folder />,
					title: null,
					disabled: true,
				},
				{
					route: 'collaborative/workflows',
					label: 'BIDS',
					icon: <Assignment />,
					title: null,
					disabled: true,
				},
				{
					route: 'collaborative/projects',
					label: 'Project',
					icon: <Psychology />,
					title: null,
					disabled: true,
				},
			],
		},
		{
			label: 'Public Space',
			route: 'public',
			color: '#5f5d5c',
			icon: <Public />,
			title: null,
			children: [
				{
					route: 'public/sessions',
					label: 'Desktops',
					icon: <Monitor />,
					title: null,
					disabled: true,
				},
				{
					route: 'public/data',
					label: 'Data',
					icon: <Folder />,
					title: null,
					disabled: true,
				},
				{
					route: 'public/workflows',
					label: 'BIDS',
					icon: <Assignment />,
					title: null,
					disabled: true,
				},
				{
					route: 'public/projects',
					label: 'Projects',
					icon: <Psychology />,
					title: null,
					disabled: true,
				},
			],
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
			}}
		>
			<List sx={{ bgcolor: 'background.paper' }} component='nav'>
				{categories.map(({ label, children, route }) => (
					<Box key={label} sx={{ bgcolor: '#fff' }}>
						<ListItemButton
							sx={{ mt: 2 }}
							onClick={() => handleClickSpace(route)}
						>
							{/* {icon && <ListItemIcon>{icon}</ListItemIcon>} */}
							<ListItemText>{label}</ListItemText>
							{spaceIsOpen[route] ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>
						<Collapse
							sx={{ mt: 1 }}
							in={spaceIsOpen[route]}
							timeout='auto'
							unmountOnExit
						>
							{children.map(({ label, route, icon, title, disabled }) => (
								<ListItem disablePadding key={label}>
									{title && (
										<SmallToolTip title={title} placement='right' arrow>
											<ListItemButton
												sx={{ pl: 3 }}
												disabled={disabled}
												selected={IsActive(route)}
												onClick={() => handleClick(route)}
											>
												<ListItemIcon>{icon}</ListItemIcon>
												<ListItemText>{label}</ListItemText>
											</ListItemButton>
										</SmallToolTip>
									)}
									{!title && (
										<ListItemButton
											sx={{ pl: 3 }}
											disabled={disabled}
											selected={IsActive(route)}
											onClick={() => handleClick(route)}
										>
											<ListItemIcon>{icon}</ListItemIcon>
											<ListItemText>{label}</ListItemText>
										</ListItemButton>
									)}
								</ListItem>
							))}
						</Collapse>
						<Divider sx={{ mt: 2 }} />
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
