import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";

import AppList from './appList'
import { useAppStore } from '../store/appProvider'
import {
	Container,
	AppContainer
} from '../api/gatewayClientAPI'
import SessionInfo from './sessionInfo'
import { APP_MARGIN_TOP, XPRA_PARAMS, ROUTE_PREFIX, DRAWER_WIDTH } from '../constants'

import { useParams } from "react-router-dom";

import { Divider, IconButton, Drawer, Box, Toolbar, CircularProgress } from '@mui/material';
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

	const [fullscreen, setFullscreen] = useState(false)
	const [inSessionPage, setInSessionPage] = useState(false)
	const [appName, setAppName] = useState('')
	const [open, setOpen] = useState(true);
	const [session, setSession] = useState<Container>()

	useEffect(() => {
		// TODO: Remove on unload
		document.body.classList.add('body-fixed')

		// get session from params
		const session = containers?.find(c => c.id === params.id)
		if (session) {
			session.apps = containers?.filter(c => c.parentId === session.id) as AppContainer[]
			setSession(session)
		}
	}, [setSession])

	useEffect(() => {
		if (inSessionPage && showWedavForm && user?.password) {
			setShowWedavForm(false)
			// if (currentSession !== null) createApp(currentSession, user, appName)

			// Remove password after use
			const { password, ...nextUser } = user
			setUser(nextUser)
			setInSessionPage(false)
		}
	}, [
		user,
		inSessionPage,
		// currentSession,
		showWedavForm,
		setShowWedavForm,
		setUser,
		setInSessionPage,
		appName,
	])

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

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleBackLocation = () => {
		navigate(`${ROUTE_PREFIX}/`)
	}

	const startAppInSession = () => {
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

	const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
		open?: boolean;
	}>(({ theme, open }) => ({
		flexGrow: 1,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginRight: `-${DRAWER_WIDTH}px`,
		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginRight: 0,
		}),
	}));

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar position="fixed" open={open} sx={{
				marginTop: `${APP_MARGIN_TOP}px`
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
			<Main open={open} sx={{ marginTop: '16px' }}>
				{!session && (
					<div className='session_iframe'>
						<div>
							<CircularProgress />
						</div>
					</div>
				)}
				{session &&
					<iframe
						ref={fullScreenRef}
						title='Live Session'
						className='session_iframe'
						src={`${session.url}?${XPRA_PARAMS}`}
						allowFullScreen
					/>
				}
			</Main>
			<Drawer
				sx={{
					width: DRAWER_WIDTH,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: DRAWER_WIDTH,
						boxSizing: 'border-box',
						top: `${APP_MARGIN_TOP}px`
					}
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
				<AppList session={session} />
			</Drawer>
		</Box >
	)
}

export default Session
