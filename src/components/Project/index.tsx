import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getProject } from '../../api/projects'
import { useAppStore } from '../../Store'
import TitleBar from '../UI/titleBar'

const Project = () => {
	const params = useParams()
	const {
		userProjects: [userProjects, setUserProjects],
	} = useAppStore()

	useEffect(() => {
		if (!params.projectId) return

		const project = userProjects?.find(
			project => project.name === params?.projectId && project.members
		)

		if (!project) {
			getProject(params.projectId).then(project => {
				setUserProjects(projects =>
					projects
						? projects.map(p => (p.name === project.name ? project : p))
						: [project]
				)
			})
		}
	}, [params])

	const project = userProjects?.find(
		project => project.name === params?.projectId
	)

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<TitleBar
					title={`Collaborative Workspace: ${project?.title || ''} `}
					description={project?.description}
				/>
			</Box>
			<Outlet />
		</>
	)
}

export default Project
