import * as React from 'react'
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	Stack,
	Typography,
} from '@mui/material'
import { useAppStore } from '../../Store'
import { API_GATEWAY } from '../../api/gatewayClientAPI'
import { HIPProject, User } from '../../api/types'
import UserInfo from '../UI/UserInfo'

interface Props {
	project: HIPProject
	confirmRemove: (id: string) => void
	users: User[]
}

const MainCard = ({ project, users, confirmRemove }: Props) => {
	const {
		user: [user],
	} = useAppStore()

	return (
		<>
			{!project && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			{project && (
				<Card
					sx={{
						width: 320,
						height: 440,
					}}
					key={`center-${project.title}`}
				>
					<CardMedia
						component='img'
						height='160'
						src={`${API_GATEWAY}/public/media/3537726782_synapses__technology__meta___database__information__network__neural_path__futuristic_and_medical__re.png`}
						alt={project.title}
						title={project.title}
					/>

					<CardContent>
						<Typography variant='h5'>{project?.title}</Typography>

						<Typography
							sx={{ mt: 2 }}
							gutterBottom
							variant='body2'
							color='text.secondary'
						>
							{project.description}
						</Typography>

						<Typography gutterBottom variant='subtitle2'>
							Admin
						</Typography>
						<Stack spacing={1}>
							{project?.admins?.length === 0 && (
								<Typography variant='subtitle2'>No admin yet</Typography>
							)}
							{users
								?.filter(u => [...(project?.admins || [])].includes(u.id))
								.map(user => (
									<UserInfo key={user.id} user={user} />
								))}
						</Stack>
					</CardContent>
					<CardActions sx={{ p: 2 }}>
						{user?.uid && project?.admins?.includes(user?.uid) && (
							<Button
								onClick={() => {
									confirmRemove(project.name)
								}}
								variant='outlined'
							>
								Delete Project
							</Button>
						)}
					</CardActions>
				</Card>
			)}
		</>
	)
}

export default MainCard