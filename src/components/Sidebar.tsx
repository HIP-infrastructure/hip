import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	AccountTree,
	Assignment,
	ChevronRight,
	Dashboard,
	ExpandLess,
	ExpandMore,
	Folder,
	Monitor,
	Apps,
	Create,
} from '@mui/icons-material'
import {
	Avatar,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	ListItem,
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
import { APP_MARGIN_TOP, ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import { getUserProjects } from '../api/projects'
import { HIPProject } from '../api/types'

const defaultCenters = [{ label: 'WORKSPACE', id: null, logo: null }]

const Sidebar = () => {
	const navigate = useNavigate()
	const { trackPageView } = useMatomo()

	const {
		user: [user],
		hIPCenters: [centers],
	} = useAppStore()

	const [openProjects, setOpenProjects] = React.useState<{
		[key: string]: boolean
	}>({})
	const [projects, setProjects] = React.useState<HIPProject[]>([])

	React.useEffect(() => {
		if (!user?.uid) return
		getUserProjects(user?.uid).then(projects => {
			setProjects(projects)
		})
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

	const userProjects = projects

	return (
		<Drawer
			variant='permanent'
			sx={{
				'& .MuiDrawer-paper': {
					boxSizing: 'border-box',
					top: `${APP_MARGIN_TOP}px`,
				},
				'& .Mui-selected': {
					color: 'white',
					backgroundColor: '#37474f !important',
				},
				display: 'flex',
				flexDirection: 'column',
				flexFlow: 'row wrap',
				justifyContent: 'start',
			}}
		>
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
									{center.label} Center
								</ListSubheader>
								{userCenters ? (
									<Avatar
										alt={center.label}
										src={`${process.env.REACT_APP_GATEWAY_API}/public/${center?.logo}`}
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
							<ListItemText primary='Dashboard' />
						</ListItemButton>
						<ListItemButton
							sx={{ pl: 4 }}
							onClick={() =>
								handleClickNavigate(`/private/${center.id}/sessions`)
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
				<ListItemButton onClick={() => handleClickNavigate('/private/centers')}>
					<ListItemIcon>
						<Apps />
					</ListItemIcon>
					<ListItemText primary='All Centers' />
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
				<ListItemButton
					sx={{ pl: 4 }}
					onClick={() => handleClickNavigate(`/collaborative-projects/create`)}
				>
					<ListItemIcon>
						<Create />
					</ListItemIcon>
					<ListItemText primary='Create new project' />
				</ListItemButton>
				{userProjects?.map(project => (
					<Box key={project.id}>
						<ListItemButton
							onClick={() => handleClick(project?.id)}
							sx={{ pl: 4 }}
						>
							<ListItemIcon>
								<Folder />
							</ListItemIcon>
							<ListItemText primary={`${project.name}`} />
							{openProjects[project.id] ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>
						<Collapse
							in={openProjects[project.id]}
							timeout='auto'
							unmountOnExit
						>
							<List component='div' disablePadding>
								<ListItemButton
									sx={{ pl: 8 }}
									onClick={() =>
										handleClickNavigate(`/collaborative-projects/${project.id}`)
									}
								>
									<ListItemIcon>
										<Dashboard />
									</ListItemIcon>
									<ListItemText primary='Dashboard' />
								</ListItemButton>
								<ListItemButton
									sx={{ pl: 8 }}
									onClick={() =>
										handleClickNavigate(
											`/collaborative-projects/${project.id}/sessions`
										)
									}
								>
									<ListItemIcon>
										<Monitor />
									</ListItemIcon>
									<ListItemText primary='Desktops' />
								</ListItemButton>
								<ListItemButton
									sx={{ pl: 8 }}
									onClick={() =>
										handleClickNavigate(
											`/collaborative-projects/${project.id}/datasets/`
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
					</Box>
				))}
			</List>
			<Divider />
			<List>
				<ListItemButton
					onClick={() => handleClickNavigate('/collaborative-projects')}
				>
					<ListItemIcon>
						<Apps />
					</ListItemIcon>
					<ListItemText primary='All Projects' />
				</ListItemButton>
			</List>
			<Divider />
			<List
				sx={{
					marginTop: 'auto',
				}}
				component='nav'
				aria-labelledby='docs-subheader'
			>
				<ListItemButton sx={{ pl: 4 }} onClick={() => handleClickNavigate('/')}>
					<ListItemIcon>
						<Dashboard />
					</ListItemIcon>
					<ListItemText primary='About' />
				</ListItemButton>
				<ListItemButton
					sx={{ pl: 4 }}
					onClick={() => handleClickNavigate('/apps')}
				>
					<ListItemIcon>
						<Dashboard />
					</ListItemIcon>
					<ListItemText primary='App Catalog' />
				</ListItemButton>
				<ListItemButton
					sx={{ pl: 4 }}
					onClick={() => handleClickNavigate('/documentation')}
				>
					<ListItemIcon>
						<Monitor />
					</ListItemIcon>
					<ListItemText primary='Documentation' />
				</ListItemButton>
				<ListItemButton
					sx={{ pl: 4 }}
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
					sx={{ pl: 4 }}
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
