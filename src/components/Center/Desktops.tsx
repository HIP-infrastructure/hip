import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Box,
	Button,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Switch
} from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
	createDesktop, forceRemoveAppsAndDesktop, getDesktopsAndApps, pauseAppsAndDesktop, removeAppsAndDesktop, resumeAppsAndDesktop
} from '../../api/remoteApp'
import { Container, ContainerType } from '../../api/types'
import { POLLING, ROUTE_PREFIX } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import DesktopCard from '../UI/DesktopCard'
import DesktopCardButton from '../UI/DesktopCardButton'
import Modal, { ModalComponentHandle } from '../UI/Modal'
import TitleBar from '../UI/titleBar'

const CenterDesktops = (): JSX.Element => {
	const params = useParams()
	const navigate = useNavigate()
	const location = useLocation()
	const { trackEvent } = useMatomo()
	const { showNotif } = useNotification()
	const {
		user: [user],
		containers: [containers, setContainers],
		debug: [debug],
	} = useAppStore()

	const keyStorage = `show-admin-view${user?.uid}`
	const [showAdminView, setShowAdminView] = React.useState(
		localStorage.getItem(keyStorage) === 'true'
	)
	const modalRef = useRef<ModalComponentHandle>(null)

	const getDesktops = (userId: string, showAdmin = false) =>
		getDesktopsAndApps('private', userId, [], showAdmin)
			.then(data => setContainers(data))
			.catch(error => showNotif(error, 'error'))

	useEffect(() => {
		const userId = user?.uid
		if (!userId) return

		getDesktops(userId, showAdminView)
		const interval = setInterval(() => {
			getDesktops(userId, showAdminView)
		}, POLLING * 1000)

		return () => clearInterval(interval)
	}, [setContainers, user, showAdminView])

	const handleOpenDesktop = (desktopId: string) => {
		navigate(`${ROUTE_PREFIX}/desktops/${desktopId}`, {
			state: { from: location.pathname, workspace: 'private', showAdminView },
		})
		trackEvent({
			category: 'Desktop',
			action: 'Use a desktop',
			name: `center/${params.centerId}`,
		})
	}

	const handleRemoveDesktop = async (desktopId: string, force = false) => {
		if (force) {
			forceRemoveAppsAndDesktop(desktopId)
			trackEvent({
				category: 'Desktop',
				action: 'Stop a desktop',
				name: `center/${params.centerId}`,
			})

			return
		}

		if (!modalRef.current) return
		const reply = await modalRef.current.open(
			'Remove desktop ?',
			'Permanently remove this desktop and all its applications?'
		)

		if (reply) {
			removeAppsAndDesktop(desktopId, user?.uid || '')
				.then(data => !showAdminView && setContainers(data))
				.catch(error => showNotif(error, 'error'))

			trackEvent({
				category: 'Desktop',
				action: 'Stop a desktop',
				name: `center/${params.centerId}`,
			})
		}
	}

	const handlePauseDesktop = async (desktopId: string) => {
		pauseAppsAndDesktop(desktopId, user?.uid || '')
		trackEvent({
			category: 'Desktop',
			action: 'Pause a desktop',
			name: `center/${params.centerId}`,
		})
	}
	const handleResumeDesktop = async (desktopId: string) => {
		resumeAppsAndDesktop(desktopId, user?.uid || '')
		trackEvent({
			category: 'Desktop',
			action: 'Resume a desktop',
			name: `center/${params.centerId}`,
		})
	}

	const createNewDesktop = async () => {
		createDesktop('private', user?.uid || '', [])
			.then(data => setContainers(data))
			.catch(error => showNotif(error, 'error'))
	}

	trackEvent({
		category: 'Desktop',
		action: 'Create a desktop',
		name: `center/${params.centerId}`,
	})

	const desktops: Container[] | undefined = containers
		?.filter((container: Container) => container.type === ContainerType.DESKTOP)
		.map((s: Container) => ({
			...s,
			apps: containers.filter(a => a.parentId === s.id),
		}))
		?.filter((s: Container) =>
			user && showAdminView ? true : s.userId === user?.uid
		)

	return (
		<>
			<Modal ref={modalRef} />
			<TitleBar
				title={'My Desktops'}
				description={
					'Desktops are remote virtual computers running on a secure infrastructure where you can launch apps on your data.'
				}
				button={
					<Box sx={{ display: 'flex' }}>
						{user?.isAdmin && (
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											checked={showAdminView}
											onChange={() => {
												localStorage.setItem(keyStorage, String(!showAdminView))
												setShowAdminView(!showAdminView)
											}}
										/>
									}
									label='Admin view'
								/>
							</FormGroup>
						)}
						<Button
							variant='contained'
							color='primary'
							onClick={() => {
								createNewDesktop()
								trackEvent({
									category: 'Desktop',
									action: 'Start a new desktop',
									name: `center/${params.centerId}`,
								})
							}}
						>
							Create Desktop
						</Button>
					</Box>
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
		</>
	)
}

CenterDesktops.displayName = 'CenterDesktops'
export default CenterDesktops
