import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getProject } from '../../api/projects'
import { useAppStore } from '../../Store'

const Project = () => {
	const params = useParams()
	const {
		userProjects: [userProjects, setUserProjects],
	} = useAppStore()

	// Get Data for the project
	useEffect(() => {
		if (!params.projectId) return

		// looking for the full project data, with members
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

	return <Outlet />
}

export default Project
