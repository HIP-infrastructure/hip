import * as React from 'react'
// import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUser, getUsersForGroup } from '../../api/gatewayClientAPI'
import { ContainerType, Group, User } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import Data from './Data'
import MainCard from './MainCard'
import Members from './Members'

const Dashboard = () => {
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		groups: [groups],
		user: [user],
	} = useAppStore()

	const { showNotif } = useNotification()
	const [userIds, setUserIds] = useState([])
	const [users, setUsers] = useState<User[]>([])
	const [group, setGroup] = useState<Group | undefined>()

	// const { trackEvent } = useMatomo()

	const { id } = useParams()

	useEffect(() => {
		setUsers([])
		setUserIds([])
		setGroup(undefined)
		const center = groups
			?.filter(group => group.id === id)
			?.find((_, i) => i === 0)

		if (center) setGroup(center)
	}, [id, groups])

	useEffect(() => {
		if (!group) return

		getUsersForGroup(group.id)
			.then(({ users }) => {
				setUserIds(users)
			})
			.catch(err => {
				showNotif(err.message, 'error')
			})
	}, [group, showNotif])

	useEffect(() => {
		if (!userIds) return

		userIds.forEach(user => {
			getUser(user)
				.then(user => {
					if (!user) return

					setUsers(users => [...users, user])
				})
				.catch(err => {
					showNotif(err.message, 'error')
				})
		})
	}, [userIds, showNotif])

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
				<Typography sx={{ color: 'secondary.light' }} gutterBottom variant='h6'>
					Welcome {user?.displayName}
				</Typography>
			)}

			{groups && !group && (
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					You don&apos;t seem to belong to any group. Please contact your
					administrator.
				</Typography>
			)}

			<Box sx={{ width: 0.75, mt: 4 }}>
				<Box
					sx={{
						display: 'flex',
						width: '75vw',
						justifyContent: 'start',
						flexWrap: 'wrap',
						gap: '32px 32px',
						alignItems: 'start',
					}}
				>
					<MainCard group={group} />
					{isMember && <Data bidsDatasets={bidsDatasets} sessions={sessions} />}
					<Members group={group} users={users} />
				</Box>
			</Box>
		</>
	)
}

export default Dashboard
