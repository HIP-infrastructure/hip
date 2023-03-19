import React, { useEffect, useRef } from 'react'
import { TrackEventParams } from '@jonkoops/matomo-tracker-react/lib/types'
import {
	Clear,
	Pause,
	PowerSettingsNew,
	Replay,
	Visibility,
} from '@mui/icons-material'
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material'
import {
	forceRemoveAppsAndDesktop,
	pauseAppsAndDesktop,
	resumeAppsAndDesktop,
} from '../../api/remoteApp'
import { Container, ContainerState } from '../../api/types'
import { loading } from '../../api/utils'
import DesktopImage from '../../assets/session-thumbnail.png'
import DesktopInfo from './DesktopInfo'

interface Props {
	desktop: Container
	userId: string
	handleOpenDesktop: (id: string) => void
	confirmRemove: (id: string) => void
	trackEvent: (params: TrackEventParams) => void
	debug: boolean
}

const DesktopCard = ({
	desktop,
	userId,
	handleOpenDesktop,
	confirmRemove,
	debug,
	trackEvent,
}: Props) => (
	<Card
		sx={{
			width: 320,
			display: 'flex',
			flexDirection: 'column',
		}}
	>
		<Box sx={{ position: 'relative' }}>
			<Tooltip title={`Open Desktop #${desktop.name}`} placement='bottom'>
				<CardMedia
					sx={{
						cursor:
							desktop.state !== ContainerState.RUNNING ? 'default' : 'pointer',
					}}
					component='img'
					height='140'
					src={DesktopImage}
					alt={`Open ${desktop.name}`}
					onClick={() =>
						desktop.state === ContainerState.RUNNING &&
						handleOpenDesktop(desktop.id)
					}
				/>
			</Tooltip>
			{[
				loading(desktop.state),
				...(desktop.apps?.map((app: Container) => loading(app.state)) || []),
			].reduce((p, c) => p || c, false) && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}
		</Box>
		<CardContent sx={{ flexGrow: 1 }}>
			<DesktopInfo desktop={desktop} />

			<Typography
				sx={{ mt: 2 }}
				gutterBottom
				variant='body2'
				color='text.secondary'
			>
				{desktop.error?.message}
				{desktop.apps?.map((app: Container) => (
					<span key={app.name}>
						<strong>{app.name}</strong>: {app.state}
						<br />
						{app.error?.message}
					</span>
				))}
			</Typography>
		</CardContent>
		<CardActions sx={{ justifyContent: 'end', pr: 2 }}>
			<Tooltip title='Remove' placement='top'>
				<span>
					<IconButton
						disabled={debug || desktop.state !== ContainerState.DESTROYED}
						edge='end'
						color='primary'
						aria-label='Remove'
						onClick={() => {
							forceRemoveAppsAndDesktop(desktop.id)
						}}
					>
						<Clear />
					</IconButton>
				</span>
			</Tooltip>

			<Tooltip title='Shut down' placement='top'>
				<span>
					<IconButton
						disabled={desktop.state !== ContainerState.RUNNING}
						edge='end'
						color='primary'
						aria-label='Shut down'
						onClick={() => {
							confirmRemove(desktop.id)
						}}
					>
						<PowerSettingsNew />
					</IconButton>
				</span>
			</Tooltip>

			{desktop.state === ContainerState.PAUSED && (
				<Tooltip title='Resume the desktop' placement='top'>
					<IconButton
						edge='end'
						color='primary'
						aria-label='Resume'
						onClick={y => {
							resumeAppsAndDesktop(desktop.id, userId || '')

							trackEvent({
								category: 'server',
								action: 'resume',
							})
						}}
					>
						<Replay />
					</IconButton>
				</Tooltip>
			)}

			{desktop.state !== ContainerState.PAUSED && (
				<Tooltip
					title='Pause the desktop. You can resume it later'
					placement='top'
				>
					<span>
						<IconButton
							disabled={desktop.state !== ContainerState.RUNNING}
							edge='end'
							color='primary'
							aria-label='pause'
							onClick={() => {
								pauseAppsAndDesktop(desktop.id, userId || '')
								trackEvent({
									category: 'server',
									action: 'pause',
								})
							}}
						>
							<Pause />
						</IconButton>
					</span>
				</Tooltip>
			)}

			<Tooltip title='Open' placement='top'>
				<span>
					<IconButton
						disabled={desktop.state !== ContainerState.RUNNING}
						sx={{ ml: 0.6 }}
						edge='end'
						color='primary'
						aria-label='Open'
						onClick={() => {
							handleOpenDesktop(desktop.id)
						}}
					>
						<Visibility />
					</IconButton>
				</span>
			</Tooltip>
		</CardActions>
	</Card>
)

DesktopCard.displayName = 'DesktopCard'
export default DesktopCard
