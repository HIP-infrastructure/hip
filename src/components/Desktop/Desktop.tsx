import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	ArrowBack,
	ExpandMore,
	Fullscreen,
	Menu,
	MenuOpen,
} from '@mui/icons-material'
import {
	Box,
	CircularProgress,
	Drawer,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Toolbar,
} from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
	createApp,
	getDesktop,
	getDesktopsAndApps,
	stopApp,
} from '../../api/remoteApp'
import { Application, Container, ContainerType } from '../../api/types'
import {
	APP_MARGIN_TOP,
	DRAWER_WIDTH,
	POLLING,
	ROUTE_PREFIX,
} from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import AppList from './AppList'
import Info from './Info'

interface AppBarProps extends MuiAppBarProps {
	open?: boolean
}

const Desktop = (): JSX.Element => {
	const { trackEvent } = useMatomo()
	const params = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const { showNotif } = useNotification()

	const fullScreenRef = useRef<HTMLIFrameElement>(null)
	const {
		user: [user],
	} = useAppStore()
	const [containers, setContainers] = React.useState<Container[]>([])
	const [desktop, setDesktop] = useState<Container>()
	const [fullscreen, setFullscreen] = useState(false)
	const [drawerOpen, setDrawerOpen] = useState(true)
	const [desktopIsAlive, setDesktopIsAlive] = useState(false)
	const intervalRef = useRef<NodeJS.Timeout>()

	const [from] = useState(location.state?.from)
	const [workspace] = useState(location.state?.workspace)
	const [trackingName] = useState(location.state?.trackingName)
	const [groupIds] = useState(location.state?.groupIds || [])
	const [showAdminView] = useState(location.state?.showAdminView || false)
	const desktops = containers?.filter(c => c.type === ContainerType.DESKTOP)
	const desktopApps = containers?.filter(a => a.parentId === desktop?.id)

	const getDesktops = useCallback(
		(userId: string) =>
			getDesktopsAndApps(workspace, userId, groupIds, showAdminView)
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error')),
		[workspace, groupIds, showAdminView, showNotif]
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
		const userId = user?.uid
		if (!userId) return

		getDesktops(userId)
		const interval = setInterval(() => {
			getDesktops(userId)
		}, POLLING * 1000)

		return () => clearInterval(interval)
	}, [user, getDesktops])

	// Check for XPra readiness
	useEffect(() => {
		if (intervalRef.current || !desktop?.url) return
		if (desktopIsAlive) return
		intervalRef.current = setInterval(() => {
			fetch(desktop.url, { method: 'HEAD' })
				.then(result => {
					if (result.status === 200) {
						if (intervalRef.current) {
							clearInterval(intervalRef.current)
							intervalRef.current = undefined
						}

						setDesktopIsAlive(true)
						focusOnIframe(3)
					}
				})
				.catch(e => {
					// console.log(e)
				})
		}, 1000)
		return () => {
			intervalRef.current && clearInterval(intervalRef.current)
			intervalRef.current = undefined
		}
	}, [desktop, desktopIsAlive])

	useEffect(() => {
		if (!params.id) return

		getDesktop(params.id).then(data => setDesktop(data))
	}, [setDesktop, params])

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
		if (!desktop?.id || !user?.uid) {
			return
		}

		const targetApp = desktopApps?.find(a => a.name === app.name)
		if (targetApp) {
			stopApp(desktop?.id, desktop?.userId, targetApp.id).then(data =>
				setContainers(data)
			)

			trackEvent({
				category: 'Desktop',
				action: 'Stop an application',
				name: `${trackingName} ${app.name}`,
			})

			return
		}

		createApp(desktop.id, desktop.userId, app.name)
		focusOnIframe(1)

		trackEvent({
			category: 'Desktop',
			action: 'Start an application',
			name: `${trackingName} ${app.name}`,
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
		if (from) navigate(from)
	}

	const handleOnChange = (event: SelectChangeEvent) => {
		const desktopId = event.target.value as string
		navigate(`${ROUTE_PREFIX}/desktops/${desktopId}`)
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
		backgroundColor: theme.palette.grey[100],
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
						id='desktop-select'
						aria-label='Select desktop'
						IconComponent={() => <ExpandMore />}
						value={desktop?.id || ''}
						onChange={handleOnChange}
						sx={{ color: 'white' }}
					>
						{desktops?.map(s => (
							<MenuItem
								value={s?.id}
								key={s?.id}
							>{`Workbench #${s?.name}`}</MenuItem>
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
						<MenuOpen />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Box>
				{!desktopIsAlive && (
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
				{desktopIsAlive && desktop && desktop?.url && (
					<iframe
						ref={fullScreenRef}
						title='Workbench'
						src={desktop.url}
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
						<Menu />
					</IconButton>
				</DrawerHeader>
				<Box>
					<Info desktop={desktop} />
				</Box>
				<AppList
					desktop={desktop}
					containers={containers}
					handleToggleApp={handleToggleApp}
				/>
			</Drawer>
		</Box>
	)
}

Desktop.displayName = 'Desktop'
export default Desktop
