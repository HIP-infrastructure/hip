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
	Select,
	SelectChangeEvent,
	Toolbar,
	Typography,
} from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { styled, useTheme } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'
import { createApp, getContainer, getContainers, stopApp } from '../api/gatewayClientAPI'
import {
	Application,
	Container,
	ContainerType,
} from '../api/types'
import {
	APP_MARGIN_TOP,
	DRAWER_WIDTH,
	POLLING,
	ROUTE_PREFIX,
} from '../constants'
import { useAppStore } from '../store/appProvider'
import AppList from './sessionAppList'
import SessionInfo from './sessionInfo'
import React, { useEffect, useRef, useState } from 'react'

interface AppBarProps extends MuiAppBarProps {
	open?: boolean
}

const Session = (): JSX.Element => {
	const { trackEvent } = useMatomo()
	const params = useParams()

	const fullScreenRef = useRef<HTMLIFrameElement>(null)
	const {
		// containers: [containers, setContainers],
		user: [user],
	} = useAppStore()

	const theme = useTheme()
	const navigate = useNavigate()

	const [containers, setContainers] = React.useState<{
		data?: Container[]
		error?: string
	}>({})
	const [session, setSession] = useState<Container>()
	const [fullscreen, setFullscreen] = useState(false)
	const [drawerOpen, setDrawerOpen] = useState(true)
	const [sessionIsAlive, setSessionIsAlive] = useState(false)
	const intervalRef = useRef<NodeJS.Timeout>()

	const sessions = containers?.data?.filter(
		c => c.type === ContainerType.SESSION
	)

	// Remove scroll for entire window
	useEffect(() => {
		document.body.classList.add('body-fixed')
		return () => {
			document.body.classList.remove('body-fixed')
		}
	}, [])

	// Polling for containers state
	useEffect(() => {
		const interval = setInterval(() => {
			user && session?.domain &&
				getContainers(user, session.domain)
					.then(data => setContainers({ data }))
					.catch(error => setContainers({ error }))
		}, POLLING * 1000)
		return () => clearInterval(interval)
	}, [setContainers, user, session])

	// Check for XPra readiness
	useEffect(() => {
		if (intervalRef.current || !session?.url) return
		if (sessionIsAlive) return
		intervalRef.current = setInterval(() => {
			fetch(session.url, { method: 'HEAD' })
				.then(result => {
					if (result.status === 200) {
						if (intervalRef.current) {
							clearInterval(intervalRef.current)
							intervalRef.current = undefined
						}

						setSessionIsAlive(true)
						focusOnIframe(5)
					}
				})
				.catch(e => {
					// console.log(e)
				})
		}, 1000)
	}, [session, sessionIsAlive])

	useEffect(() => {
		if (!params.id) return

		getContainer(params.id).then(data => {
			const pathId = data?.url.split('/').slice(-2, -1) || ''
			const path = encodeURIComponent(`/session/${pathId}/`)
			const url = `${data.url}?path=${path}`
			setSession({ ...data, url })
		})
	}, [setSession, params])

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

	const focusOnIframe = (t: number) => {
		setTimeout(() => {
			fullScreenRef.current?.focus()
		}, t * 1000)
	}

	// Start an app
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

		if (!session || !user) {
			return
		}
		createApp(session, user, app.name)

		focusOnIframe(1)

		trackEvent({
			category: 'app',
			action: 'start',
		})
	}

	const handleDrawerOpen = () => {
		setDrawerOpen(true)
		focusOnIframe(1)
	}

	const handleDrawerClose = () => {
		setDrawerOpen(false)
		focusOnIframe(1)
	}

	const handleBackLocation = () => {
		navigate(-1)
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

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar
				position='fixed'
				open={drawerOpen}
				color='secondary'
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
						src={session.url}
						allow={'autoplay; fullscreen; clipboard-write;'}
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
						<Typography variant='subtitle2'>hide</Typography>
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
