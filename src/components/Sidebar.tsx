import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	AccountTree,
	Assignment,
	Dashboard,
	ExpandLess,
	ExpandMore,
	Folder,
	Monitor,
	Apps,
} from '@mui/icons-material'
import { Avatar, CircularProgress, Divider, Drawer } from '@mui/material'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { APP_MARGIN_TOP, DRAWER_WIDTH, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../Store'
import { getUserProjects } from '../api/projects'
import { API_GATEWAY } from '../api/gatewayClientAPI';

const defaultCenters = [{ label: 'WORKSPACE', id: null, logo: null }]

const Sidebar = () => {
	const navigate = useNavigate()
	const { trackPageView } = useMatomo()

	const {
		user: [user],
		centers: [centers],
		userProjects: [userProjects, setUserProjects],
	} = useAppStore()

	const [openProjects, setOpenProjects] = React.useState<{
		[key: string]: boolean
	}>({})

	React.useEffect(() => {
		if (!user?.uid) return
		getUserProjects(user?.uid).then(projects => {
			setUserProjects(projects)
		})
	}, [user])

	const handleClick = (projectId: string) => {
		setOpenProjects(op => ({ ...op, [projectId]: !op[projectId] ?? false }))
	}

	const handleClickNavigate = (route: string) => {
		trackPageView({ documentTitle: route })
		navigate(`${ROUTE_PREFIX}${route}`)
	}

	// FIXME: if there is no center
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
				<ListItemButton onClick={() => handleClickNavigate('/private')}>
					<ListItemIcon>
						<Apps />
					</ListItemIcon>
					<ListItemText primary='CENTERS' />
				</ListItemButton>
			</List>
			<Divider />
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
							onClick={() => handleClickNavigate(`/private/${center?.id}`)}
						>
							<ListItemIcon>
								<Dashboard />
							</ListItemIcon>
							<ListItemText primary='Private Workspace' />
						</ListItemButton>
						<ListItemButton
							sx={{ pl: 4 }}
							onClick={() =>
								handleClickNavigate(`/private/${center.id}/desktops`)
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
								handleClickNavigate(`/private/${center.id}/datasets`)
							}
						>
							<ListItemIcon>
								<Assignment />
							</ListItemIcon>
							<ListItemText primary='BIDS Datasets' />
						</ListItemButton>
						<ListItemButton
							sx={{ pl: 4 }}
							disabled={!userCenters}
							onClick={() => handleClickNavigate(`/private/${center.id}/data`)}
						>
							<ListItemIcon>
								<AccountTree />
							</ListItemIcon>
							<ListItemText primary='Data' />
						</ListItemButton>
					</List>
					<Divider />
				</Box>
			))}
			<List>
				<ListItemButton onClick={() => handleClickNavigate('/collaborative')}>
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
							mr: 2,
							justifyContent: 'space-between',
						}}
					>
						<ListSubheader id='my-projects-subheader'>
							My Projects
						</ListSubheader>
						{!userProjects && <CircularProgress size={18} color='secondary' />}
					</Box>
				}
			>
				{userProjects?.map(project => (
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
										handleClickNavigate(`/collaborative/${project.name}`)
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
											`/collaborative/${project.name}/desktops`
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
											`/collaborative/${project.name}/datasets/`
										)
									}
								>
									<ListItemIcon>
										<Assignment />
									</ListItemIcon>
									<ListItemText primary='BIDS Datasets' />
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
				<ListItemButton onClick={() => handleClickNavigate('/')}>
					<ListItemIcon>
						<Dashboard />
					</ListItemIcon>
					<ListItemText primary='About' />
				</ListItemButton>
				<ListItemButton onClick={() => handleClickNavigate('/apps')}>
					<ListItemIcon>
						<Dashboard />
					</ListItemIcon>
					<ListItemText primary='App Catalog' />
				</ListItemButton>
				<ListItemButton onClick={() => handleClickNavigate('/documentation')}>
					<ListItemIcon>
						<Monitor />
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
						<Assignment />
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
						<Assignment />
					</ListItemIcon>
					<ListItemText primary='Feedback' />
				</ListItemButton>
				<Box height={`${APP_MARGIN_TOP}px}`} />
			</List>
		</Drawer>
	)
}

export default Sidebar
