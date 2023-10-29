import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { ArrowBack, Fullscreen, Menu, MenuOpen } from '@mui/icons-material'
import {
	AppBar,
	Box,
	CircularProgress,
	Drawer,
	Grid,
	IconButton,
	Paper,
	Toolbar,
	Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
	createApp,
	getDesktop,
	getDesktopsAndApps,
	stopApp,
} from '../../api/remoteApp'
import { Application, Container } from '../../api/types'
import { APP_MARGIN_TOP, DRAWER_WIDTH, POLLING } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import AppList from './AppList'
import Info from './Info'

const Desktop = (): JSX.Element => {
	const { trackEvent } = useMatomo()
	const params = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const { showNotif } = useNotification()

	const fullScreenRef = useRef<HTMLIFrameElement>(null)
	const {
		user: [user],
		tabbedDesktops: [tabbedDesktops, setTabbedDesktops],
		tabbedProjectDesktops: [tabbedProjectDesktops, setTabbedProjectDesktops],
		projectContainers: [pcontainers],
		containers: [ccontainers],
	} = useAppStore()
	const [containers, setContainers] = React.useState<Container[]>([
		...(pcontainers || []),
		...(ccontainers || []),
	])
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
	const desktopApps = containers?.filter(a => a.parentId === desktop?.id)

	const getDesktops = useCallback(
		(userId: string) =>
			getDesktopsAndApps(workspace, userId, groupIds, showAdminView)
				.then(data => setContainers(data))
				.catch(error => showNotif(error, 'error')),
		[workspace, groupIds, showAdminView, showNotif, params]
	)

	// Remove scroll for entire window
	useEffect(() => {
		setContainers([...(pcontainers || []), ...(ccontainers || [])])
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
	}, [user, getDesktops, params.id])

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

	// get remote content of desktop
	useEffect(() => {
		if (!params.id) return

		const desktopId: string = params.id.toString()
		const desktop = containers?.find(d => d.id === desktopId)

		if (!desktop) return

		if (desktop.workspace === 'private')
			setTabbedDesktops(ds => {
				if (!ds?.map(d => d.id).includes(desktopId)) {
					return [...ds, desktop as Container]
				}

				return ds
			})

		if (desktop.workspace === 'collab') {
			const projectName = params.projectId
			if (projectName)
			setTabbedProjectDesktops(ds => {
				if (
					!ds[projectName]?.map(d => d.id).includes(desktopId)
				) {
					return {...ds, [projectName]: [...(ds[projectName] || []), desktop as Container]}
				}

				return ds
			})
		}

		getDesktop(desktopId).then(data => {
			setDesktop(data)
		})
	}, [containers, setDesktop, params, workspace])

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
		<>
			<AppBar
				component='div'
				color='secondary'
				position='static'
				elevation={5}
				sx={{
					zIndex: 0,
					borderBottom: 0,
					width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
				}}
			>
				<Toolbar variant='dense'>
					<Grid container alignItems='center' spacing={1}>
						<Grid item xs>
							<IconButton
								color='inherit'
								aria-label='go back'
								onClick={handleBackLocation}
							>
								<ArrowBack />
							</IconButton>
						</Grid>
						<Grid item xs>
							<Typography color='inherit' variant='h6' component='div'>
								{`#${desktop?.name}`}
							</Typography>
						</Grid>
						<Grid item>
							<IconButton
								color='inherit'
								aria-label='full screen'
								onClick={() => setFullscreen(!fullscreen)}
								sx={{ mr: 2 }}
							>
								<Fullscreen />
							</IconButton>
						</Grid>
						<Grid item>
							<IconButton
								color='inherit'
								aria-label='open drawer'
								onClick={handleDrawerOpen}
								edge='end'
								sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
							>
								<MenuOpen />
							</IconButton>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Paper
				square
				elevation={5}
				sx={{
					p: 0,
					width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
				}}
			>
				{!desktopIsAlive && (
					<div
						aria-label='Loading remote desktop'
						style={{
							width: '100%',
							height: 'calc(100vh - 164px)',
							display: 'flex',
							alignItems: 'center',
							backgroundColor: '#eee',
							justifyContent: 'center',
						}}
					>
						<CircularProgress size={32} />
					</div>
				)}
				{desktopIsAlive && desktop?.url && (
					<iframe
						ref={fullScreenRef}
						title='Workbench'
						src={desktop.url}
						allow={'autoplay; fullscreen; clipboard-write;'}
						style={{
							width: '100%',
							height: 'calc(100vh - 164px)',
							backgroundColor: '#eee',
							overflowY: 'hidden',
						}}
					/>
				)}
			</Paper>
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
			>
				<Box sx={{ p: 1 }}>
					<IconButton onClick={handleDrawerClose} aria-label='Close drawer'>
						<Menu />
					</IconButton>
				</Box>
				<Box>
					<Info desktop={desktop} />
				</Box>
				<AppList
					desktop={desktop}
					containers={containers}
					handleToggleApp={handleToggleApp}
				/>
			</Drawer>
		</>
	)
}

Desktop.displayName = 'Desktop'
export default Desktop
