import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getProject } from '../../api/projects'
import { useAppStore } from '../../Store'

const Project = () => {
	const params = useParams()
	const {
		selectedProject: [project, setProject],
	} = useAppStore()

	// Get Data for the project
	useEffect(() => {
		if (!params.projectId) return

		if (!project?.name || project?.name !== params.projectId) {
			setProject(null)
			getProject(params.projectId).then(project => {
				setProject(project)
			})
		}
	}, [params, project?.name, setProject])

	return <Outlet />
}

export default Project
