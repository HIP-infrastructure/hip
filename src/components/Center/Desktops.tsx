import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Clear,
	Pause,
	PowerSettingsNew,
	Replay,
	Visibility,
} from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	IconButton,
	Switch,
	Tooltip,
	Typography,
} from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
	createDesktop,
	getDesktopsAndApps,
	removeAppsAndDesktop,
	pauseAppsAndDesktop,
	resumeAppsAndDesktop,
	forceRemoveAppsAndDesktop,
} from '../../api/remoteApp'
import {
	AppContainer,
	Container,
	ContainerState,
	ContainerType,
} from '../../api/types'
import { color, loading } from '../../api/utils'
import DesktopImage from '../../assets/session-thumbnail.png'
import { POLLING, ROUTE_PREFIX } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
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

	const desktops = containers
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
				{desktops?.map((desktop, i) => (
					<Card
						sx={{
							maxWidth: 320,
							display: 'flex',
							flexDirection: 'column',
						}}
						key={desktop.id}
					>
						<Box sx={{ position: 'relative' }}>
							<Tooltip
								title={`Open Desktop #${desktop.name}`}
								placement='bottom'
							>
								<CardMedia
									sx={{
										cursor:
											desktop.state !== ContainerState.RUNNING
												? 'default'
												: 'pointer',
									}}
									component='img'
									height='140'
									src={DesktopImage}
									alt={`Open ${desktop.name}`}
									onClick={() =>
										desktop.state === ContainerState.RUNNING &&
										handleOpenDesktop(desktop.id)
									}
								/>
							</Tooltip>
							{[
								loading(desktop.state),
								...desktop.apps.map(a => loading(a.state)),
							].reduce((p, c) => p || c, false) && (
								<CircularProgress
									size={32}
									color='secondary'
									sx={{ position: 'absolute', top: 10, left: 10 }}
								/>
							)}
						</Box>
						<CardContent sx={{ flexGrow: 1 }}>
							<Box sx={{ display: 'flex' }}>
								<Box sx={{ flex: 1 }}>
									<Typography variant='h5'>
										{`Desktop #${desktop?.name}`}
									</Typography>
									{user?.uid !== desktop.userId && (
										<Typography gutterBottom variant='caption' color='#FA6812'>
											{desktop?.userId}
										</Typography>
									)}
									{user?.uid === desktop.userId && (
										<Typography
											gutterBottom
											variant='caption'
											color='text.secondary'
										>
											{desktop?.userId}
										</Typography>
									)}
								</Box>
								<Box>
									<Chip
										label={
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
												}}
											>
												{desktop.state === ContainerState.DESTROYED ? 'Down' : desktop.state}
											</Box>
										}
										color={color(desktop.state)}
										variant='outlined'
									/>
								</Box>
							</Box>

							<Typography
								sx={{ mt: 2 }}
								gutterBottom
								variant='body2'
								color='text.secondary'
							>
								{desktop.error?.message}
								{desktop.apps.map(app => (
									<span key={app.name}>
										<strong>{app.app}</strong>: {app.state}
										<br />
										{app.error?.message}
									</span>
								))}
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: 'end', pr: 2 }}>
							{(desktop.state === ContainerState.DESTROYED || debug) && (
								<Tooltip title='Remove' placement='top'>
									<IconButton
										edge='end'
										color='primary'
										aria-label='Remove'
										onClick={() => {
											forceRemoveAppsAndDesktop(desktop.id)
										}}
									>
										<Clear />
									</IconButton>
								</Tooltip>
							)}

							<Tooltip title='Shut down' placement='top'>
								<span>
									<IconButton
										disabled={desktop.state !== ContainerState.RUNNING}
										edge='end'
										color='primary'
										aria-label='Shut down'
										onClick={() => {
											confirmRemove(desktop.id)
										}}
									>
										<PowerSettingsNew />
									</IconButton>
								</span>
							</Tooltip>

							{desktop.state === ContainerState.PAUSED && (
								<Tooltip title='Resume the desktop' placement='top'>
									<IconButton
										edge='end'
										color='primary'
										aria-label='Resume'
										onClick={y => {
											resumeAppsAndDesktop(desktop.id, user?.uid || '')

											trackEvent({
												category: 'server',
												action: 'resume',
											})
										}}
									>
										<Replay />
									</IconButton>
								</Tooltip>
							)}

							{desktop.state !== ContainerState.PAUSED && (
								<Tooltip
									title='Pause the desktop. You can resume it later'
									placement='top'
								>
									<span>
										<IconButton
											disabled={desktop.state !== ContainerState.RUNNING}
											edge='end'
											color='primary'
											aria-label='pause'
											onClick={() => {
												pauseAppsAndDesktop(desktop.id, user?.uid || '')
												trackEvent({
													category: 'server',
													action: 'pause',
												})
											}}
										>
											<Pause />
										</IconButton>
									</span>
								</Tooltip>
							)}

							<Tooltip title='Open' placement='top'>
								<span>
									<IconButton
										disabled={desktop.state !== ContainerState.RUNNING}
										sx={{ ml: 0.6 }}
										edge='end'
										color='primary'
										aria-label='Open'
										onClick={() => {
											handleOpenDesktop(desktop.id)
										}}
									>
										<Visibility />
									</IconButton>
								</span>
							</Tooltip>
						</CardActions>
					</Card>
				))}
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
