import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Apps,
	Assignment,
	ExpandLess,
	ExpandMore,
	Folder,
	Monitor,
	Adb,
	CreateNewFolder,
	ContentCopy,
	HelpCenter,
	Info,
	Support,
	SyncProblem,
	Storage,
	Schedule,
	Chat,
} from '@mui/icons-material'
import {
	Avatar,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	Switch,
} from '@mui/material'
import Tooltip from './UI/Tooltip'

import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import * as React from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_GATEWAY } from '../api/gatewayClientAPI'
import { APP_MARGIN_TOP, DRAWER_WIDTH, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../Store'
import { HIPCenter } from '../api/types'

const defaultCenters: HIPCenter[] = [
	{
		label: 'WORKSPACE',
		id: 'default',
	},
]

const footerStyle = {
	position: 'fixed',
	width: DRAWER_WIDTH - 1,
	backgroundColor: '#fff',
	borderTop: '1px solid #e0e0e0',
	bottom: 0,
	left: 0,
	textAlign: 'center',
	padding: 0,
	margin: 0,
}

const Sidebar = () => {
	const navigate = useNavigate()
	const { trackPageView } = useMatomo()
	const { pathname } = useLocation()
	const {
		user: [user],
		debug: [debug, setDebug],
		centers: [centers],
		userProjects: [userProjects, setUserProjects],
		selectedProject: [selectedProject],
		tooltips: [showTooltip],
		tabbedDesktops: [tabbedDesktops],
	} = useAppStore()

	const [openProjects, setOpenProjects] = React.useState<{
		[key: string]: boolean
	}>({})
	const [openTools, setOpenTools] = React.useState(false)

	useEffect(() => {
		const projectId = selectedProject?.name
		if (!projectId) return

		setOpenProjects({ [projectId]: true })
	}, [selectedProject])

	const handleProjectClick = (projectId: string) => {
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
				flexShrink: 0,
				width: DRAWER_WIDTH,
			}}
		>
			{userCenters?.length === 0 && (
				<List component='div' disablePadding>
					<ListSubheader id='center-subheader'>My Center</ListSubheader>
					<ListItemButton
						sx={{ pl: 2 }}
						onClick={() => handleClickNavigate(`/centers/default`)}
					>
						<ListItemIcon>
							<SyncProblem />
						</ListItemIcon>
						<ListItemText primary={`You are not part of any center`} />
					</ListItemButton>
				</List>
			)}
			<Divider />
			<Box>
				<Tooltip title={`Files`} placement={'bottom'} showTooltip={showTooltip}>
					<Box></Box>
				</Tooltip>
				<Tooltip title={`Chat`} placement={'bottom'} showTooltip={showTooltip}>
					<Box sx={{ ml: 12 }}></Box>
				</Tooltip>
			</Box>
			<ListSubheader id='my-private-workspaces-subheader'>
				Private workspace
			</ListSubheader>
			{(userCenters ?? defaultCenters).map(center => (
				<Box key={center.id}>
					<List>
						<Tooltip title={`Your Private Workspace`} showTooltip={showTooltip}>
							<ListItemButton
								sx={{ pl: 2 }}
								disabled={!userCenters}
								selected={`${ROUTE_PREFIX}/centers/${center?.id}` === pathname}
								onClick={() => handleClickNavigate(`/centers/${center?.id}`)}
							>
								<ListItemIcon>
									{userCenters ? (
										<Avatar
											alt={center.label}
											src={`${API_GATEWAY}/public/${center?.logo}`}
											sx={{ width: 32, height: 32 }}
										/>
									) : (
										<CircularProgress size={18} color='secondary' />
									)}
								</ListItemIcon>
								<ListItemText primary={center.label} />
								<ExpandMore />
							</ListItemButton>
						</Tooltip>
						<List>
							<Tooltip
								title='Process data in remote desktops'
								showTooltip={showTooltip}
							>
								<ListItemButton
									sx={{ pl: 4 }}
									selected={
										`${ROUTE_PREFIX}/centers/${center?.id}/desktops` === pathname
									}
									onClick={() =>
										handleClickNavigate(`/centers/${center.id}/desktops`)
									}
								>
									<ListItemIcon>
										<Monitor />
									</ListItemIcon>
									<ListItemText primary='Desktops' />
								</ListItemButton>
								</Tooltip>
								{tabbedDesktops?.map(d => 
									<ListItemButton
										key={d}
										sx={{ pl: 8 }}
										selected={
											`${ROUTE_PREFIX}/centers/${center?.id}/desktops/${d}` ===
											pathname
										}
										onClick={() =>
											handleClickNavigate(`/centers/${center?.id}/desktops/${d}`)
										}
									>
										<ListItemIcon>
											<Monitor />
										</ListItemIcon>
										<ListItemText primary={`${d}`} />
									</ListItemButton>
								)}
						</List>
						<Tooltip title='Upload your files' showTooltip={showTooltip}>
							<ListItemButton
								sx={{ pl: 4 }}
								selected={
									`${ROUTE_PREFIX}/centers/${center?.id}/files` === pathname
								}
								onClick={() =>
									handleClickNavigate(`/centers/${center.id}/files`)
								}
							>
								<ListItemIcon>
									<Storage />
								</ListItemIcon>
								<ListItemText primary='Files' />
							</ListItemButton>
						</Tooltip>
					</List>
					<Divider />
				</Box>
			))}
			<List
				component='nav'
				aria-labelledby='projects-subheader'
				subheader={
					<Tooltip
						title={`Your projects ${
							user?.hasProjectsAdminRole
								? 'As an admin, you can create new projects'
								: ''
						}`}
						showTooltip={showTooltip}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								mr: 1,
								justifyContent: 'space-between',
							}}
						>
							<ListSubheader id='my-projects-subheader'>
								Collaborative workspaces
							</ListSubheader>
							{(!userProjects || !user) && (
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
					</Tooltip>
				}
			>
				{userProjects?.length === 0 && (
					<List component='div' disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<Schedule />
							</ListItemIcon>
							<ListItemText primary={`You are not part of any project`} />
						</ListItemButton>
					</List>
				)}
				{userProjects?.map(project => (
					<Box
						key={project.name}
						sx={{
							backgroundColor:
								openProjects[project.name] &&
								pathname.includes(`${ROUTE_PREFIX}/projects/${project.name}`)
									? '#f2f2f2'
									: 'white',
						}}
					>
						<ListItemButton
							onClick={() => {
								handleClickNavigate(`/projects/${project.name}`)
								handleProjectClick(project?.name)
							}}
							selected={`${ROUTE_PREFIX}/projects/${project.name}` === pathname}
						>
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
									selected={
										`${ROUTE_PREFIX}/projects/${project.name}/desktops` ===
										pathname
									}
									onClick={() =>
										handleClickNavigate(`/projects/${project.name}/desktops`)
									}
								>
									<ListItemIcon>
										<Monitor />
									</ListItemIcon>
									<ListItemText primary='Desktops' />
								</ListItemButton>
								<ListItemButton
									sx={{ pl: 4 }}
									selected={
										`${ROUTE_PREFIX}/projects/${project.name}/transfer` ===
										pathname
									}
									onClick={() =>
										handleClickNavigate(`/projects/${project.name}/transfer`)
									}
								>
									<ListItemIcon>
										<ContentCopy />
									</ListItemIcon>
									<ListItemText primary='Transfer' />
								</ListItemButton>
								<ListItemButton
									sx={{ pl: 4 }}
									selected={
										`${ROUTE_PREFIX}/projects/${project.name}/metadata` ===
										pathname
									}
									onClick={() =>
										handleClickNavigate(`/projects/${project.name}/metadata`)
									}
								>
									<ListItemIcon>
										<Storage />
									</ListItemIcon>
									<ListItemText primary='Files' />
								</ListItemButton>
								<ListItemButton
									sx={{ pl: 4 }}
									selected={
										`${ROUTE_PREFIX}/projects/${project.name}/datasets` ===
										pathname
									}
									onClick={() =>
										handleClickNavigate(`/projects/${project.name}/datasets`)
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
				<Tooltip title='Project list' showTooltip={showTooltip}>
					<ListItemButton
						selected={`${ROUTE_PREFIX}/projects` === pathname}
						onClick={() => handleClickNavigate('/projects')}
					>
						<ListItemIcon>
							<Apps />
						</ListItemIcon>
						<ListItemText primary='Collaborative projects' />
					</ListItemButton>
				</Tooltip>
			</List>
			<List
				component='nav'
				aria-labelledby='docs-subheader'
			>
				<Tooltip title='Public Datasets' showTooltip={showTooltip}>
					<ListItemButton
						selected={`${ROUTE_PREFIX}/public` === pathname}
						onClick={() => handleClickNavigate('/public')}
					>
						<ListItemIcon>
							<Apps />
						</ListItemIcon>
						<ListItemText primary='Public Datasets' />
					</ListItemButton>
				</Tooltip>
			</List>
			<Divider />
			<List
				sx={{
					marginTop: 'auto',
				}}
				component='nav'
				aria-labelledby='docs-subheader'
			>
				<Divider />
				<ListItemButton
					selected={`${ROUTE_PREFIX}/apps` === pathname}
					onClick={() => handleClickNavigate('/apps')}
				>
					<ListItemIcon>
						<Apps />
					</ListItemIcon>
					<ListItemText primary='App Catalog' />
				</ListItemButton>
				<ListItemButton
					onClick={() => {
						window.location.href = '/call/yizibxg5'
					}}
				>
					<ListItemIcon>
						<Support />
					</ListItemIcon>
					<ListItemText primary='Support' />
				</ListItemButton>
				<ListItemButton onClick={() => setDebug(!debug)}>
					<ListItemIcon>
						<Adb />
					</ListItemIcon>
					<ListItemText primary='Debug' />
					<Switch checked={debug} />
				</ListItemButton>

				<Box height={`${APP_MARGIN_TOP + 24}px}`} />
			</List>

			<Box component='footer' sx={{ ...footerStyle }}>
				<p>Copyright © DIP {new Date().getFullYear()}</p>
			</Box>
		</Drawer>
	)
}

export default Sidebar
