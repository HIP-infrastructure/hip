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
	Switch,
} from '@mui/material'
import React, { useState } from 'react'
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import { APP_MARGIN_TOP, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

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
			children: [
				{
					route: '',
					label: 'Dashboard',
					icon: <Dashboard />,
					disabled: false,
				},
				{
					route: 'apps',
					label: 'App Catalog',
					icon: <Apps />,
					disabled: false,
				},
				{
					route: 'documentation',
					label: 'Documentation',
					icon: <HelpCenter />,
					disabled: false,
				},
			],
		},
		{
			label: 'My Private Space',
			route: 'private',
			color: '#415795',
			icon: <HealthAndSafety />,
			children: [
				{
					route: 'private/sessions',
					label: 'Desktops',
					icon: <Monitor />,
					disabled: false,
				},
				{
					route: 'private/data',
					label: 'Data Explorer',
					icon: <Folder />,
					disabled: false,
				},
				{
					route: 'private/workflows/bids',
					label: 'BIDS Importer',
					icon: <Assignment />,
					disabled: false,
				},
				{
					route: 'private/studies', // project ?
					label: 'Studies',
					icon: <Psychology />,
					disabled: true,
				},
			],
		},
		{
			label: 'Collaborative Space',
			route: 'collaborative',
			color: '#9c406e',
			icon: <GroupWork />,
			children: [
				{
					route: 'collaborative/sessions',
					label: 'Desktops',
					icon: <Monitor />,
					disabled: false,
				},
				{
					route: 'collaborative/data',
					label: 'Data',
					icon: <Folder />,
					disabled: false,
				},
				{
					route: 'collaborative/workflows',
					label: 'Workflows',
					icon: <Assignment />,
					disabled: false,
				},
				{
					route: 'collaborative/studies', // project ?
					label: 'Studies',
					icon: <Psychology />,
					disabled: true,
				},
			],
		},
		{
			label: 'Public Space',
			route: 'public',
			color: '#5f5d5c',
			icon: <Public />,
			children: [
				{
					route: 'public/sessions',
					label: 'Desktops',
					icon: <Monitor />,
					disabled: false,
				},
				{
					route: 'public/data',
					label: 'Data',
					icon: <Folder />,
					disabled: false,
				},
				{
					route: 'public/workflows',
					label: 'Workflows',
					icon: <Assignment />,
					disabled: false,
				},
				{
					route: 'public/studies', // project ?
					label: 'Studies',
					icon: <Psychology />,
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
				{categories.map(({ label, icon, color, children, route }) => (
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
							{children.map(({ label, route, icon, disabled }) => (
								<ListItem disablePadding key={label}>
									<ListItemButton
										sx={{ pl: 3 }}
										disabled={disabled}
										selected={IsActive(route)}
										onClick={() => handleClick(route)}
									>
										<ListItemIcon>{icon}</ListItemIcon>
										<ListItemText>{label}</ListItemText>
									</ListItemButton>
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
