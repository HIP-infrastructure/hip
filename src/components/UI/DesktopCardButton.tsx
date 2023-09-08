import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Tooltip,
	Typography,
} from '@mui/material'
import * as React from 'react'
import { API_GATEWAY } from '../../api/gatewayClientAPI'

interface Props {
	createNewDesktop: () => void
}

const DesktopCardButton = ({ createNewDesktop }: Props) => (
	<Card
		sx={{
			width: 320,
			display: 'flex',
			flexDirection: 'column',
		}}
	>
		<Box sx={{ position: 'relative' }}>
			<Tooltip title={`Create new Workbench`} placement='bottom'>
				<CardMedia
					sx={{
						cursor: 'pointer',
					}}
					component='img'
					height='140'
					src={`${API_GATEWAY}/public/media/session-thumbnail-empty.png`}
					alt={`CreateDesktop`}
					onClick={createNewDesktop}
				/>
			</Tooltip>
		</Box>
		<CardContent sx={{ flexGrow: 1 }}>
			<>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						verticalAlign: 'top',
					}}
				>
					<Box>
						<Typography sx={{ fontSize: 14 }}>...</Typography>
						<Typography variant='h5' component='div'>
							Workbench
						</Typography>
					</Box>
				</Box>
				<Typography variant='caption' gutterBottom component='div'>
					You don&apos;t have any workbench running.
				</Typography>
			</>
		</CardContent>
		<CardActions sx={{ justifyContent: 'end', pr: 2 }}>
			<Button variant='contained' color='primary' onClick={createNewDesktop}>
				Create Workbench
			</Button>
		</CardActions>
	</Card>
)

DesktopCardButton.displayName = 'DesktopCardButton'
export default DesktopCardButton
