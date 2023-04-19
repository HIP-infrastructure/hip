import {
	Avatar,
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	Link,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { HIPProject, User } from '../../api/types'
import { nameToColor } from '../theme'
import * as React from 'react'
import UserInfo from '../UI/UserInfo'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PREFIX } from '../../constants'

interface Props {
	project: HIPProject
	users: User[]
}

const ProjectCard = ({ project, users }: Props) => {
	const navigate = useNavigate()

	const projectAdmins = [...(project?.admins || [])].map(
		u =>
			users?.find(user => user.id === u) || {
				id: u,
				name: u,
				displayName: u,
			}
	)

	return (
		<Card elevation={3} component={Paper} sx={{ width: 320 }}>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: '#174040' }} aria-label='recipe'>
						{project?.title[0]}
					</Avatar>
				}
				// action={
				// 	<IconButton aria-label='settings'>
				// 		<MoreVert />
				// 	</IconButton>
				// }
				title={project?.title}
				subheader={`Owner: ${projectAdmins?.map(u => u.displayName).join(', ')}`}
			/>
			<CardMedia
				sx={{
					background: `linear-gradient(to top, ${nameToColor(
						project.title,
						'33'
					)}), url(/api/v1/public/media/3537726782_synapses__technology__meta___database__information__network__neural_path__futuristic_and_medical__re.png) no-repeat top center`,
				}}
				component='img'
				height='160'
				alt=''
			/>
			<CardContent>
				<Typography
					sx={{ mb: 2 }}
					variant='body2'
					gutterBottom
					color='text.secondary'
				>
					{project?.description}
				</Typography>
				{/* <Stack sx={{ mb: 2 }}>
					<Typography variant='subtitle1'>Admin</Typography>
					{project?.admins?.length === 0 && (
						<Typography variant='subtitle1'>No admin yet</Typography>
					)}
					{projectAdmins?.map(u => (
						<Box
							key={u.id}
							display='flex'
							justifyContent='space-between'
							alignItems='center'
						>
							<UserInfo key={u.id} user={u} />
						</Box>
					))}
				</Stack> */}
				<Stack>
					<Typography variant='subtitle1'>Members</Typography>
					{project?.members?.length === 0 && (
						<Typography variant='subtitle1'>No members yet</Typography>
					)}
					{[...(project?.members || [])]
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
			<Box sx={{ flexGrow: 1 }}></Box>
			<CardActions disableSpacing>
				<IconButton
					aria-label='go to project'
					onClick={() => navigate(`${ROUTE_PREFIX}/projects/${project.name}`)}
				>
					<Link />
				</IconButton>
			</CardActions>
		</Card>
	)
}

export default ProjectCard
