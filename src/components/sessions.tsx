import { Clear, Pause, PowerSettingsNew, Replay, Visibility } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import {
	AppContainer, Container, ContainerState, ContainerType, createSession, forceRemove, pauseAppsAndSession, removeAppsAndSession, resumeAppsAndSession
} from '../api/gatewayClientAPI';
import SessionImage from '../assets/session-thumbnail.png';
import { ROUTE_PREFIX } from '../constants';
import { useAppStore } from '../store/appProvider';
import TitleBar from './titleBar';
import Modal, { ModalComponentHandle } from './UI/Modal';

const Sessions = (): JSX.Element => {
	const {
		user: [user],
		containers: [containers, error],
		debug: [debug],
	} = useAppStore()
	const modalRef = useRef<ModalComponentHandle>(null);
	const navigate = useNavigate();

	const handleOpenSession = (sessionId: string) => {
		navigate(`${ROUTE_PREFIX}/sessions/${sessionId}`)
	}

	const confirmRemove = async (sessionId: string) => {
		if (!modalRef.current) return;

		const reply = await modalRef.current.open(
			'Remove session ?',
			'Permanently remove this session and all its applications?'
		);

		if (reply) {
			removeAppsAndSession(sessionId, user?.uid || '')
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
									<IconButton edge="end" color="info" aria-label="force remove" onClick={() => forceRemove(session.id)}>
										<Clear />
									</IconButton>
								</Tooltip>
							)}

							<Tooltip title="Shut down" placement="top">
								<IconButton edge="end" color="info" aria-label="Shut down" onClick={() => confirmRemove(session.id)}>
									<PowerSettingsNew />
								</IconButton>
							</Tooltip>

							{session.state === ContainerState.PAUSED &&
								<Tooltip title="Resume the session" placement="top">
									<IconButton edge="end" color="info" aria-label="Resume" onClick={(y) => resumeAppsAndSession(session.id, user?.uid || '')}>
										<Replay />
									</IconButton>
								</Tooltip>
							}

							{session.state !== ContainerState.PAUSED &&
								<Tooltip title="Pause the session. You can resume it later" placement="top">
									<IconButton edge="end" color="info" aria-label="pause" onClick={() => pauseAppsAndSession(session.id, user?.uid || '')}>
										<Pause />
									</IconButton>
								</Tooltip>
							}

							<Tooltip title="Open" placement="top">
								<IconButton sx={{ ml: 0.6 }} edge="end" color="info" aria-label="Open" onClick={() => handleOpenSession(session.id)} disabled={session.state !== ContainerState.RUNNING}>
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
