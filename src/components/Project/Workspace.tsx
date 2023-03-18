import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../api/gatewayClientAPI'
import {
	addUserToProject,
	deleteProject,
	getProject,
	getProjects,
	removeUserFromProject,
} from '../../api/projects'
import { ContainerType, User } from '../../api/types'
import { ROUTE_PREFIX } from '../../constants'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import Modal, { ModalComponentHandle } from '../UI/Modal'
import TitleBar from '../UI/titleBar'
import MemberCard from './MemberCard'
import ProjectCard from './ProjectCard'

const ProjectDashboard = () => {
	const navigate = useNavigate()
	const { showNotif } = useNotification()

	const modalRef = useRef<ModalComponentHandle>(null)
	const [isAddingUser, setIsAddingUser] = React.useState(false)
	const [users, setUsers] = React.useState<User[]>([])
	const {
		containers: [containers],
		user: [user],
		projects: [projects, setProjects],
		selectedProject: [project, setProject],
	} = useAppStore()

	useEffect(() => {
		getUsers().then(users => setUsers(users))
	}, [])

	const handleAddUserToProject = (userId: string) => {
		if (!project?.name) return

		addUserToProject(userId, project.name)
			.then(project => {
				showNotif('User added', 'success')
				setIsAddingUser(false)
				setProject(project)
			})
			.catch(e => {
				showNotif(`${e}`, 'error')
			})
	}

	const confirmRemoveUserFromProject = async (userId: string) => {
		if (!modalRef.current) return
		if (!project?.name) return

		const reply = await modalRef.current.open(
			'Remove user ?',
			'Permanently remove this user from project ?'
		)

		if (reply) {
			removeUserFromProject(userId, project.name)
				.then(res => {
					showNotif('User removed', 'success')
					setProject(project)
				})
				.catch(error => showNotif(error, 'error'))
		}
	}

	const confirmRemoveProject = async (projectName: string) => {
		if (!modalRef.current) return

		const reply = await modalRef.current.open(
			'Remove project ?',
			'Permanently remove this project ?'
		)

		if (reply) {
			deleteProject(projectName)
				.then(res => {
					showNotif('Project deleted', 'success')

					getProjects().then(projects => {
						setProjects(projects)
					})
					navigate(`${ROUTE_PREFIX}/collaborative`)
				})
				.catch(error => showNotif(error, 'error'))
		}
	}

	return (
		<>
			<Modal ref={modalRef} />
			<Box sx={{ mb: 2 }}>
				<TitleBar
					title={`Collaborative Workspace: ${project?.title || ''} `}
				/>

				<Box
					sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}
				>
					

					<Typography
						sx={{ color: 'secondary.light' }}
						gutterBottom
						variant='h6'
					>
						Welcome {user?.displayName}
					</Typography>

					{!project && (
						<CircularProgress
							size={32}
							color='secondary'
							sx={{ top: 10, left: 10 }}
						/>
					)}
				</Box>
				<Box sx={{ mt: 4 }}>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: '320px 320px 320px',
							gap: 4,
						}}
					>
						<Box sx={{ gridColumn: '1', gridRow: '1' }}>
							{project && (
								<ProjectCard
									project={project}
									confirmRemove={confirmRemoveProject}
									users={users}
								/>
							)}
						</Box>

						<>
							<Box sx={{ gridColumn: '2', gridRow: '1' }}>
								<MemberCard
									project={project}
									users={users}
									handleAddUserToProject={handleAddUserToProject}
									confirmRemove={confirmRemoveUserFromProject}
								/>
							</Box>
							<Box sx={{ gridColumn: '1', gridRow: '2' }}>
								{/* <Tools /> */}
							</Box>
							<Box sx={{ gridColumn: '3', gridRow: '1 / 3' }}></Box>
						</>
					</Box>
				</Box>
			</Box>
		</>
	)
}

export default ProjectDashboard
