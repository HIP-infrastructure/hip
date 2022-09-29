import {
	Clear,
	Pause,
	PowerSettingsNew,
	Replay,
	Visibility,
} from '@mui/icons-material'
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	createSession,
	forceRemove,
	pauseAppsAndSession,
	removeAppsAndSession,
	resumeAppsAndSession,
} from '../api/gatewayClientAPI'
import {
	AppContainer,
	Container,
	ContainerState,
	ContainerType,
} from '../api/types'
import { color, loading } from '../api/utils'
import SessionImage from '../assets/session-thumbnail.png'
import { ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import Modal, { ModalComponentHandle } from './UI/Modal'
import TitleBar from './UI/titleBar'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

const Sessions = (): JSX.Element => {
	const {
		user: [user],
		containers: [containers],
		debug: [debug],
	} = useAppStore()
	const { trackEvent } = useMatomo()

	const modalRef = useRef<ModalComponentHandle>(null)
	const navigate = useNavigate()

	const handleOpenSession = (sessionId: string) => {
		navigate(`${ROUTE_PREFIX}/sessions/${sessionId}`)
		trackEvent({
			category: 'server',
			action: 'view',
		})
	}

	const confirmRemove = async (sessionId: string) => {
		if (!modalRef.current) return

		const reply = await modalRef.current.open(
			'Remove desktop ?',
			'Permanently remove this desktop and all its applications?'
		)

		if (reply) {
			removeAppsAndSession(sessionId, user?.uid || '')

			trackEvent({
				category: 'server',
				action: 'stop',
			})
		}
	}

	const sessions = containers
		?.filter((container: Container) => container.type === ContainerType.SESSION)
		.map((s: Container) => ({
			...s,
			apps: (containers as AppContainer[]).filter(a => a.parentId === s.id),
		}))

	return (
		<>
			<Modal ref={modalRef} />
			<TitleBar
				title={'My Desktops'}
				description={
					'Desktops are remote virtual computers running on a secure infrastructure where you can launch apps on your data.'
				}
				button={
					<Button
						variant='contained'
						color='primary'
						onClick={() => {
							createSession(user?.uid || '')
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

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{!containers && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}

				{sessions?.length === 0 && (
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
							onClick={() => createSession(user?.uid || '')}
						>
							Create Desktop
						</Button>
					</Box>
				)}
				{sessions?.map((session, i) => (
					<Card
						sx={{ maxWidth: 320, display: 'flex', flexDirection: 'column' }}
						key={session.name}
					>
						<Box sx={{ position: 'relative' }}>
							<Tooltip
								title={`Open Desktop #${session.name}`}
								placement='bottom'
							>
								<CardMedia
									sx={{
										cursor:
											session.state !== ContainerState.RUNNING
												? 'default'
												: 'pointer',
									}}
									component='img'
									height='140'
									src={SessionImage}
									alt={`Open ${session.name}`}
									onClick={() =>
										session.state === ContainerState.RUNNING &&
										handleOpenSession(session.id)
									}
								/>
							</Tooltip>
							{[
								loading(session.state),
								...session.apps.map(a => loading(a.state)),
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
										{`Desktop #${session?.name}`}
									</Typography>
									<Typography
										gutterBottom
										variant='caption'
										color='text.secondary'
									>
										{session?.user}
									</Typography>
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
												{session.state}
											</Box>
										}
										color={color(session.state)}
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
								{session.error?.message}
								{session.apps.map(app => (
									<span key={app.name}>
										<strong>{app.app}</strong>: {app.state}
										<br />
										{app.error?.message}
									</span>
								))}
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: 'end', pr: 2 }}>
							{debug && (
								<Tooltip title='Force remove' placement='top'>
									<IconButton
										edge='end'
										color='primary'
										aria-label='force remove'
										onClick={() => forceRemove(session.id)}
									>
										<Clear />
									</IconButton>
								</Tooltip>
							)}

							<Tooltip title='Shut down' placement='top'>
								<IconButton
									disabled={session.state !== ContainerState.RUNNING}
									edge='end'
									color='primary'
									aria-label='Shut down'
									onClick={() => {
										confirmRemove(session.id)
									}}
								>
									<PowerSettingsNew />
								</IconButton>
							</Tooltip>

							{session.state === ContainerState.PAUSED && (
								<Tooltip title='Resume the session' placement='top'>
									<IconButton
										edge='end'
										color='primary'
										aria-label='Resume'
										onClick={y => {
											resumeAppsAndSession(session.id, user?.uid || '')

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

							{session.state !== ContainerState.PAUSED && (
								<Tooltip
									title='Pause the session. You can resume it later'
									placement='top'
								>
									<IconButton
										disabled={session.state !== ContainerState.RUNNING}
										edge='end'
										color='primary'
										aria-label='pause'
										onClick={() => {
											pauseAppsAndSession(session.id, user?.uid || '')
											trackEvent({
												category: 'server',
												action: 'pause',
											})
										}}
									>
										<Pause />
									</IconButton>
								</Tooltip>
							)}

							<Tooltip title='Open' placement='top'>
								<IconButton
									disabled={session.state !== ContainerState.RUNNING}
									sx={{ ml: 0.6 }}
									edge='end'
									color='primary'
									aria-label='Open'
									onClick={() => {
										handleOpenSession(session.id)
									}}
								>
									<Visibility />
								</IconButton>
							</Tooltip>
						</CardActions>
					</Card>
				))}
			</Box>
		</>
	)
}

Sessions.displayName = 'Sessions'
export default Sessions
