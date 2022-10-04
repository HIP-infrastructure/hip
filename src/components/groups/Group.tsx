// import { useMatomo } from '@jonkoops/matomo-tracker-react'
import * as React from 'react'
import { Box, FormControlLabel, Grid, Switch, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUser, getUsersForGroup } from '../../api/gatewayClientAPI'
import { ContainerType, HIPGroup, User } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../store/appProvider'
import TitleBar from '../UI/titleBar'
import Data from './Data'
import MainCard from './MainCard'
import Members from './Members'
import Tools from './Tools'

const isFulfilled = <T,>(
	p: PromiseSettledResult<T>
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled'

const isRejected = <T,>(
	p: PromiseSettledResult<T>
): p is PromiseRejectedResult => p.status === 'rejected'

const Dashboard = () => {
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		groups: [groups, setGroups],
		user: [user],
		debug: [debug, setDebug],
	} = useAppStore()

	const { showNotif } = useNotification()
	const [id, setId] = useState<string | undefined>()
	const [group, setGroup] = useState<HIPGroup | undefined>()

	// const { trackEvent } = useMatomo()

	const { id: incomingId } = useParams()

	const processPromises = async (
		center: HIPGroup,
		requests: Promise<User>[]
	) => {
		const results = await Promise.allSettled(requests)
		
		if (!results) return

		const users = results.filter(isFulfilled).map(p => p.value).filter(u => u.enabled)
		const rejectedReasons = results.filter(isRejected).map(p => p.reason)

		if (rejectedReasons.length > 0) {
			showNotif(rejectedReasons.toString(), 'error')
		}

		setGroups(groups =>
			(groups || []).map(group =>
				group.id === center.id ? { ...center, users } : group
			)
		)
	}

	useEffect(() => {
		if (!incomingId || incomingId === id) return
		setId(incomingId)
	}, [id])

	useEffect(() => {
		const center = groups
			?.filter(group => group.id === id)
			?.find((_, i) => i === 0)

		if (!center) return

		if (!center?.users) {
			getUsersForGroup(center.id)
				.then(users => {
					const requests = users.map(user => getUser(user))
					processPromises(center, requests)
				})
				.catch(err => {
					showNotif(err.message, 'error')
				})
		}

		if (center) setGroup(center)
	}, [id, groups, processPromises])

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
					<Box sx={{
						display: 'flex',
						justifyContent: 'start',
						alignItems: 'start',
					}}>
						<Box sx={{
							flex: isMember ? '2 1 0%' : '0 1 0%',
							display: 'flex',
							justifyContent: 'start',
							gap: '32px 32px',
							flexWrap: 'wrap',
							alignItems: 'start',
						}}>
							<MainCard group={group} />
							{isMember && <Data bidsDatasets={bidsDatasets} sessions={sessions} />}
							{debug && isMember && <Tools />}
						</Box>
						<Box sx={{ ml: isMember ? 0: 4, flex: '1 0 0%'}}>
							<Members group={group} users={group?.users} />
						</Box>
					</Box>
			</Box>

			<Box sx={{ ml: 2, mt: 8 }}>
				<FormControlLabel
					control={<Switch checked={debug} onChange={() => setDebug(!debug)} />}
					label='Debug'
				/>
			</Box>
		</>
	)
}

export default Dashboard
