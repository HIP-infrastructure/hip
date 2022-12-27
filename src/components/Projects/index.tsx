import { Box } from '@mui/material'
import * as React from 'react'
import { useAppStore } from '../../store/appProvider'
import ProjectCard from './ProjectCard'

const Projects = () => {
	const {
		user: [user],
		hIPProjects: [projects],
	} = useAppStore()

	return projects ? (
		<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
			{projects.map(project => (
				<ProjectCard key={project.id} project={project} />
			))}
		</Box>
	) : (
		<>Loading</>
	)
}

export default Projects
