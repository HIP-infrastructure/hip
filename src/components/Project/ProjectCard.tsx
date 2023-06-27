import * as React from 'react'
import {
	Box,
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
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { LoadingButton } from '@mui/lab'
import { useEffect } from 'react'

interface Props {
	project: HIPProject
	handleRemoveProject: (id: string) => void
	users: User[]
}

const MainCard = ({ project, users, handleRemoveProject }: Props) => {
	const { trackEvent } = useMatomo()
	const {
		user: [user],
	} = useAppStore()
	const [loading, setLoading] = React.useState(false)

	useEffect(() => {
		setLoading(false)
	}, [project])

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
						<Box sx={{ mb: 2 }}>
							<Typography variant='h5'>{project?.title}</Typography>
							<Typography
								sx={{ mt: 2 }}
								gutterBottom
								variant='body2'
								color='text.secondary'
							>
								{project.description}
							</Typography>
						</Box>

						<Stack spacing={1}>
							{project?.admins?.length === 0 && (
								<Typography variant='subtitle2'>No admin yet</Typography>
							)}
							{[...(project?.admins || [])]
								.map(
									u =>
										users.find(user => user.id === u) || {
											id: u,
											name: u,
											displayName: u,
										}
								)
								.map(u => (
									<Box
										key={u.id}
										display='flex'
										justifyContent='space-between'
										alignItems='center'
									>
										<UserInfo key={u.id} user={u} />
									</Box>
								))}
						</Stack>
					</CardContent>
					<CardActions sx={{ p: 2 }}>
						{user?.uid && project?.admins?.includes(user?.uid) && (
							<LoadingButton
								disabled={loading}
								loading={loading}
								onClick={() => {
									setLoading(true)
									handleRemoveProject(project.name)
									trackEvent({
										category: 'Project',
										action: 'Remove project',
										name: `project/${project.name}`,
									})
								}}
								variant='outlined'
							>
								Delete Project
							</LoadingButton>
						)}
					</CardActions>
				</Card>
			)}
		</>
	)
}

export default MainCard
