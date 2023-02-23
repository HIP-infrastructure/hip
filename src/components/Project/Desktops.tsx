import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Box,
	Button,
	CircularProgress,
	FormControlLabel,
	Switch,
	Typography,
} from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
	createDesktop,
	getDesktopsAndApps,
	removeAppsAndDesktop,
} from '../../api/remoteApp'
import { Container, ContainerType } from '../../api/types'
import { POLLING, ROUTE_PREFIX } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import DesktopCard from '../UI/DesktopCard'
import Modal, { ModalComponentHandle } from '../UI/Modal'
import TitleBar from '../UI/titleBar'

const ProjectDesktops = (): JSX.Element => {
	const navigate = useNavigate()
	const location = useLocation()
	const params = useParams()
	const { trackEvent } = useMatomo()
	const { showNotif } = useNotification()
	const {
		user: [user],
		debug: [debug, setDebug],
		userProjects: [userProjects],
		projectContainers: [containers, setContainers],
	} = useAppStore()
	const modalRef = useRef<ModalComponentHandle>(null)

	const getDesktops = (userId: string, projectName: string) =>
		getDesktopsAndApps('collab', userId, [projectName], false)
			.then(data => setContainers(data))
			.catch(error => showNotif(error, 'error'))

	useEffect(() => {
		const userId = user?.uid
		if (!userId) return

		const projectName = params.projectId
		if (!projectName) return

		getDesktops(userId, projectName)
		const interval = setInterval(() => {
			getDesktops(userId, projectName)
		}, POLLING * 1000)

		return () => clearInterval(interval)
	}, [user, params.projectId])

	const handleOpenDesktop = (desktopId: string) => {
		navigate(`${ROUTE_PREFIX}/desktops/${desktopId}`, {
			state: {
				from: location.pathname,
				workspace: 'collab',
				groupIds: [project?.name],
			},
		})
		trackEvent({
			category: 'server',
			action: 'view',
		})
	}

	const confirmRemove = async (desktopId: string) => {
		if (!modalRef.current) return

		const reply = await modalRef.current.open(
			'Remove desktop ?',
			'Permanently remove this desktop and all its applications?'
		)

		if (reply) {
			removeAppsAndDesktop(desktopId, user?.uid || '')
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error'))

			trackEvent({
				category: 'server',
				action: 'stop',
			})
		}
	}

	const createNewDesktop = async () => {
		if (project?.name)
			createDesktop('collab', user?.uid || '', [project.name])
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error'))
	}

	const project = userProjects?.find(
		project => project.name === params?.projectId
	)

	
	const desktops = containers
		?.filter((container: Container) => container.type === ContainerType.DESKTOP)
		?.filter((container: Container) =>
			container.groupIds?.some(
				groupId => groupId.replace('group-', '') === params.projectId
			)
		)
		.map((s: Container) => ({
			...s,
			apps: containers.filter(a => a.parentId === s.id),
		}))

	return (
		<>
			<Modal ref={modalRef} />

			<Box sx={{ mb: 2 }}>
				<TitleBar
					title={`Collaborative Workspace: ${project?.title || ''} `}
					description={project?.description}
					button={
						<Button
							variant='contained'
							color='primary'
							onClick={() => {
								createNewDesktop()
								trackEvent({
									category: 'server',
									action: 'start',
								})
							}}
						>
							Create Desktop
						</Button>
					}
				/>
			</Box>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{!containers && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}

				{desktops?.length === 0 && (
					<Box sx={{ mt: 4 }}>
						<Typography variant='subtitle1' gutterBottom>
							There is no desktop to show
						</Typography>
						<Button
							variant='contained'
							color='primary'
							onClick={createNewDesktop}
						>
							Create Desktop
						</Button>
					</Box>
				)}
				{desktops?.map(
					(desktop, i) =>
						desktop && (
							<DesktopCard
								key={desktop.id}
								userId={user?.uid || ''}
								desktop={desktop}
								handleOpenDesktop={handleOpenDesktop}
								confirmRemove={confirmRemove}
								debug={debug}
								trackEvent={trackEvent}
							/>
						)
				)}
			</Box>
			<Box sx={{ ml: 2, mt: 8 }}>
				<FormControlLabel
					control={<Switch checked={debug} onChange={() => setDebug(!debug)} />}
					label='Debug'
				/>
			</Box>
		</>
	)
}

ProjectDesktops.displayName = 'ProjectDesktops'
export default ProjectDesktops
