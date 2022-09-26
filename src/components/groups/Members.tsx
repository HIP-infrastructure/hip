import * as React from 'react'
import { Chat } from '@mui/icons-material'
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import { Group, User } from '../../api/types'

const Members = ({ group, users }: { group?: Group; users?: User[] }) => {
	return (
		<>
			{!group && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			{group && users && (
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
					key={`members-${group.label}`}
				>
					<Box sx={{ position: 'relative' }}>
						<CardMedia
							component='img'
							height='160'
							src={`${process.env.REACT_APP_GATEWAY_API}/public/media/2825956551_neural_pathway__medical__futuristic__lots_of_neurons_and_dendrites__human__photo_realistic__picture_of_the_day.png`}
							alt={group.label}
							title={group.label}
						/>
					</Box>
					<CardContent>
						<Typography sx={{ mb: 2 }} variant='h5' gutterBottom>
							Members
						</Typography>

						<Stack spacing={1}>
							{users?.map(user => (
								<Box
									key={user.id}
									sx={{
										display: 'flex ',
										gap: 2,
										justifyContent: 'space-between',
									}}
								>
									<Stack>
										<Typography variant='subtitle1'>
											{user.displayName}
										</Typography>
										<Typography variant='body2'>{user.email}</Typography>
									</Stack>

									<IconButton
										color='primary'
										onClick={() => {
											window.open(`/u/${user.id}`, '_blank')
										}}
										aria-label={`Chat with ${user.displayName}`}
									>
										<Chat />
									</IconButton>
								</Box>
							))}
						</Stack>
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default Members
