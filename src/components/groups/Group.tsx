import * as React from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, getUsersForGroup } from '../../api/gatewayClientAPI'
import { ContainerType, Group, User } from '../../api/types'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import MainCard from './MainCard'
import Members from './Members'
import Data from './Data'

const Dashboard = () => {
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		groups: [groups],
		user: [user],
	} = useAppStore()

	const [userIds, setUserIds] = useState([])
	const [users, setUsers] = useState<User[]>([])
	const [group, setGroup] = useState<Group | undefined>()

	const { trackEvent } = useMatomo()
	const navigate = useNavigate()

	const { id } = useParams()

	useEffect(() => {
		setUsers([])
		setUserIds([])
		setGroup(undefined)
		const center = groups
			?.filter(group => group.id === id)
			?.find((_, i) => i === 0)

		if (center) setGroup(center)
	}, [id])

	useEffect(() => {
		if (!group) return

		getUsersForGroup(group.label).then(({ users }) => {
			setUserIds(users)
		})
	}, [group])

	useEffect(() => {
		if (!userIds) return

		userIds.map(user => {
			getUser(user).then(user => {
				if (!user) return

				setUsers(users => [...users, user])
			})
		})
	}, [userIds])

	const sessions = containers?.filter(c => c.type === ContainerType.SESSION)
	const isMember = group && user?.groups?.includes(group?.id)

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<TitleBar
					title={`${group?.label || ''} Private Space`}
					description={''}
				/>
			</Box>
			{isMember && (
				<Typography
					sx={{ color: 'secondary.light' }}
					gutterBottom
					variant='h6'
				>
					Welcome {user?.displayName}
				</Typography>
			)}

			{groups && !group && (
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					You don't seem to belong to any group. Please contact your
					administrator.
				</Typography>
			)}

			<Grid item xs={12}>
				<Grid container spacing={3}>
					<Grid item xs={3}>
						<MainCard group={group} />
					</Grid>
					<Grid item xs={3}>
						<Members group={group} users={users} />
					</Grid>
					<Grid item xs={3}>
						{isMember && (
							<Data bidsDatasets={bidsDatasets} sessions={sessions} />
						)}
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default Dashboard
