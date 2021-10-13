import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { confirmPopup } from 'primereact/confirmpopup'
import { Sidebar } from 'primereact/sidebar'
import React, { useEffect } from 'react'
import { useAppStore } from '../store/appProvider'
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
import Session from './session'
import './sessions.css'
import { Message } from 'primereact/message';

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
	const {
		debug: [debug],
		currentSession: [currentSession, setCurrentSession],
		user: [user],
		containers: [containers, error],
	} = useAppStore()

	useEffect(() => {
		if (currentSession) {
			document.body.classList.add('body-fixed')
		} else {
			document.body.classList.remove('body-fixed')
		}
	}, [currentSession])

	const sessions = containers
		?.filter((container: Container) => container.type === ContainerType.SESSION)
		.map((s: Container) => ({
			...s,
			apps: (containers as AppContainer[]).filter(a => a.parentId === s.id),
		}))

	const confirmRemove = (event: any, sessionId: string) => {
		confirmPopup({
			target: event.currentTarget,
			message: 'Permanently remove this session and all its applications?',
			icon: 'pi pi-exclamation-triangle',
			accept: () => removeAppsAndSession(sessionId, user?.uid || ''),
		})
	}

	const confirmPause = (event: any, sessionId: string) => {
		confirmPopup({
			target: event.currentTarget,
			message: 'Pause this session and all its applications? You can restore it later',
			icon: 'pi pi-exclamation-triangle',
			accept: () => pauseAppsAndSession(sessionId, user?.uid || ''),
		})
	}

	return (
		<>
			<Sidebar
				visible={currentSession != null}
				showCloseIcon={false}
				fullScreen
				onHide={() => setCurrentSession(null)}
			>
				<Session />
			</Sidebar>

			<main className='sessions p-shadow-5'>
				<section
					className='sessions__header'
					title='A session is a remote session instance where you can launch apps'
				>
					<h2>My Sessions</h2>
					{debug && (
						<Button
							className='p-button-sm'
							label='Fetch remote'
							onClick={() => user && fetchRemote()}
						/>
					)}
					<Button
						className='p-button-sm'
						label='Create session'
						onClick={() => createSession(user?.uid || '')}
					/>
				</section>
				<section className='sessions__browser'>
					{!sessions && !error && (
						<ProgressSpinner
							strokeWidth='4'
							style={{ width: '24px', height: '24px' }}
						/>
					)}
					{error && <Message severity="error" text={error.message} />}
					{!error && sessions?.length === 0 &&
						<Button
							className='p-button-sm'
							label='Create a new session'
							onClick={() => createSession(user?.uid || '')}
						/>
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
													setCurrentSession(session)
												}}
											>
												{children}
											</a>
										)}
									>
										<div className='session__desktop_overlay'>
											<div className='session__desktop-text'>
												<div className='session__name'>{`#${session?.name}`}</div>
												<div className='session__details'>
													<p>{session.state}</p>
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
														<ProgressSpinner
															strokeWidth='4'
															style={{ width: '24px', height: '24px' }}
														/>
													)}
											</div>
										</div>
									</ConditionalWrapper>
									<div className='session_actions'>
										{debug && (
											<Button
												title='Force remove'
												icon='pi pi-times'
												className='p-button-sm p-button-rounded p-button-danger p-mr-2'
												onClick={() => forceRemove(session.id)}
											/>
										)}
										{session.state !== ContainerState.PAUSED && <Button
											title='Pause'
											icon='pi pi-pause'
											className='p-button-sm p-button-rounded p-button-outlined p-button-primary p-mr-2'
											onClick={(e: any) => confirmPause(e, session.id)}
										/>}
										{session.state === ContainerState.PAUSED && <Button
											title='Resume'
											icon='pi pi-play'
											className='p-button-sm p-button-rounded p-button-outlined p-button-primary p-mr-2'
											onClick={(e: any) => resumeAppsAndSession(session.id, user?.uid)}
										/>}

										<Button
											title='Shut down'
											icon='pi pi-times'
											className='p-button-sm p-button-rounded p-button-outlined p-button-warning p-mr-2'
											disabled={
												session.state !== ContainerState.RUNNING &&
												session.state !== ContainerState.EXITED
											}
											onClick={(e: any) => confirmRemove(e, session.id)}
										/>
										<Button
											title='Open'
											icon='pi pi-eye'
											className='p-button-sm p-button-rounded p-button-primary '
											disabled={session.state !== ContainerState.RUNNING}
											onClick={() => {
												setCurrentSession(session)
											}}
										/>
									</div>
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
