import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../api/gatewayClientAPI'
import {
	addUserToProject,
	deleteProject,
	getProjects,
	removeUserFromProject,
} from '../../api/projects'
import { User } from '../../api/types'
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
	const { trackEvent } = useMatomo()

	const modalRef = useRef<ModalComponentHandle>(null)
	const [users, setUsers] = React.useState<User[]>([])
	const {
		user: [user],
		projects: [_, setProjects], // eslint-disable-line @typescript-eslint/no-unused-vars
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
				// FIXME: doesn't seems to be reflected at once
				// getProject(project.name).then(project => {
					setProject(project)
				// })

				trackEvent({
					category: 'Project',
					action: 'Add user to project',
					name: `project/${project.name}`,
				})
			})
			.catch(e => {
				showNotif(`${e}`, 'error')
			})
	}

	const handleRemoveUserFromProject = async (userId: string) => {
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
					// FIXME: doesn't seems to be reflected at once
					// getProject(project.name).then(project => {
						setProject(project)
					// })

					trackEvent({
						category: 'Project',
						action: 'Remove user from project',
						name: `project/${project.name}`,
					})
				})
				.catch(error => showNotif(error, 'error'))
		}
	}

	const handleRemoveProject = async (projectName: string) => {
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
					navigate(`${ROUTE_PREFIX}/projects`)
				})
				.catch(error => showNotif(error, 'error'))
		}
	}

	return (
		<>
			<Modal ref={modalRef} />
			<Box sx={{ mb: 2 }}>
				<TitleBar title={`Collaborative Workspace: ${project?.title || ''} `} />

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
				<Box sx={{ mt: 2 }}>
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
									handleRemoveProject={handleRemoveProject}
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
									handleRemoveUserFromProject={handleRemoveUserFromProject}
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
