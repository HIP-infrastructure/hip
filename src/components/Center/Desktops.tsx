import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Box,
	Button,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Switch,
	Typography,
} from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	createDesktop,
	getDesktopsAndApps,
	removeAppsAndDesktop,
} from '../../api/remoteApp'
import { AppContainer, Container, ContainerType } from '../../api/types'
import { POLLING, ROUTE_PREFIX } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import DesktopCard from '../UI/DesktopCard'
import Modal, { ModalComponentHandle } from '../UI/Modal'
import TitleBar from '../UI/titleBar'

const Desktops = (): JSX.Element => {
	const navigate = useNavigate()
	const location = useLocation()
	const { trackEvent } = useMatomo()
	const { showNotif } = useNotification()
	const {
		user: [user],
		containers: [containers, setContainers],
		debug: [debug, setDebug],
	} = useAppStore()

	const [showAdminView, setShowAdminView] = React.useState(
		localStorage.getItem('admin-view') === 'true'
	)
	const modalRef = useRef<ModalComponentHandle>(null)

	useEffect(() => {
		const userId = user?.uid
		if (!userId) return

		const interval = setInterval(() => {
			getDesktopsAndApps('private', userId, [], showAdminView || false)
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error'))
		}, POLLING * 1000)

		return () => clearInterval(interval)
	}, [setContainers, user])

	const handleOpenDesktop = (desktopId: string) => {
		navigate(`${ROUTE_PREFIX}/desktops/${desktopId}`, {
			state: { from: location.pathname, workspace: 'private', showAdminView },
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
		createDesktop('private', user?.uid || '', [])
			.then(data => setContainers(data))
			.catch(error => showNotif(error, 'error'))
	}

	const desktops: Container[] | undefined = containers
		?.filter((container: Container) => container.type === ContainerType.DESKTOP)
		.map((s: Container) => ({
			...s,
			apps: (containers as AppContainer[]).filter(a => a.parentId === s.id),
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
												localStorage.setItem(
													'admin-view',
													String(!showAdminView)
												)
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
									category: 'server',
									action: 'start',
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
					<Box
						sx={{
							mt: 4,
						}}
					>
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

Desktops.displayName = 'Desktops'
export default Desktops
