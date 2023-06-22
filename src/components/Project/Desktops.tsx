import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, Button, CircularProgress } from '@mui/material'
import React, { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
	createDesktop,
	forceRemoveAppsAndDesktop,
	getDesktopsAndApps,
	pauseAppsAndDesktop,
	removeAppsAndDesktop,
	resumeAppsAndDesktop,
} from '../../api/remoteApp'
import { Container, ContainerType } from '../../api/types'
import { POLLING, ROUTE_PREFIX } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import DesktopCard from '../UI/DesktopCard'
import DesktopCardButton from '../UI/DesktopCardButton'
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
		debug: [debug],
		userProjects: [projects],
		projectContainers: [containers, setContainers],
	} = useAppStore()
	const modalRef = useRef<ModalComponentHandle>(null)

	const getDesktops = useCallback(
		(userId: string, projectName: string) =>
			getDesktopsAndApps('collab', userId, [projectName], false)
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error')),
		[setContainers, showNotif]
	)

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
	}, [user, params.projectId, getDesktops])

	const handleOpenDesktop = (desktopId: string) => {
		navigate(`${ROUTE_PREFIX}/desktops/${desktopId}`, {
			state: {
				from: location.pathname,
				workspace: 'collab',
				trackingName: `project/${project?.name}`,
				groupIds: [project?.name],
			},
		})
		trackEvent({
			category: 'Desktop',
			action: 'Use a desktop',
			name: `project/${project?.name}`,
		})
	}

	const handleRemoveDesktop = async (desktopId: string, force = false) => {
		if (force) {
			const containers = await forceRemoveAppsAndDesktop(desktopId)
			setContainers(containers)
			trackEvent({
				category: 'Desktop',
				action: 'Stop a desktop',
				name: `project/${project?.name}`,
			})

			return
		}

		if (!modalRef.current) return
		const reply = await modalRef.current.open(
			'Quit desktop ?',
			'Quit this desktop and all its applications?'
		)

		if (reply) {
			removeAppsAndDesktop(desktopId, user?.uid || '')
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error'))

			trackEvent({
				category: 'Desktop',
				action: 'Stop a desktop',
				name: `project/${project?.name}`,
			})
		}
	}

	const handlePauseDesktop = async (desktopId: string) => {
		const containers = await pauseAppsAndDesktop(desktopId, user?.uid || '')
		setContainers(containers)
		trackEvent({
			category: 'Desktop',
			action: 'Pause a desktop',
			name: `project/${project?.name}`,
		})
	}
	const handleResumeDesktop = async (desktopId: string) => {
		const containers = await resumeAppsAndDesktop(desktopId, user?.uid || '')
		setContainers(containers)
		trackEvent({
			category: 'Desktop',
			action: 'Resume a desktop',
			name: `project/${project?.name}`,
		})
	}

	const createNewDesktop = async () => {
		if (project?.name) {
			createDesktop('collab', user?.uid || '', [project.name])
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error'))

			trackEvent({
				category: 'Desktop',
				action: 'Create a desktop',
				name: `project/${project?.name}`,
			})
		}
	}

	const project = projects?.find(project => project.name === params?.projectId)

	const desktops = containers
		?.filter((container: Container) => container.type === ContainerType.DESKTOP)
		?.filter((container: Container) =>
			container.groupIds?.some(groupId => groupId === params.projectId)
		)
		.map((s: Container) => ({
			...s,
			apps: containers.filter(a => a.parentId === s.id),
		}))

	return (
		<>
			<Modal ref={modalRef} />
			<TitleBar
				title={`Desktops: ${project?.title || ''} `}
				description={
					'Desktops are shared accross members and can be used to run applications on projects data.'
				}
				button={
					<Button
						variant='contained'
						color='primary'
						onClick={() => {
							createNewDesktop()
							trackEvent({
								category: 'Desktop',
								action: 'Start a desktop',
								name: `project/${project?.name}`,
							})
						}}
					>
						Create Desktop
					</Button>
				}
			/>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{!containers && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}
				<Box
					sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}
				>
					{desktops?.length === 0 && (
						<DesktopCardButton createNewDesktop={createNewDesktop} />
					)}
					{desktops?.map(
						(desktop, i) =>
							desktop && (
								<DesktopCard
									key={desktop.id}
									desktop={desktop}
									handleOpenDesktop={handleOpenDesktop}
									handleRemoveDesktop={handleRemoveDesktop}
									handlePauseDesktop={handlePauseDesktop}
									handleResumeDesktop={handleResumeDesktop}
									debug={debug}
								/>
							)
					)}
				</Box>
			</Box>
		</>
	)
}

ProjectDesktops.displayName = 'ProjectDesktops'
export default ProjectDesktops
