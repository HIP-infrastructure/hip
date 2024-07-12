import {
	Avatar,
	Box,
	Card,
	CardActions,
	CardContent,
	IconButton,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import { HIPProject, User } from '../../api/types'
import * as React from 'react'
import UserInfo from '../UI/UserInfo'
import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTE_PREFIX } from '../../constants'
import { Link } from '@mui/icons-material'

interface Props {
	project: HIPProject
	users: User[]
}

const ProjectCard = ({ project, users }: Props) => {
	const navigate = useNavigate()

	const projectAdmins = [...(project?.admins ?? [])].map(
		u =>
			users?.find(user => user.id === u) ?? {
				id: u,
				name: u,
				displayName: u,
			}
	)

	return (
		<NavLink to={`${ROUTE_PREFIX}/projects/${project.name}`}>
			<Card elevation={3} component={Paper} sx={{ width: 280 }}>
				<CardContent>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography variant='h6'>{project?.title}</Typography>
						<Avatar
							sx={{ bgcolor: '#174040', width: 48, height: 48 }}
							aria-label='project'
						>
							{project?.title[0]}
						</Avatar>
					</Box>
					<Typography sx={{ mb: 2 }} variant='body2' color='text.secondary'>
						{`Owner: ${projectAdmins?.map(u => u.displayName).join(', ')}`}
					</Typography>

					<Typography
						sx={{ mt: 2, mb: 2 }}
						variant='body2'
						color='text.secondary'
					>
						{project?.description}
					</Typography>

					<Stack
						sx={{
							maxHeight: 240,
							display: 'flex',
							flexDirection: 'column',
							overflowY: 'scroll',
						}}
					>
						<Typography variant='subtitle1'>Members</Typography>
						{project?.members?.length === 0 && (
							<Typography variant='subtitle1'>No members yet</Typography>
						)}
						{[...(project?.members ?? [])]
							.map(
								u =>
									users.find(user => user.id === u) ?? {
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
			</Card>
		</NavLink>
	)
}

export default ProjectCard
