import { PlayCircleOutlined, StopCircleOutlined } from '@mui/icons-material'
import {
	Avatar,
	CircularProgress,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
} from '@mui/material'
import { Application, Container, ContainerState } from '../../api/types'
import { useAppStore } from '../../Store'
import SmallToolTip from '../UI/smallToolTip'
import React from 'react'

interface Props {
	desktop?: Container
	containers: Container[]
	handleToggleApp?: (app: Application) => void
}

const AppAvatar = ({ name, label }: { name: string; label?: string }) => (
	<Avatar
		alt={label}
		src={`${process.env.REACT_APP_GATEWAY_API}/public/media/${name}__logo.png`}
		sx={{ width: 32, height: 32 }}
	/>
)

const AppList = ({ desktop, containers, handleToggleApp }: Props) => {
	const {
		availableApps: [availableApps],
	} = useAppStore()
	const [debounce, setDebounce] = React.useState<{ [key: string]: boolean }>({})
	const apps = containers
		?.filter(a => a.parentId === desktop?.id)
		.map(app => ({
			name: app.name,
			started: app.state === ContainerState.RUNNING,
			loading:
				app.state === ContainerState.LOADING ||
				app.state === ContainerState.STOPPING,
		}))

	const availableAppsForDesktop = availableApps?.map(app => ({
		...app,
		started: apps?.find(a => a.name === app.name)?.started,
		loading: apps?.find(a => a.name === app.name)?.loading,
	}))

	return (
		<List
			sx={{
				pt: 1,
				mb: 6,
				width: '100%',
				maxWidth: 360,
				position: 'relative',
				overflow: 'auto',
				'& ul': { padding: 0 },
			}}
			subheader={<li />}
		>
			{availableAppsForDesktop?.map(app => (
				<SmallToolTip
					key={app.name}
					title={app.description}
					placement='right'
					arrow
				>
					<ListItemButton
						sx={{ cursor: 'pointer' }}
						aria-label={app.label}
						disabled={
							debounce[app.name] ||
							desktop?.state !== ContainerState.RUNNING ||
							app.loading
						}
						onClick={() => {
							handleToggleApp && handleToggleApp(app)
							setDebounce({ ...debounce, [app.name]: true })
							setTimeout(
								() =>
									setDebounce(debounce => ({
										...debounce,
										[app.name]: false,
									})),
								2 * 1000
							)
						}}
					>
						<ListItemAvatar>
							<AppAvatar name={app.name} label={app.label} />
						</ListItemAvatar>
						<ListItemText primary={app.label} />
						<ListItemSecondaryAction>
							{!app.started && !app.loading && (
								<PlayCircleOutlined color='primary' />
							)}
							{app.loading && (
								<CircularProgress
									sx={{
										position: 'absolute',
										right: '3px',
										top: '-10px',
										transform: 'translateY(-50%)',
									}}
									size={16}
								/>
							)}
							{app.started && !app.loading && (
								<StopCircleOutlined color={'secondary'} />
							)}
						</ListItemSecondaryAction>
					</ListItemButton>
				</SmallToolTip>
			))}
		</List>
	)
}

export default AppList
