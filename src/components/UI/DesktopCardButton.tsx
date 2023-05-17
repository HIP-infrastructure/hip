import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia, Tooltip,
	Typography
} from '@mui/material'
import DesktopImage from '../../assets/session-thumbnail-empty.png'
import * as React from 'react'

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
			<Tooltip title={`Create new Desktop`} placement='bottom'>
				<CardMedia
					sx={{
						cursor: 'pointer',
					}}
					component='img'
					height='140'
					src={DesktopImage}
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
							Desktop
						</Typography>
					</Box>
				</Box>
				<Typography variant='caption' gutterBottom component='div'>
					You don&apos;t have any desktop running.
				</Typography>
			</>
		</CardContent>
		<CardActions sx={{ justifyContent: 'end', pr: 2 }}>
			<Button variant='contained' color='primary' onClick={createNewDesktop}>
				Create Desktop
			</Button>
		</CardActions>
	</Card>
)

DesktopCardButton.displayName = 'DesktopCardButton'
export default DesktopCardButton
