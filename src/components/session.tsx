import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import AppList from './appList'
import { useAppStore } from '../store/appProvider'
import {
	Container,
	AppContainer,
	Application,
	createApp,
	stopApp,
	ContainerType,

} from '../api/gatewayClientAPI'
import WebdavForm from './webdavLoginForm'
import SessionInfo from './sessionInfo'
import { APP_MARGIN_TOP, XPRA_PARAMS, ROUTE_PREFIX, DRAWER_WIDTH } from '../constants'
import { useParams } from "react-router-dom";
import { Divider, IconButton, Drawer, Box, Toolbar, CircularProgress, Modal, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ChevronLeft, ChevronRight, Menu, OpenInFull, ArrowBack, ExpandMore } from '@mui/icons-material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const Session = (): JSX.Element => {
	const fullScreenRef = useRef<HTMLIFrameElement>(null)
	const {
		containers: [containers],
		user: [user, setUser],
	} = useAppStore()

	const params = useParams();
	const theme = useTheme();
	const navigate = useNavigate();

	const [session, setSession] = useState<Container>()
	const [startApp, setStartApp] = useState<Application>()
	const [fullscreen, setFullscreen] = useState(false)
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [showWedavForm, setShowWedavForm] = useState(false)

	const sessions = containers?.filter(c => c.type === ContainerType.SESSION)


	useEffect(() => {
		document.body.classList.add('body-fixed')
		return () => {
			document.body.classList.remove('body-fixed')
		}
	}, []);

	// Check for XPra readiness
	useEffect(() => {
		if (intervalRef.current || !session?.url)
			return

		intervalRef.current = setInterval(() => {
			fetch(session.url).then(result => {

				if (result.status === 200) {

					if (intervalRef.current)
						clearInterval(intervalRef.current)

					setSessionIsAlive(true)
				}
			})

		}, 1000)
		return () => {
			if (intervalRef.current)
				clearInterval(intervalRef.current)
		}
	}, [session]);

		// get session and its children apps from params
	useEffect(() => {
		const s = containers?.find(c => c.id === params.id)
		if (s) { // && (s.id !== session?.id)) {
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
			return;
		}

		setShowWedavForm(false)
		createApp(session, user, startApp.name)

		// Remove password after use
		const { password, ...nextUser } = user
		setUser(nextUser)
		setStartApp(undefined)
	}, [user])

	const handleToggleApp = (app: Application) => {

		const targetApp = session?.apps?.find(a => a.app === app.name)
		if (targetApp) {
			stopApp(session?.id || '', user?.uid || '', targetApp.id)

			return
		}

		setStartApp(app)
		setShowWedavForm(true)
	}

	const handleDrawerOpen = () => {
		setDrawerOpen(true);
	};

	const handleDrawerClose = () => {
		setDrawerOpen(false);
	};

	const handleBackLocation = () => {
		navigate(`${ROUTE_PREFIX}/`)
	}

	const handleOnChange = (event: SelectChangeEvent) => {
		const sessionId = event.target.value as string
		navigate(`${ROUTE_PREFIX}/sessions/${sessionId}`)
	};

	const AppBar = styled(MuiAppBar, {
		shouldForwardProp: (prop) => prop !== 'open',
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
	}));

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const modalStyle = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 200,
		bgcolor: 'background.paper',
		border: '1px solid #333',
		boxShadow: 4,
		p: 4,
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<Modal
				open={showWedavForm}
				onClose={() => setShowWedavForm(false)}
			>
				<Box sx={modalStyle}>
					<WebdavForm />
				</Box>
			</Modal>
			<AppBar position="fixed" open={drawerOpen} sx={{
				marginTop: `${APP_MARGIN_TOP}px`,
			}}>
				<Toolbar>
					<IconButton color="inherit"
						aria-label="go back"
						onClick={handleBackLocation}>
						<ArrowBack />
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
					<FormControl>
						<Select
							id="session-select"
							IconComponent={() => <ExpandMore />}
							value={session?.id || ''}
							onChange={handleOnChange}
							sx={{ color: 'white' }}
						>
							{
								sessions?.map(s => <MenuItem value={s?.id} key={s?.id}>{`Session #${s?.name}`}</MenuItem>)
							}
						</Select>
					</FormControl>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						color="inherit"
						aria-label="fullscreen"
						onClick={() => setFullscreen(!fullscreen)}
						sx={{ mr: 2 }}
					>
						<OpenInFull />
					</IconButton>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="end"
						sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
					>
						<Menu />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Box>
				{!session && (
					<div style={{
						border: 'solid 1px gray',
						width: '100vw',
						height: '100vh',
						backgroundColor: '#333',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<CircularProgress size={32} />
					</div>
				)}
				{session &&
					<iframe
						ref={fullScreenRef}
						title='Live Session'
						src={`${session.url}?${XPRA_PARAMS}`}
						allowFullScreen
						style={{
							border: 'solid 1px gray',
							width: '100vw',
							height: '100vh',
							backgroundColor: '#333',
							marginTop: '36px'
						}}
					/>
				}
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
				variant="persistent"
				open={drawerOpen}
				elevation={100}
			>
				<DrawerHeader>
					<IconButton
						color="inherit"
						aria-label="fullscreen"
						onClick={() => setFullscreen(!fullscreen)}
						sx={{ mr: 2 }}
					></IconButton>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</DrawerHeader>
				<SessionInfo session={session} />
				<Divider />
				<AppList session={session} handleToggleApp={handleToggleApp} />
			</Drawer>
		</Box >
	)
}

export default Session
