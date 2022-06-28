import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	ArrowBack,
	ChevronLeft,
	ChevronRight,
	ExpandMore,
	Fullscreen,
	Menu,
} from '@mui/icons-material'
import {
	Box,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	MenuItem,
	Modal,
	Select,
	SelectChangeEvent,
	Toolbar,
	Typography,
} from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { styled, useTheme } from '@mui/material/styles'
import { createBrowserHistory } from 'history'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createApp, stopApp } from '../api/gatewayClientAPI'
import {
	AppContainer,
	Application,
	Container,
	ContainerType,
} from '../api/types'
import {
	APP_MARGIN_TOP,
	DRAWER_WIDTH,
	ROUTE_PREFIX,
	XPRA_PARAMS,
} from '../constants'
import { useAppStore } from '../store/appProvider'
import AppList from './sessionAppList'
import SessionInfo from './sessionInfo'
import WebdavForm from './webdavLoginForm'

interface AppBarProps extends MuiAppBarProps {
	open?: boolean
}

const Session = (): JSX.Element => {
	const { trackEvent } = useMatomo()

	const fullScreenRef = useRef<HTMLIFrameElement>(null)
	const {
		containers: [containers],
		user: [user, setUser],
	} = useAppStore()

	const params = useParams()
	const theme = useTheme()
	const navigate = useNavigate()
	const history = createBrowserHistory()

	const [session, setSession] = useState<Container>()
	const [startApp, setStartApp] = useState<Application>()
	const [fullscreen, setFullscreen] = useState(false)
	const [drawerOpen, setDrawerOpen] = useState(true)
	const [showWedavForm, setShowWedavForm] = useState(false)
	const [sessionIsAlive, setSessionIsAlive] = useState(false)
	const intervalRef = useRef<NodeJS.Timeout>()

	const sessions = containers?.filter(c => c.type === ContainerType.SESSION)

	// Remove scroll for entire window
	useEffect(() => {
		document.body.classList.add('body-fixed')
		return () => {
			document.body.classList.remove('body-fixed')
		}
	}, [])

	// Check for XPra readiness
	useEffect(() => {
		if (intervalRef.current || !session?.url) return

		intervalRef.current = setInterval(() => {
			fetch(session.url)
				.then(result => {
					if (result.status === 200) {
						if (intervalRef.current) clearInterval(intervalRef.current)

						setSessionIsAlive(true)
					}
				})
				.catch(e => {
					// console.log(e)
				})
		}, 1000)
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [session])

	// get session and its children apps from params
	useEffect(() => {
		const s = containers?.find(c => c.id === params.id)
		if (s) {
			// && (s.id !== session?.id)) {
			s.apps = containers?.filter(c => c.parentId === s.id) as AppContainer[]
			setSession(s)
		}
	}, [params, session, setSession, containers])

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

	// Start an app in the session after getting user's password
	useEffect(() => {
		if (!(session && startApp && user)) {
			return
		}

		setShowWedavForm(false)
		createApp(session, user, startApp.name)

		trackEvent({
			category: 'app',
			action: 'start',
		})

		// Remove password after use
		const { password, ...nextUser } = user
		setUser(nextUser)
		setStartApp(undefined)
	}, [user])

	const handleToggleApp = (app: Application) => {
		const targetApp = session?.apps?.find(a => a.app === app.name)
		if (targetApp) {
			stopApp(session?.id || '', user?.uid || '', targetApp.id)

			trackEvent({
				category: 'app',
				action: 'stop',
			})

			return
		}

		setStartApp(app)
		setShowWedavForm(true)
	}

	const handleDrawerOpen = () => {
		setDrawerOpen(true)
	}

	const handleDrawerClose = () => {
		setDrawerOpen(false)
	}

	const handleBackLocation = () => {
		// history.go(-1)
		navigate(`${ROUTE_PREFIX}/private/sessions`)
	}

	const handleOnChange = (event: SelectChangeEvent) => {
		const sessionId = event.target.value as string
		navigate(`${ROUTE_PREFIX}/sessions/${sessionId}`)
	}

	const AppBar = styled(MuiAppBar, {
		shouldForwardProp: prop => prop !== 'open',
	})<AppBarProps>(({ theme, open }) => ({
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			width: `calc(100% - ${DRAWER_WIDTH}px)`,
			marginRight: `${DRAWER_WIDTH}px`,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
		}),
	}))

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}))

	const modalStyle = {
		position: 'absolute' as 'const',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 200,
		bgcolor: 'background.paper',
		border: '1px solid #333',
		boxShadow: 4,
		p: 4,
	}

	return (
		<Box sx={{ display: 'flex' }}>
			<Modal open={showWedavForm} onClose={() => setShowWedavForm(false)}>
				<Box sx={modalStyle}>
					<WebdavForm />
				</Box>
			</Modal>
			<AppBar
				position='fixed'
				open={drawerOpen}
				sx={{
					marginTop: `${APP_MARGIN_TOP}px`,
				}}
			>
				<Toolbar variant='dense'>
					<IconButton
						color='inherit'
						aria-label='go back'
						onClick={handleBackLocation}
					>
						<ArrowBack />
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
					<Select
						id='session-select'
						aria-label='Select desktop'
						IconComponent={() => <ExpandMore />}
						value={session?.id || ''}
						onChange={handleOnChange}
						sx={{ color: 'white' }}
					>
						{sessions?.map(s => (
							<MenuItem
								value={s?.id}
								key={s?.id}
							>{`Desktop #${s?.name}`}</MenuItem>
						))}
					</Select>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						color='inherit'
						aria-label='full screen'
						onClick={() => setFullscreen(!fullscreen)}
						sx={{ mr: 2 }}
					>
						<Fullscreen />
					</IconButton>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='end'
						sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
					>
						<Menu />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Box>
				{!sessionIsAlive && (
					<div
						aria-label='Loading remote desktop'
						style={{
							width: drawerOpen ? 'calc(100vw - 240px)' : '100vw',
							height: '100vh',
							backgroundColor: '#333',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<CircularProgress size={32} />
					</div>
				)}
				{sessionIsAlive && session && (
					<iframe
						ref={fullScreenRef}
						title='Desktop'
						src={`${session.url}?${XPRA_PARAMS}`}
						allowFullScreen
						style={{
							width: drawerOpen ? 'calc(100vw - 240px)' : '100vw',
							height: 'calc(100vh - 100px)',
							backgroundColor: '#333',
							marginTop: '54px',
						}}
					/>
				)}
			</Box>
			<Drawer
				sx={{
					width: DRAWER_WIDTH,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: DRAWER_WIDTH,
						boxSizing: 'border-box',
						top: `${APP_MARGIN_TOP}px`,
					},
				}}
				anchor={'right'}
				variant='persistent'
				open={drawerOpen}
				elevation={100}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose} aria-label='Close drawer'>
						<Typography variant='subtitle2'>close</Typography>
						{theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</DrawerHeader>
				<SessionInfo session={session} />
				<Divider />
				<AppList session={session} handleToggleApp={handleToggleApp} />
			</Drawer>
		</Box>
	)
}

Session.displayName = 'Session'
export default Session
