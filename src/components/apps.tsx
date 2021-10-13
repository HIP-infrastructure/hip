import React, { useRef, useState, useEffect } from 'react'
import { SlideMenu } from 'primereact/slidemenu'
import { Button } from 'primereact/button'
import { Tooltip } from 'primereact/tooltip';

import brainstormLogo from '../assets/brainstorm__logo.png'
import anywaveLogo from '../assets/anywave__logo.png'
import localizerLogo from '../assets/localizer__logo.png'
import fslLogo from '../assets/fsl__logo.png'
import hibopLogo from '../assets/hibop__logo.png'
import slicerLogo from '../assets/slicer__logo.png'
import mricroglLogo from '../assets/mrcicogl__logo.png'
import freesurferLogo from '../assets/freesurfer__logo.png'

const importedImages = [
	brainstormLogo,
	anywaveLogo,
	hibopLogo,
	localizerLogo,
	mricroglLogo,
	fslLogo,
	slicerLogo,
	freesurferLogo
]

import {
	Container,
	ContainerType,
	ContainerState,
	AppContainer,
	createApp,
	createSession,
} from '../api/gatewayClientAPI'
import { useAppStore } from '../store/appProvider'
import './apps.css'

interface Application {
	name: string
	description: string
	status: string
	url: string
	icon: string
}



const Apps = (): JSX.Element => {
	const appMenuRefs = useRef<(SlideMenu | null)[]>([])
	const [shouldCreateSession, setShouldCreateSession] = useState(false)
	const [sessionForNewApp, setSessionForNewApp] = useState<Container | null>()
	const [newSessionForApp, setNewSessionForApp] = useState<Container | null>()
	const [appName, setAppName] = useState('')
	const [inAppPage, setInAppPage] = useState(false)
	const [images, setImages] = useState<any[]>([])

	const {
		currentSession: [, setCurrentSession],
		showWedavForm: [showWedavForm, setShowWedavForm],
		user: [user, setUser],
		containers: [containers],
		availableApps
	} = useAppStore()

	// Import images
	// useEffect(() => {
	// 	availableApps?.map(app => {
	// 		import(`../assets/${app.name}__logo.png`)
	// 			.then(image => {
	// 				console.log(image)
	// 				// setImages((images: any[]) => [...images, image])
	// 			});
	// 	})
	// }, [availableApps, setImages])

	// create app in existing session
	// or create new session
	useEffect(() => {
		if (inAppPage && user?.password && showWedavForm) {
			setShowWedavForm(false)

			if (sessionForNewApp) {
				createApp(sessionForNewApp, user, appName)
				// Remove password after use
				const { password, ...nextUser } = user
				setUser(nextUser)
				setCurrentSession(sessionForNewApp)
				setSessionForNewApp(null)
				setInAppPage(false)
			} else if (shouldCreateSession && user.uid) {
				createSession(user.uid).then(session => {
					setNewSessionForApp(session)
					setShouldCreateSession(false)
				})
			}
		}
	}, [
		user,
		sessionForNewApp,
		shouldCreateSession,
		setShowWedavForm,
		setSessionForNewApp,
		setNewSessionForApp,
		setShouldCreateSession,
		setCurrentSession,
		setUser,
		setInAppPage,
		appName,
		inAppPage,
		showWedavForm,
	])

	// create app in new session
	useEffect(() => {
		if (inAppPage && newSessionForApp && user?.password) {
			setShowWedavForm(false)

			const container = containers?.find(
				c => c.id === newSessionForApp?.id && c.state === ContainerState.RUNNING
			)

			if (container) {
				createApp(container, user, appName)
				// Remove password after use
				const { password, ...nextUser } = user
				setUser(nextUser)
				setCurrentSession(container)
				setNewSessionForApp(null)
				setInAppPage(false)
			}
		}
	}, [
		user,
		containers,
		newSessionForApp,
		setCurrentSession,
		setNewSessionForApp,
		setUser,
		appName,
		inAppPage,
		setShowWedavForm,
	])

	const sessions =
		containers
			?.filter(
				(container: Container) => container.type === ContainerType.SESSION
			)
			.map((container: Container) => ({
				...container,
				apps: (containers as AppContainer[]).filter(
					a => a.parentId === container.id
				),
			})) || []

	const menuItems = (app: Application) =>
		[
			...sessions?.map((session: Container) => {
				const runningApp = session?.apps?.find(
					(sessionApp: AppContainer) =>
						session.id === sessionApp.parentId && sessionApp.app === app.name
				)
				return {
					label: runningApp
						? `Open in #${session.name}`
						: `Run in #${session.name}`,
					icon: runningApp ? 'pi pi-eye' : 'pi pi-clone',
					disabled: session.state !== ContainerState.RUNNING,
					command: () => {
						if (runningApp) {
							setCurrentSession(session)
						} else {
							setInAppPage(true)
							setAppName(app.name)
							setSessionForNewApp(session)
							setShowWedavForm(true)
						}
					},
				}
			}),
			{
				separator: true,
			},
			{
				label: 'Create in a new session',
				icon: 'pi pi-clone',
				command: () => {
					setInAppPage(true)
					setAppName(app.name)
					setShouldCreateSession(true)
					setShowWedavForm(true)
				},
			},
		] || []

	const AppItems = () => (
		<>
			{availableApps?.map((app, i) => {
				return (
					<div key={`${app.name}`} className='app__card'>
						<div className='app__card-img' title={app.label} tooltip={app.name}>
							<img
								height="64px"
								width="64px"
								src={importedImages[i]} alt=''
								onClick={event => appMenuRefs?.current[i]?.toggle(event)} />
						</div>
						<div className='apps__actions'>
							<SlideMenu
								ref={ref => (appMenuRefs.current[i] = ref)}
								model={menuItems(app)}
								popup
								viewportHeight={220}
								menuWidth={175}
							/>
							{/* <Button
							style={{ width: '80px'}}
							type='button'
							className='p-button-sm p-button-link' 
							label={app.name}
							onClick={event => appMenuRefs?.current[i]?.toggle(event)}
						/> */}
						</div>
					</div>
				)
			})}
		</>
	)

	return (
		<div>
			<main className='apps p-shadow-5'>
				<section
					className='apps__header'
					title='Apps are launched inside a session'
				>
					<h2>Applications</h2>
				</section>
				<section className='apps__launchpad'>
					<AppItems />
				</section>
			</main>
		</div>
	)
}

export default Apps
