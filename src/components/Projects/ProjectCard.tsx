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
	// Description for collaborative projects in the all collab projects page
	return (
		<NavLink to={`${ROUTE_PREFIX}/projects/${project.name}`}>
			<Card elevation={3} component={Paper} sx={{ width: 280, height: 340 }}>
				<CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography variant='h6'>{project?.title.replace(/-/g, ' ')}</Typography>
						<Avatar
							sx={{ bgcolor: '#174040', width: 48, height: 48 }}
							aria-label='project'
						>
							{project?.title[0]}
						</Avatar>
					</Box>

					<Typography
						sx={{ mt: 2, mb: 2 }}
						variant='body2'
						color='text.secondary'
					>
						{project?.description}
					</Typography>
					
					<Typography sx={{ mb: 2 }} variant='body2' color='text.secondary'>
						{`Owner: ${projectAdmins?.map(u => u.displayName).join(', ')}`}
					</Typography>

					<Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
						<Typography variant='subtitle1'>Members</Typography>
						<Stack
							sx={{
								flex: 1,
								overflowY: 'auto',
								'&::-webkit-scrollbar': {
									width: '6px',
								},
								'&::-webkit-scrollbar-track': {
									background: '#f1f1f1',
									borderRadius: '10px',
								},
								'&::-webkit-scrollbar-thumb': {
									background: '#888',
									borderRadius: '10px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: '#555',
								},
							}}
						>
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
					</Box>
				</CardContent>
			</Card>
		</NavLink>
	)
}

export default ProjectCard
