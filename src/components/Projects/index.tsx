import { Box, CircularProgress, Typography } from '@mui/material'
import * as React from 'react'
import { getUsers } from '../../api/gatewayClientAPI'
import { getProjects } from '../../api/projects'
import { User } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import TitleBar from '../UI/titleBar'
import ProjectCard from './ProjectCard'

const Projects = () => {
	const { showNotif } = useNotification()
	const [users, setUsers] = React.useState<User[]>([])

	const {
		projects: [projects, setProjects],
	} = useAppStore()

	React.useEffect(() => {
		getProjects()
			.then(projects => {
				setProjects(projects)
			})
			.catch(e => {
				showNotif(`${e}`, 'error')
			})
	}, [setProjects, showNotif])

	React.useEffect(() => {
		getUsers()
			.then(users => setUsers(users))
			.catch(e => {
				showNotif(`${e}`, 'error')
			})
	}, [setUsers, showNotif])

	return (
		<>
			<TitleBar
				title={'Collaborative Workspaces Projects'}
				description={
					'Collaborate on projects with ease in our secure workspace. Sensitive data remains protected and accessible only to authorized members.'
				}
				button={<Box sx={{ display: 'flex' }}></Box>}
			/>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{!projects && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}
				{projects?.length === 0 && (
					<Box
						sx={{
							mt: 4,
						}}
					>
						<Typography variant='subtitle1' gutterBottom>
							There is no project to show
						</Typography>
					</Box>
				)}
				{projects?.map(project => (
					<ProjectCard key={project.name} project={project} users={users} />
				))}
			</Box>
		</>
	)
}

export default Projects
