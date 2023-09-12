import React from 'react'
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
import { Container, ContainerState } from '../../api/types'
import { loading } from '../../api/utils'
import DesktopInfo from './DesktopInfo'
import { API_GATEWAY } from '../../api/gatewayClientAPI'

interface Props {
	desktop: Container
	handleOpenDesktop: (id: string) => void
	handleRemoveDesktop: (id: string, force?: boolean) => void
	handlePauseDesktop: (id: string) => void
	handleResumeDesktop: (id: string) => void
	debug: boolean
}

const DesktopCard = ({
	desktop,
	handleOpenDesktop,
	handleRemoveDesktop,
	handlePauseDesktop,
	handleResumeDesktop,
	debug,
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
					src={`${API_GATEWAY}/public/media/session-thumbnail${(desktop.state === ContainerState.DESTROYED || desktop.state === ContainerState.PAUSED) ? '-empty': ''}.png`}
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
					color='info'
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
			{(debug || desktop.state === ContainerState.DESTROYED) && (
				<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
					<IconButton
						disabled={!(debug || desktop.state === ContainerState.DESTROYED)}
						edge='end'
						color='primary'
						aria-label='Remove'
						onClick={() => {
							handleRemoveDesktop(desktop.id, true)
						}}
					>
						<Clear />
					</IconButton>
					<Typography variant='body2'>Remove</Typography>
				</Box>
			)}

			{desktop.state !== ContainerState.DESTROYED && (
				<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
					<IconButton
						disabled={desktop.state !== ContainerState.RUNNING}
						edge='end'
						color='primary'
						aria-label='Shut down'
						onClick={() => {
							handleRemoveDesktop(desktop.id)
						}}
					>
						<PowerSettingsNew />
					</IconButton>
					<Typography variant='body2'>Quit</Typography>
				</Box>
			)}

			{desktop.state === ContainerState.PAUSED && (
				<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
					<IconButton
						edge='end'
						color='primary'
						aria-label='Resume'
						onClick={() => {
							handleResumeDesktop(desktop.id)
						}}
					>
						<Replay />
					</IconButton>
					<Typography variant='body2'>Resume</Typography>
				</Box>
			)}

			{desktop.state !== ContainerState.PAUSED &&
				desktop.state !== ContainerState.DESTROYED && (
					<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
						<IconButton
							disabled={desktop.state !== ContainerState.RUNNING}
							edge='end'
							color='primary'
							aria-label='pause'
							onClick={() => {
								handlePauseDesktop(desktop.id)
							}}
						>
							<Pause />
						</IconButton>
						<Typography variant='body2'>Sleep</Typography>
					</Box>
				)}

			{desktop.state !== ContainerState.DESTROYED && (
				<Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
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
					<Typography variant='body2'>Open</Typography>
				</Box>
			)}
		</CardActions>
	</Card>
)

DesktopCard.displayName = 'DesktopCard'
export default DesktopCard
