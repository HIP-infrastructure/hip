import { Box, Button, CircularProgress, Typography } from '@mui/material'
import * as React from 'react'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import ProjectCard from './ProjectCard'
import { ROUTE_PREFIX } from '../../constants'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../../api/projects'

const Projects = () => {
	const navigate = useNavigate()
	const {
		user: [user],
		projects: [projects, setProjects],
	} = useAppStore()

	React.useEffect(() => {
		getProjects().then(projects => {
			setProjects(projects)
		})
	}, [])

	return (
		<>
			<TitleBar
				title={'Projects Collaborative Workspaces'}
				description={
					'Collaborate on projects with ease in our secure workspace. Sensitive data remains protected and accessible only to authorized members.'
				}
				button={
					<Box sx={{ display: 'flex' }}>
						<Button
							variant='contained'
							color='primary'
							onClick={() =>
								navigate(`${ROUTE_PREFIX}/collaborative/create`)
							}
						>
							Create Project
						</Button>
					</Box>
				}
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
						{/* <Button
							variant='contained'
							color='primary'
							onClick={createNewSession}
						>
							Create Desktop
						</Button> */}
					</Box>
				)}
				{projects?.map(project => (
					<ProjectCard key={project.name} project={project} />
				))}
			</Box>
		</>
	)
}

export default Projects
