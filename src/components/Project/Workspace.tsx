import { Chat } from '@mui/icons-material'
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Typography,
} from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_GATEWAY, getUsers } from '../../api/gatewayClientAPI'
import { BIDSDataset, ContainerType, User } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import Modal, { ModalComponentHandle } from '../UI/Modal'
import TitleBar from '../UI/titleBar'
import DataCard from './DataCard'
import ProjectCard from './ProjectCard'
import {
	addUserToProject,
	deleteProject,
	getProjects,
	getUserProjects,
} from '../../api/projects'
import { ROUTE_PREFIX } from '../../constants'
import UserInfo from '../UI/UserInfo'
import MemberCard from './MemberCard'

const ProjectDashboard = () => {
	const navigate = useNavigate()
	const params = useParams()
	const { showNotif } = useNotification()

	const modalRef = useRef<ModalComponentHandle>(null)
	const [datasets, setDatasets] = React.useState<
		{ data?: BIDSDataset[]; error?: string } | undefined
	>()
	const [isAddingUser, setIsAddingUser] = React.useState(false)
	const [users, setUsers] = React.useState<User[]>([])
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		user: [user],
		userProjects: [userProjects, setUserProjects],
		projects: [projects, setProjects],
	} = useAppStore()

	// React.useEffect(() => {
	// 	if (!user?.uid) return
	// 	getProjectDatasets(user?.uid).then(datasets => {
	// 		setDatasets({ data: datasets })
	// 	})
	// }, [user?.uid])

	useEffect(() => {
		getUsers().then(users => setUsers(users))
	}, [])

	const handleAddUserToProject = (userId: string) => {
		if (!project?.name) return

		addUserToProject(userId, project.name)
			.then(() => {
				showNotif('User added', 'success')
				setIsAddingUser(false)

				if (user?.uid) {
					getUserProjects(user.uid).then(projects => {
						setUserProjects(projects)
					})
				}
			})
			.catch(e => {
				showNotif(`${e}`, 'error')
			})
	}

	const confirmRemoveUserFromProject = async (userId: string) => {
		if (!modalRef.current) return

		const reply = await modalRef.current.open(
			'Remove user ?',
			'Permanently remove this user from project ?'
		)

		if (reply) {
			confirmRemoveUserFromProject(userId)
				.then(res => {
					showNotif('User removed', 'success')

					// TODO: update the project
					// if (user?.uid) {
					// 	getUserProjects(user?.uid).then(projects => {
					// 		setUserProjects(projects)
					// 	})
					// }
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
				.catch(error => showNotif(error, 'error'))
		}
	}

	const servers = containers?.filter(c => c.type === ContainerType.DESKTOP)

	const project = userProjects?.find(
		project => project.name === params?.projectId
	)

	return (
		<>
			<Modal ref={modalRef} />
			<Box sx={{ mb: 2 }}>
				<TitleBar
					title={`Collaborative Workspace: ${project?.title || ''} `}
					description={project?.description}
				/>

				<Typography sx={{ color: 'secondary.light' }} gutterBottom variant='h6'>
					Welcome {user?.displayName}
				</Typography>
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
						<Box sx={{ gridColumn: '1', gridRow: '2' }}>{/* <Tools /> */}</Box>
						<Box sx={{ gridColumn: '3', gridRow: '1 / 3' }}>
							<DataCard
								project={project}
								bidsDatasets={datasets}
								sessions={servers}
							/>
						</Box>
					</>
				</Box>
			</Box>
		</>
	)
}

export default ProjectDashboard
