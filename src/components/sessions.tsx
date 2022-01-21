import React from 'react'
import { useAppStore } from '../store/appProvider'
import { useNavigate } from "react-router-dom";
import { ROUTE_PREFIX } from '../constants';
import { Visibility, PowerSettingsNew, Pause, Clear, Replay } from '@mui/icons-material'
import { Typography, Card, CardActions, CardContent, CardMedia, Chip, Box, Button, IconButton, Tooltip } from '@mui/material';
import TitleBar from './titleBar';
import SessionImage from '../assets/session-thumbnail.png'
import {
	Container,
	ContainerType,
	ContainerState,
	createSession,
	removeAppsAndSession,
	pauseAppsAndSession,
	resumeAppsAndSession,
	AppContainer,
	fetchRemote,
	forceRemove,
} from '../api/gatewayClientAPI'

const Sessions = (): JSX.Element => {
	const {
		user: [user],
		containers: [containers, error],
		debug: [debug],
	} = useAppStore()
	const navigate = useNavigate();

	React.useEffect(() => {
		console.log(containers)
	}, [containers])

	const handleOpenSession = (sessionId: string) => {
		navigate(`${ROUTE_PREFIX}/sessions/${sessionId}`)
	}

	const confirmRemove = (event: any, sessionId: string) => {
		// confirmPopup({
		// 	target: event.currentTarget,
		// 	message: 'Permanently remove this session and all its applications?',
		// 	icon: 'pi pi-exclamation-triangle',
		// 	accept: () => removeAppsAndSession(sessionId, user?.uid || ''),
		// })
	}

	const sessions = containers
		?.filter((container: Container) => container.type === ContainerType.SESSION)
		.map((s: Container) => ({
			...s,
			apps: (containers as AppContainer[]).filter(a => a.parentId === s.id),
		}))

	return (
		<>
			<TitleBar
				title={'My Sessions'}
				description={'Sessions are remote virtual computers on secure infrastructure where you can launch apps on your data.'}
				button={<Button variant="text" color="info" onClick={() => createSession(user?.uid || '')}>Create session</Button>}
			/>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{sessions?.map((session, i) =>
					<Card sx={{ maxWidth: 320 }} key={session.name}>
						<CardMedia
							component="img"
							height="140"
							src={SessionImage}
							alt={session.name}

						/>
						<CardContent>
							<Box sx={{ display: 'flex' }}>
								<Box sx={{ flex: 1 }}>
									<Typography variant="h5">
										{`Session #${session?.name}`}
									</Typography>
									<Typography gutterBottom variant="caption" color="text.secondary">
										{session?.user}
									</Typography>
								</Box>
								<Chip label={session.state} color={session.state === ContainerState.RUNNING ? "success" : "error"} variant="outlined" />
							</Box>

							<Typography sx={{ mt: 2 }} gutterBottom variant="body2" color="text.secondary">
								<p>{session.error?.message}</p>
								{session.apps.map(app => (
									<div key={app.id}>
										<p>
											<strong>{app.app}</strong>: {app.state}
										</p>
										<p>{app.error?.message}</p>
									</div>
								))}
							</Typography>
						</CardContent>
						<CardActions sx={{ justifyContent: 'end', pr: 2 }}>
							{debug && (
								<Tooltip title="Force remove" placement="top">
									<IconButton edge="end" color="info" aria-label="force remove" onClick={(e: any) => forceRemove(session.id)}>
										<Clear />
									</IconButton>
								</Tooltip>
							)}

							<Tooltip title="Shut down" placement="top">
								<IconButton edge="end" color="info" aria-label="Shut down" onClick={(e: any) => confirmRemove(e, session.id)}>
									<PowerSettingsNew />
								</IconButton>
							</Tooltip>

							{session.state === ContainerState.PAUSED &&
								<Tooltip title="Resume the session" placement="top">
									<IconButton edge="end" color="info" aria-label="Resume" onClick={(e: any) => resumeAppsAndSession(session.id, user?.uid || '')}>
										<Replay />
									</IconButton>
								</Tooltip>
							}

							{session.state !== ContainerState.PAUSED &&
								<Tooltip title="Pause the session. You can resume it later" placement="top">
									<IconButton edge="end" color="info" aria-label="pause" onClick={(e: any) => pauseAppsAndSession(session.id, user?.uid || '')}>
										<Pause />
									</IconButton>
								</Tooltip>
							}

							<Tooltip title="Open" placement="top">
								<IconButton sx={{ ml: 0.6 }} edge="end" color="info" aria-label="Open" onClick={(e: any) => handleOpenSession(session.id)} disabled={session.state !== ContainerState.RUNNING}>
									<Visibility />
								</IconButton>
							</Tooltip>
						</CardActions>
					</Card>
				)}
			</Box>
		</>
	)
}

export default Sessions
