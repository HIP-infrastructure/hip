import * as React from 'react'
import { Box } from '@mui/material'
import { HIPProject } from '../../api/types'

const ProjectCard = ({ project }: { project: HIPProject }) => (
	<Box>{project.label}</Box>
)

export default ProjectCard
