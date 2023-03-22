import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { HIPProject, User } from '../../api/types'
import { nameToColor } from '../theme'
import * as React from 'react'
import UserInfo from '../UI/UserInfo'
import { NavLink } from 'react-router-dom'
import { linkStyle, ROUTE_PREFIX } from '../../constants'

interface Props {
	project: HIPProject
	users: User[]
}

const ProjectCard = ({ project, users }: Props) => {
	return (
		<Card elevation={3} component={Paper} sx={{ width: 320, height: 440 }}>
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
				{!project.isMember && (
					<Typography variant='h5'>{project?.title}</Typography>
				)}
				{project.isMember && (
					<NavLink
						style={linkStyle}
						to={`${ROUTE_PREFIX}/projects/${project.name}`}
					>
						<Typography variant='h5'>{project?.title}</Typography>
					</NavLink>
				)}
				<Typography
					sx={{ mb: 2 }}
					variant='body2'
					gutterBottom
					color='text.secondary'
				>
					{project?.description}
				</Typography>
				<Stack spacing={1}>
					<Typography variant='h6'>Admin</Typography>
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
				<Stack spacing={1}>
					<Typography variant='h6'>Members</Typography>
					{project?.members?.length === 0 && (
						<Typography variant='subtitle2'>No members yet</Typography>
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
		</Card>
	)
}

export default ProjectCard
