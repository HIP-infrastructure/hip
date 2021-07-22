import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import React, { useEffect, useRef, useState } from 'react'

import { useAppStore } from '../store/appProvider'
import {
	AppContainer,
	ContainerState,
	createApp,
} from '../api/gatewayClientAPI'

const xpraHTML5Parameters = 'keyboard=false&sharing=yes&sound=no'

const Session = (): JSX.Element => {
	const fullScreenRef = useRef<HTMLIFrameElement>(null)
	const [fullscreen, setFullscreen] = useState(false)
	const [inSession, setInSession] = useState(false)

	const {
		currentSession: [currentSession, setCurrentSession],
		showWedavForm: [showWedavForm, setShowWedavForm],
		containers: [containers],
		user: [user, setUser],
	} = useAppStore()

	useEffect(() => {
		if (inSession &&  showWedavForm && user?.password) {
			setShowWedavForm(false)
			if (currentSession !== null) createApp(currentSession, user)

			// Remove password after use
			const { password, ...nextUser } = user
			setUser(nextUser)
			setInSession(false)
		}
	}, [user, inSession, currentSession, showWedavForm, setShowWedavForm, setUser, setInSession])

	useEffect(() => {
		if (fullscreen) {
			fullScreenRef?.current?.requestFullscreen()
			document.addEventListener('fullscreenchange', () => {
				if (!document.fullscreenElement) {
					setFullscreen(false)
				}
			})
		}
	}, [fullscreen])

	const sessionApps =
		(containers as AppContainer[])?.filter(
			a => a.parentId === currentSession?.id
		) || null

	return (
		<div className='session__sidebar'>
			{currentSession?.url && (
				<iframe
					ref={fullScreenRef}
					title='Live Session'
					className='session__sidebar_iframe'
					src={`${currentSession.url}?${xpraHTML5Parameters}`}
					allowFullScreen
				/>
			)}
			{!currentSession?.url && (
				<div className='session__sidebar_iframe'>
					<div>
						<ProgressSpinner />
					</div>
				</div>
			)}
			<div className='session__sidebar-info'>
				<div className='session__sidebar-header'>
					<div className='session__sidebar-name'>{`#${currentSession?.name}`}</div>
					<div className='session__sidebar_actions'>
						<Button
							title='Go back to main window'
							icon='pi pi-chevron-left'
							className='p-button-sm p-button-rounded p-button-outlined p-button-secondary p-mr-2'
							onClick={() => {
								setCurrentSession(null)
							}}
						/>
						<Button
							title='Fullscreen'
							icon='pi pi-window-maximize'
							className='p-button-sm p-button-outlined p-button-primary p-mr-2'
							disabled={
								currentSession?.state !== ContainerState.RUNNING &&
								currentSession?.state !== ContainerState.EXITED
							}
							onClick={() => {
								setFullscreen(true)
							}}
						/>
					</div>
				</div>
				<div className='session__sidebar-details'>
					<p>{currentSession?.state}</p>
					<p>{currentSession?.error?.message}</p>
					<div className='session__sidebar-apps'>
						{currentSession &&
							sessionApps?.map(app => (
								<div key={app.id}>
									<div className='session__sidebar-appname'>{app.app}</div>
									<div className='session__sidebar-details'>
										<p>{app.state}</p>
									</div>
								</div>
							))}

						{currentSession?.state === ContainerState.RUNNING &&
							sessionApps?.length === 0 && (
								<Button
									type='button'
									className='p-button-sm p-button-outlined'
									icon='pi pi-clone'
									label='Create Brainstorm'
									onClick={() => {
										setInSession(true)
										setShowWedavForm(true)
									}}
								/>
							)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Session
