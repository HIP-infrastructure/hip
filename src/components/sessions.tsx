import React, { useEffect } from 'react'
import { useAppStore } from '../store/appProvider'
import { useNavigate } from "react-router-dom";
import { ROUTE_PREFIX } from '../constants';
import { Visibility, PowerSettingsNew, Pause, Clear, Replay } from '@mui/icons-material'
import {  Box, CircularProgress, Button, IconButton, Tooltip } from '@mui/material';
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
import './sessions.css'

const ConditionalWrapper = ({
	condition,
	wrapper,
	children,
}: {
	condition: boolean
	wrapper: (children: JSX.Element) => JSX.Element
	children: JSX.Element
}): JSX.Element => (condition ? wrapper(children) : children)

const Sessions = (): JSX.Element => {
	const toast = React.useRef(null);
	const {
		user: [user],
		containers: [containers, error],
		debug: [debug],
	} = useAppStore()

	const navigate = useNavigate();

	function handleOpenSession(sessionId: string) {
		navigate(`${ROUTE_PREFIX}/sessions/${sessionId}`)
	}

	// useEffect(() => {
	// 	if (currentSession) {
	// 		document.body.classList.add('body-fixed')
	// 	} else {
	// 		document.body.classList.remove('body-fixed')
	// 	}
	// }, [currentSession])

	const sessions = containers
		?.filter((container: Container) => container.type === ContainerType.SESSION)
		.map((s: Container) => ({
			...s,
			apps: (containers as AppContainer[]).filter(a => a.parentId === s.id),
		}))

	const confirmRemove = (event: any, sessionId: string) => {
		// confirmPopup({
		// 	target: event.currentTarget,
		// 	message: 'Permanently remove this session and all its applications?',
		// 	icon: 'pi pi-exclamation-triangle',
		// 	accept: () => removeAppsAndSession(sessionId, user?.uid || ''),
		// })
	}

	// error && toast?.current?.show({ severity: 'error', summary: 'Error', detail: error.message, position: "bottom-right" })

	return (
		<>
			<main className='sessions'>
				<section
					className='sessions__header'
					title='A session is a remote session instance where you can launch apps'
				>
					<h2>My Sessions</h2>
					<div>
						{debug && (
							<Button variant="text" color="info" onClick={() => user && fetchRemote()}>Fetch remote</Button>

						)}
						<Button variant="text" color="info" onClick={() => createSession(user?.uid || '')}>Create session</Button>
					</div>
				</section>
				<section className='sessions__browser'>
					{!sessions && !error && (
						<CircularProgress size={24} />
					)}

					{sessions?.length === 0 &&
						<Button variant="text" color="info" onClick={() => createSession(user?.uid || '')}>Create a new session</Button>
					}

					<div className='sessions__items'>
						{sessions?.map(session => (
							<div className='session__item' key={`${session.id}`}>
								<div className='session__desktop'>
									<ConditionalWrapper
										condition={session.state === ContainerState.RUNNING}
										wrapper={children => (
											<a
												title='Open'
												href={session.url}
												onClick={e => {
													e.preventDefault()
													handleOpenSession(session.id)
												}}
											>
												{children}
											</a>
										)}
									>
										<div className='session__desktop_overlay'>
											<div className='session__desktop-text'>
												<div className='session__name'>{`Session #${session?.name}: ${session.state}`}
													{user?.uid !== session?.user &&
														<span className='session__username'>{`${session?.user}`}</span>}
												</div>
												<div className='session__details'>
													<p>{session.error?.message}</p>
													{session.apps.map(app => (
														<div key={app.id} className='session_details-app'>
															<p>
																<strong>{app.app}</strong>: {app.state}
															</p>
															<p>{app.error?.message}</p>
														</div>
													))}
												</div>
											</div>
											<div className='session__desktop-loading'>
												{(session.state === ContainerState.CREATED ||
													session.state === ContainerState.LOADING ||
													session.state === ContainerState.STOPPING ||
													session.apps.find(
														a =>
															a.state === ContainerState.CREATED ||
															a.state === ContainerState.LOADING ||
															a.state === ContainerState.STOPPING
													)) && (
														<CircularProgress size={24} />
													)}
											</div>
										</div>
									</ConditionalWrapper>
									<Box className='session_actions' sx={{ mr: 2 }}>
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

									</Box>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>
		</>
	)
}

export default Sessions
