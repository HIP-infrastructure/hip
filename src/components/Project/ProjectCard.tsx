import * as React from 'react'
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	Typography,
} from '@mui/material'
import { ROUTE_PREFIX } from '../../constants'
import { useNavigate } from 'react-router-dom'
import { deleteProject, getProjects, getUserProjects } from '../../api/projects'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import { API_GATEWAY } from '../../api/gatewayClientAPI'

const MainCard = ({ group }: { group?: any }) => {
	const navigate = useNavigate()
	const { showNotif } = useNotification()
	const {
		user: [user],
		projects: [projects, setProjects],
		userProjects: [_, setUserProjects],
	} = useAppStore()

	const handleDeleteProject = (name: string) => {
		deleteProject(name).then(res => {
			showNotif('Project deleted', 'success')

			if (user?.uid) {
				getUserProjects(user?.uid).then(projects => {
					setUserProjects(projects)
				})
				getProjects().then(projects => {
					setProjects(projects)
				})
				navigate(`${ROUTE_PREFIX}/collaborative`)
			}
		})
	}

	return (
		<>
			{!group && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			{group && (
				<Card
					sx={{
						width: 320,
						height: 440,
					}}
					key={`center-${group.label}`}
				>
					<CardMedia
						component='img'
						height='160'
						src={`${API_GATEWAY}/public/media/1375898092_synapses__data___database__information__network__neural_path__futuristic_and_medical__realistic__8k__pic_of_the_day.png`}
						alt={group.label}
						title={group.label}
					/>

					<CardContent>
						<Typography variant='h5'>{group?.title}</Typography>

						<Typography
							sx={{ mt: 2 }}
							gutterBottom
							variant='body2'
							color='text.secondary'
						>
							{group.description}
						</Typography>

						<Typography variant='subtitle2'>{group.admins}</Typography>
					</CardContent>
					<CardActions sx={{ p: 2 }}>
						{group?.admins?.includes(user?.uid) && (
							<Button
								onClick={() => handleDeleteProject(group.name)}
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
