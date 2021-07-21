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
	destroyAppsAndSession,
	AppContainer,
} from '../api/gatewayClientAPI'
import Session from './session'
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
	const {
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

	const confirm = (event: any, sessionId: string) => {
		confirmPopup({
			target: event.currentTarget,
			message: 'Permanently remove this session and all its applications?',
			icon: 'pi pi-exclamation-triangle',
			accept: () => user && destroyAppsAndSession(sessionId, user.uid),
		})
	}

	return (
		<div>
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
					<Button
						className='p-button-sm'
						label='Create session'
						onClick={() => user && createSession(user.uid)}
					/>
				</section>
				<section className='sessions__browser'>
					{!sessions && !error && (
						<ProgressSpinner
							strokeWidth='4'
							style={{ width: '24px', height: '24px' }}
						/>
					)}
					{error && <p>{error.message}</p>}
					{sessions?.length === 0 && <p>Please, create a session</p>}
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
													session.state === ContainerState.STOPPING) && (
													<ProgressSpinner
														strokeWidth='4'
														style={{ width: '24px', height: '24px' }}
													/>
												)}
											</div>
										</div>
									</ConditionalWrapper>
									<div className='session_actions'>
										<Button
											title='Shut down'
											icon='pi pi-times'
											className='p-button-sm p-button-rounded p-button-outlined p-button-warning p-mr-2'
											disabled={
												session.state !== ContainerState.RUNNING &&
												session.state !== ContainerState.EXITED
											}
											onClick={(e: any) => confirm(e, session.id)}
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
		</div>
	)
}

export default Sessions