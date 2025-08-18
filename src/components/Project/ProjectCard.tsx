import * as React from 'react'
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	Stack,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material'
import { useAppStore } from '../../Store'
import { API_GATEWAY } from '../../api/gatewayClientAPI'
import { HIPProject, User } from '../../api/types'
import UserInfo from '../UI/UserInfo'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { LoadingButton } from '@mui/lab'
import { useEffect } from 'react'
import { Clear } from '@mui/icons-material'
import { SelectChangeEvent } from '@mui/material'

interface Props {
	project: HIPProject
	handleRemoveProject: (id: string) => void
	users: User[]
	handleAddUserToProject: (userId: string) => void
	handleRemoveUserFromProject: (userId: string) => void
}

const ProjectCard = ({ project, users, handleRemoveProject, handleAddUserToProject, handleRemoveUserFromProject }: Props) => {
	const { trackEvent } = useMatomo()
	const {
		user: [user],
	} = useAppStore()
	const [loading, setLoading] = React.useState(false)
	const [removeLoading, setRemoveLoading] = React.useState(false)
	const [userToAdd, setUserToAdd] = React.useState('')

	useEffect(() => {
		setLoading(false)
	}, [project])

	return (
		<>
			{!project && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			{project && (
				<Card
					sx={{
						width: 320,
					}}
					key={`center-${project.title}`}
				>
					<CardMedia
						component='img'
						height='160'
						src={`${API_GATEWAY}/public/media/3537726782_synapses__technology__meta___database__information__network__neural_path__futuristic_and_medical__re.png`}
						alt={project.title}
						title={project.title}
					/>

					<CardContent>
						<Stack spacing={1}>
							{users === undefined && (
								<CircularProgress
									size={16}
									color='secondary'
									sx={{ top: 10, left: 10 }}
								/>
							)}

							{project?.admins?.length === 0 && (
								<Typography variant='subtitle2'>No admin yet</Typography>
							)}
							{[...(project?.admins || [])]
								.map(u =>
									users.find(user => user.id === u) || {
										id: u,
										name: u,
										displayName: u,
									}
								)
								.map(u => (
									<Box
										key={u.id}
										display='flex'
										justifyContent='space-between'
										alignItems='center'
									>
										<UserInfo key={u.id} user={u} />
									</Box>
								))}

							{user?.uid && project?.admins?.includes(user?.uid) && (
								<LoadingButton
									disabled={loading}
									loading={loading}
									onClick={() => {
										setLoading(true)
										handleRemoveProject(project.name)
									}}
									variant='outlined'
									color="error"
									fullWidth
									size="small"
								>
									Delete Project
								</LoadingButton>
							)}

							<Typography variant='h5' sx={{ mt: 2 }}>
								Members
							</Typography>

							{[...(project?.members || [])]
								.map(u =>
									users?.find(user => user.id === u) || {
										id: u,
										name: u,
										displayName: u,
									}
								)
								.map(u => (
									<Box
										key={u.id}
										display='flex'
										justifyContent='space-between'
										alignItems='center'
									>
										<UserInfo key={u.id} user={u} />
										{user?.uid &&
											project?.admins?.includes(user.uid) &&
											user?.uid !== u.id && (
												<LoadingButton
													loading={removeLoading}
													disabled={removeLoading}
													onClick={() => {
														setRemoveLoading(true)
														handleRemoveUserFromProject(u.id)
													}}
												>
													<Clear />
												</LoadingButton>
											)}
									</Box>
								))}
						</Stack>
					</CardContent>

					<CardActions sx={{ p: 2 }}>
						{user?.uid && project?.admins?.includes(user.uid) && (
							<Box
								display='flex'
								justifyContent='space-between'
								alignItems='center'
							>
								<FormControl sx={{ m: 1, minWidth: 180 }}>
									<InputLabel variant='outlined'>Select</InputLabel>
									<Select
										size={'small'}
										onChange={(event: SelectChangeEvent<string>) => {
											setUserToAdd(event.target.value)
										}}
										MenuProps={{
											PaperProps: {
												style: {
													maxHeight: 400,
													zIndex: 1301 // Higher than AppBar's default z-index
												}
											},
											anchorOrigin: {
												vertical: 'bottom',
												horizontal: 'left',
											},
											transformOrigin: {
												vertical: 'top',
												horizontal: 'left',
											},
										}}
									>
										{users
											?.filter(user => !project?.members?.includes(user.id))
											.map(user => (
												<MenuItem key={user.id} value={user.id}>
													{user.displayName}
												</MenuItem>
											))}
									</Select>
								</FormControl>

								<LoadingButton
									disabled={loading}
									onClick={() => {
										setLoading(true)
										handleAddUserToProject(userToAdd)
									}}
									variant='outlined'
									loading={loading}
								>
									Add
								</LoadingButton>
							</Box>
						)}
					</CardActions>
				</Card>
			)}
		</>
	)
}

export default ProjectCard
