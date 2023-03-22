import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Apps,
	Assignment,
	Dashboard,
	ExpandLess,
	ExpandMore,
	Folder,
	Monitor,
	Adb,
	CreateNewFolder,
	ContentCopy,
	BugReport,
	HelpCenter,
	Info,
	Support,
	SyncProblem,
} from '@mui/icons-material'
import {
	Avatar,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	Switch,
} from '@mui/material'

import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { API_GATEWAY } from '../api/gatewayClientAPI'
import { APP_MARGIN_TOP, DRAWER_WIDTH, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../Store'

const defaultCenters = [{ label: 'WORKSPACE', id: null, logo: null }]

const Sidebar = () => {
	const navigate = useNavigate()
	const { trackPageView } = useMatomo()

	const {
		user: [user],
		debug: [debug, setDebug],
		centers: [centers],
		projects: [projects],
	} = useAppStore()

	const [openProjects, setOpenProjects] = React.useState<{
		[key: string]: boolean
	}>({})

	React.useEffect(() => {
		if (!user?.uid) return
	}, [user])

	const handleClick = (projectId: string) => {
		setOpenProjects(op => ({ ...op, [projectId]: !op[projectId] ?? false }))
	}

	const handleClickNavigate = (route: string) => {
		trackPageView({ documentTitle: route })
		navigate(`${ROUTE_PREFIX}${route}`)
	}

	const userCenters =
		(user?.groups &&
			centers?.filter(center => user?.groups?.includes(center.id))) ||
		null

	return (
		<Drawer
			variant='permanent'
			anchor='left'
			sx={{
				'& .MuiDrawer-paper': {
					boxSizing: 'border-box',
					top: `${APP_MARGIN_TOP}px`,
					width: `${DRAWER_WIDTH}px`,
				},
				'& .Mui-selected': {
					color: 'white',
					backgroundColor: '#37474f !important',
				},
				flexShrink: 0,
				width: DRAWER_WIDTH,
			}}
		>
			<List>
				<ListItemButton onClick={() => handleClickNavigate('/centers')}>
					<ListItemIcon>
						<Apps />
					</ListItemIcon>
					<ListItemText primary='CENTERS' />
				</ListItemButton>
			</List>
			<Divider />
			{userCenters?.length === 0 && (
				<List component='div' disablePadding>
					<ListSubheader id='center-subheader'>My Center</ListSubheader>
					<ListItemButton
						onClick={() => handleClickNavigate(`/centers/default`)}
					>
						<ListItemIcon>
							<SyncProblem />
						</ListItemIcon>
						<ListItemText primary={`You are not part of any center`} />
					</ListItemButton>
				</List>
			)}
			{(userCenters || defaultCenters).map(center => (
				<Box key={center.id}>
					<List
						subheader={
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									mr: 2,
									justifyContent: 'space-between',
								}}
							>
								<ListSubheader id='center-subheader'>
									My Center: {center.label}
								</ListSubheader>
								{userCenters ? (
									<Avatar
										alt={center.label}
										src={`${API_GATEWAY}/public/${center?.logo}`}
										sx={{ width: 32, height: 32 }}
									/>
								) : (
									<CircularProgress size={18} color='secondary' />
								)}
							</Box>
						}
					>
						<ListItemButton
							sx={{ pl: 4 }}
							disabled={!userCenters}
							onClick={() => handleClickNavigate(`/centers/${center?.id}`)}
						>
							<ListItemIcon>
								<Dashboard />
							</ListItemIcon>
							<ListItemText primary='Private Workspace' />
						</ListItemButton>
						<ListItemButton
							sx={{ pl: 4 }}
							onClick={() =>
								handleClickNavigate(`/centers/${center.id}/desktops`)
							}
						>
							<ListItemIcon>
								<Monitor />
							</ListItemIcon>
							<ListItemText primary='Desktops' />
						</ListItemButton>
						<ListItemButton
							sx={{ pl: 4 }}
							disabled={!userCenters}
							onClick={() =>
								handleClickNavigate(`/centers/${center.id}/datasets`)
							}
						>
							<ListItemIcon>
								<Assignment />
							</ListItemIcon>
							<ListItemText primary='BIDS Datasets' />
						</ListItemButton>
					</List>
					<Divider />
				</Box>
			))}
			<List>
				<ListItemButton onClick={() => handleClickNavigate('/projects')}>
					<ListItemIcon>
						<Apps />
					</ListItemIcon>
					<ListItemText primary='PROJECTS' />
				</ListItemButton>
			</List>
			<Divider />
			<List
				component='nav'
				aria-labelledby='projects-subheader'
				subheader={
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							mr: 1,
							justifyContent: 'space-between',
						}}
					>
						<ListSubheader id='my-projects-subheader'>
							My Projects
						</ListSubheader>
						{(!projects || !user) && (
							<CircularProgress size={18} color='secondary' />
						)}
						{user?.hasProjectsAdminRole && (
							<IconButton
								color='primary'
								onClick={() => navigate(`${ROUTE_PREFIX}/projects/create`)}
								aria-label={`Create new project`}
							>
								<CreateNewFolder />
							</IconButton>
						)}
					</Box>
				}
			>
				{projects?.filter(p => p.isMember).length === 0 && (
					<List component='div' disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<SyncProblem />
							</ListItemIcon>
							<ListItemText primary={`You are not part of any project`} />
						</ListItemButton>
					</List>
				)}
				{projects
					?.filter(p => p.isMember)
					.map(project => (
						<Box key={project.name}>
							<ListItemButton onClick={() => handleClick(project?.name)}>
								<ListItemIcon>
									<Folder />
								</ListItemIcon>
								<ListItemText primary={`${project.title}`} />
								{openProjects[project.name] ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse
								in={openProjects[project.name]}
								timeout='auto'
								unmountOnExit
							>
								<List component='div' disablePadding>
									<ListItemButton
										sx={{ pl: 4 }}
										onClick={() =>
											handleClickNavigate(`/projects/${project.name}`)
										}
									>
										<ListItemIcon>
											<Dashboard />
										</ListItemIcon>
										<ListItemText primary='Collaborative Workspace' />
									</ListItemButton>
									<ListItemButton
										sx={{ pl: 4 }}
										onClick={() =>
											handleClickNavigate(
												`/projects/${project.name}/desktops`
											)
										}
									>
										<ListItemIcon>
											<Monitor />
										</ListItemIcon>
										<ListItemText primary='Desktops' />
									</ListItemButton>
									<ListItemButton
										sx={{ pl: 4 }}
										onClick={() =>
											handleClickNavigate(
												`/projects/${project.name}/metadata/`
											)
										}
									>
										<ListItemIcon>
											<ContentCopy />
										</ListItemIcon>
										<ListItemText primary='Files' />
									</ListItemButton>
									<ListItemButton
										sx={{ pl: 4 }}
										onClick={() =>
											handleClickNavigate(
												`/projects/${project.name}/datasets/`
											)
										}
									>
										<ListItemIcon>
											<Assignment />
										</ListItemIcon>
										<ListItemText primary='BIDS Dataset' />
									</ListItemButton>
								</List>
							</Collapse>
							<Divider />
						</Box>
					))}
			</List>
			<List
				sx={{
					marginTop: 'auto',
				}}
				component='nav'
				aria-labelledby='docs-subheader'
			>
				<ListItemButton onClick={() => setDebug(!debug)}>
					<ListItemIcon>
						<Adb />
					</ListItemIcon>
					<ListItemText primary='Debug' />
					<Switch checked={debug} />
				</ListItemButton>
				<ListItemButton onClick={() => handleClickNavigate('/')}>
					<ListItemIcon>
						<Info />
					</ListItemIcon>
					<ListItemText primary='About' />
				</ListItemButton>
				<ListItemButton onClick={() => handleClickNavigate('/apps')}>
					<ListItemIcon>
						<Apps />
					</ListItemIcon>
					<ListItemText primary='App Catalog' />
				</ListItemButton>
				<ListItemButton onClick={() => handleClickNavigate('/documentation')}>
					<ListItemIcon>
						<HelpCenter />
					</ListItemIcon>
					<ListItemText primary='Documentation' />
				</ListItemButton>
				<ListItemButton
					onClick={() => {
						window.location.href =
							'https://thehip.app/apps/forms/X6fZisdX6sc5R9ZW'
					}}
				>
					<ListItemIcon>
						<BugReport />
					</ListItemIcon>
					<ListItemText primary='Bug report' />
				</ListItemButton>
				<ListItemButton
					onClick={() => {
						window.location.href =
							'https://thehip.app/apps/forms/QdcG7wcKEGDHHH87'
					}}
				>
					<ListItemIcon>
						<Support />
					</ListItemIcon>
					<ListItemText primary='Feedback' />
				</ListItemButton>

				<Box height={`${APP_MARGIN_TOP}px}`} />
			</List>
		</Drawer>
	)
}

export default Sidebar
