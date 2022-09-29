import { PlayCircleOutlined, StopCircleOutlined } from '@mui/icons-material'
import {
	Alert,
	Avatar,
	CircularProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
} from '@mui/material'
import { Application, Container, ContainerState } from '../api/types'
import { color, loading } from '../api/utils'
import { useAppStore } from '../store/appProvider'
import SmallToolTip from './UI/smallToolTip'
import React from 'react'

interface Session {
	session?: Container
	handleToggleApp?: (app: Application) => void
}

const AppList = ({ session, handleToggleApp }: Session) => {
	const { availableApps } = useAppStore()

	const appInSession = ({ name }: { name: string }) =>
		session?.apps?.find(s => s.app === name)

	const AppAvatar = ({ name, label }: { name: string; label?: string }) => (
		<Avatar
			alt={label}
			src={`${process.env.REACT_APP_GATEWAY_API}/public/media/${name}__logo.png`}
			sx={{ width: 32, height: 32 }}
		/>
	)

	const AppState = ({ state }: { state?: ContainerState }) => {
		if (!state) return <PlayCircleOutlined color='primary' />

		if (loading(state)) return <CircularProgress size={16} />

		if (state === ContainerState.RUNNING)
			return <StopCircleOutlined color={color(state)} />

		return <PlayCircleOutlined color='primary' />
	}

	const Button = ({ app }: { app: Application }) => {
		const startedApp = appInSession({ name: app.name })
		const label = `${
			startedApp?.state === ContainerState.RUNNING ? 'Stop' : 'Start'
		} ${app.label}`

		return (
			<SmallToolTip title={app.description} placement='right' arrow>
				<ListItemButton
					sx={{ cursor: 'pointer' }}
					aria-label={label}
					disabled={session?.state !== ContainerState.RUNNING}
					onClick={() => handleToggleApp && handleToggleApp(app)}
				>
					<ListItemAvatar>
						<AppAvatar name={app.name} label={app.label} />
					</ListItemAvatar>
					<ListItemText primary={app.label} />
					<AppState state={startedApp?.state} />
				</ListItemButton>
			</SmallToolTip>
		)
	}

	return (
		<List
			sx={{
				mb: 6,
				width: '100%',
				maxWidth: 360,
				bgcolor: 'background.paper',
				position: 'relative',
				overflow: 'auto',
				'& ul': { padding: 0 },
			}}
			subheader={<li />}
		>
			<ListItem sx={{ fontSize: 22 }}>Applications</ListItem>
			{availableApps?.error && availableApps?.error && (
				<Alert severity='error'>{availableApps?.error.message}</Alert>
			)}
			{availableApps?.data?.map(app => (
				<Button app={app} key={app.name} />
			))}
		</List>
	)
}

export default AppList
