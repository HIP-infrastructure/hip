import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";

import AppList from './appList'
import { useAppStore } from '../store/appProvider'
import {
	Container,
	AppContainer,
	Application,
	createApp
} from '../api/gatewayClientAPI'
import WebdavForm from './webdavLoginForm'

import SessionInfo from './sessionInfo'
import { APP_MARGIN_TOP, XPRA_PARAMS, ROUTE_PREFIX, DRAWER_WIDTH } from '../constants'

import { useParams } from "react-router-dom";

import { Divider, IconButton, Drawer, Box, Toolbar, CircularProgress, Modal } from '@mui/material';
import { ChevronLeft, ChevronRight, Menu, OpenInFull, ArrowBack } from '@mui/icons-material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const Session = (): JSX.Element => {
	const fullScreenRef = useRef<HTMLIFrameElement>(null)
	const {
		showWedavForm: [showWedavForm, setShowWedavForm],
		containers: [containers],
		user: [user, setUser],
	} = useAppStore()

	const params = useParams();
	const theme = useTheme();
	const navigate = useNavigate();

	const [session, setSession] = useState<Container>()
	const [startApp, setStartApp] = useState<Application>()
	const [fullscreen, setFullscreen] = useState(false)
	const [open, setOpen] = useState(true);

	useEffect(() => {
		// TODO: Remove on unload
		document.body.classList.add('body-fixed')

		// get session from params
		const s = containers?.find(c => c.id === params.id)
		if (s && (!session || s.id === session?.id)) {
			s.apps = containers?.filter(c => c.parentId === s.id) as AppContainer[]
			setSession(s)
		}

	}, [session, setSession, containers])

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

	const handleStartApp = (app: Application) => {
		setStartApp(app)
		setShowWedavForm(true)
	}

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleBackLocation = () => {
		navigate(`${ROUTE_PREFIX}/`)
	}

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
			<AppBar position="fixed" open={open} sx={{
				marginTop: `${APP_MARGIN_TOP}px`,
			}}>
				<Toolbar>
					<IconButton color="inherit"
						aria-label="go back"
						onClick={handleBackLocation}>
						<ArrowBack />
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
					<Typography variant="h6" noWrap component="div">
						Session #{session?.name}
					</Typography>
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
						sx={{ mr: 2, ...(open && { display: 'none' }) }}
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
				open={open}
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
				<AppList session={session} handleStartApp={handleStartApp} />
			</Drawer>
		</Box >
	)
}

export default Session
