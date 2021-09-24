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
import mrcicoglLogo from '../assets/mrcicogl__logo.png'
import appLogo from '../assets/app__logo.png'

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

export const appItems: Application[] = [
	{
		name: 'brainstorm',
		description:
			'Brainstorm is a collaborative, open-source application dedicated to the analysis of brain recordings: MEG, EEG, fNIRS, ECoG, depth electrodes and multiunit electrophysiology.',
		status: 'running',
		url: 'https: //neuroimage.usc.edu/brainstorm/Introduction',
		icon: brainstormLogo,
	},
	{
		name: 'anywave',
		description:
			'AnyWave is a software designed to easily open and view data recorded by EEG or MEG acquisition systems.',
		status: '',
		url: 'https://meg.univ-amu.fr/wiki/AnyWave',
		icon: anywaveLogo,
	},
	{
		name: 'hibop',
		description:
			'HiBoP illustrates the possibility to render group-level activity dynamically at the cortical level, for several experimental conditions (columns) of the same cognitive paradigm.',
		status: 'running',
		url: '',
		icon: hibopLogo
	},
	{
		name: 'localizer',
		description:
			'',
		status: 'running',
		url: 'https://gin11-web.ujf-grenoble.fr/?page_id=228',
		icon: localizerLogo
	},
	{
		name: 'mricrogl',
		description:
			'MRIcroGL is a cross-platform tool for viewing DICOM and NIfTI format images. It provides a drag-and-drop user interface as well as a scripting language.',
		status: 'running',
		url: 'https://github.com/rordenlab/MRIcroGL',
		icon: mrcicoglLogo
	},
	{
		name: 'fsl',
		description:
			'FSL is a comprehensive library of analysis tools for FMRI, MRI and DTI brain imaging data.',
		status: 'running',
		url: 'https://fsl.fmrib.ox.ac.uk/fsl/fslwiki/FSL',
		icon: fslLogo
	},
	{
		name: 'slicer',
		description:
			'Desktop software to solve advanced image computing challenges with a focus on clinical and biomedical applications.',
		status: 'running',
		url: 'https://www.slicer.org/',
		icon: slicerLogo
	},
]

const Apps = (): JSX.Element => {
	const appMenuRefs = useRef<(SlideMenu | null)[]>([])
	const [shouldCreateSession, setShouldCreateSession] = useState(false)
	const [sessionForNewApp, setSessionForNewApp] = useState<Container | null>()
	const [newSessionForApp, setNewSessionForApp] = useState<Container | null>()
	const [appName, setAppName] = useState('')
	const [inAppPage, setInAppPage] = useState(false)

	const {
		currentSession: [, setCurrentSession],
		showWedavForm: [showWedavForm, setShowWedavForm],
		user: [user, setUser],
		containers: [containers],
	} = useAppStore()

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
			...sessions?.map((session: Container ) => {
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
				label: 'Create a new session',
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
			{appItems.map((app, i) => (
				<div key={`${app.name}`} className='app__card'>
					<div className='app__card-img' title={app.name} tooltip={app.name}>
						<img 
							src={app.icon} alt='' 
							onClick={event => appMenuRefs?.current[i]?.toggle(event)}/>
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
			))}
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
