import React, { useRef, useState, useEffect } from 'react'
import { SlideMenu } from 'primereact/slidemenu'
import { Tooltip } from 'primereact/tooltip';

import brainstormLogo from '../assets/brainstorm__logo.png'
import anywaveLogo from '../assets/anywave__logo.png'
import localizerLogo from '../assets/localizer__logo.png'
import fslLogo from '../assets/fsl__logo.png'
import hibopLogo from '../assets/hibop__logo.png'
import slicerLogo from '../assets/slicer__logo.png'
import mricroglLogo from '../assets/mrcicogl__logo.png'
import freesurferLogo from '../assets/freesurfer__logo.png'
import dcm2niixLogo from '../assets/dcm2niix__logo.png'
import bidsManagerLogo from '../assets/bidsmanager__logo.png'

const importedImages = [
	anywaveLogo,
	bidsManagerLogo,
	brainstormLogo,
	dcm2niixLogo,
	freesurferLogo,
	fslLogo,
	hibopLogo,
	localizerLogo,
	mricroglLogo,
	slicerLogo,
]

import {
	Container,
	ContainerType,
	ContainerState,
	AppContainer,
	createApp,
	createSession,
	Application,
} from '../api/gatewayClientAPI'
import { useAppStore } from '../store/appProvider'
import './apps.css'

const importedImages = [
	anywaveLogo,
	bidsManagerLogo,
	brainstormLogo,
	dcm2niixLogo,
	freesurferLogo,
	fslLogo,
	hibopLogo,
	localizerLogo,
	mricroglLogo,
	slicerLogo,
]

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
		availableApps,
		debug: [debug],
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
			{
				separator: true,
			},
			{
				label: 'Documentation',
				icon: 'pi pi-clone',
				command: () => {
					window.open(app.url, '_blank')
				},
			},
		] || []

	const AppItems = () => (
		<>
			{availableApps?.map((app, i) => {
				return (
					<div key={`${app.name}`}>
						<Tooltip target={`.app__card__${app.name}`} content={`${app.label} ${app.version} ${app.state !== 'ready' ? '(	' + app.state + ')': ''}\n ${app.description}`} />
						<div className={`app__card app__card__${app.name}`}>
							<div className='app__card-img'>
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
