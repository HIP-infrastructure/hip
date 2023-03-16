// import { useMatomo } from '@jonkoops/matomo-tracker-react'
import * as React from 'react'
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Link,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_GATEWAY, getUsersForGroup } from '../../api/gatewayClientAPI'
import { ContainerType, HIPCenter } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import TitleBar from '../UI/titleBar'
import Data from './Data'
import MainCard from './MainCard'
import Members from './Members'
import Tools from './Tools'
import { linkStyle } from '../../constants'

const Workspace = () => {
	const params = useParams()
	const { showNotif } = useNotification()
	// const { trackEvent } = useMatomo()
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		centers: [centers, setCenters],
		user: [user],
	} = useAppStore()

	const [center, setCenter] = useState<HIPCenter | undefined>()

	useEffect(() => {
		if (!params.centerId) return

		const center = centers
			?.filter(c => c.id === params.centerId)
			?.find((_, i) => i === 0)

		setCenter(center)
	}, [])

	useEffect(() => {
		if (!center?.users) {
			if (!center?.id) return
			getUsersForGroup(center.id)
				.then(users => {
					setCenters(centers =>
						(centers || []).map(c =>
							c.id === center?.id ? { ...center, users } : c
						)
					)
					const center = centers
						?.filter(c => c.id === params.centerId)
						?.find((_, i) => i === 0)

					setCenter(center)
				})
				.catch(err => {
					showNotif(err.message, 'error')
				})
		}
	}, [center, setCenters, showNotif])

	const sessions = containers?.filter(c => c.type === ContainerType.DESKTOP)
	const isMember = center && user?.groups?.includes(center?.id)

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<TitleBar
					title={`${center?.label || ''} Private Workspace`}
					description={''}
				/>
			</Box>
			{isMember && (
				<Typography sx={{ color: 'secondary.light' }} gutterBottom variant='h6'>
					Welcome {user?.displayName}
				</Typography>
			)}

			{centers && center === null && (
				<Box>
					<Card
						sx={{
							width: 320,
							height: 440,
						}}
						key={`center-tools`}
					>
						<CardMedia
							component='img'
							height='160'
							src={`${API_GATEWAY}/public/media/3929266907_two_angels_communicating__neural_pathway__consciousness__neurons_and_dendrites__photo_realistic__blue__picture_of_the_day.png`}
							alt={'Access the HIP'}
							title='Image generated by DreamStudio, Text-to-Image Generative Art, https://beta.dreamstudio.ai/dream'
						/>
						<CardContent>
							<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
								It looks like you don&apos;t belong to any group yet. Please
								contact{' '}
								<Link
									target={'_blank'}
									href={'mailto:support@thehip.app'}
									style={linkStyle}
								>
									support@thehip.app
								</Link>{' '}
								or chat with our amazing{' '}
								<Link
									target={'_blank'}
									style={linkStyle}
									href={'https://thehip.app/u/sa3623'}
								>
									hip admin
								</Link>{' '}
								to fix this.
							</Typography>
						</CardContent>
					</Card>
				</Box>
			)}

			<Box sx={{ mt: 4 }}>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: '320px 320px 320px',
						gap: 4,
					}}
				>
					<Box sx={{ gridColumn: '1', gridRow: '1' }}>
						{center && <MainCard group={center} />}
					</Box>
					{isMember && (
						<>
							<Box sx={{ gridColumn: '2', gridRow: '1' }}>
								{center && <Members group={center} users={center?.users} />}
							</Box>
							<Box sx={{ gridColumn: '1', gridRow: '2' }}>
								<Tools />
							</Box>
							<Box sx={{ gridColumn: '3', gridRow: '1 / 3' }}>
								<Data bidsDatasets={bidsDatasets} sessions={sessions} />
							</Box>
						</>
					)}
					{!isMember && (
						<>
							<Box sx={{ gridColumn: '2', gridRow: '1 / 3' }}>
								{center && <Members group={center} users={center?.users} />}
							</Box>
						</>
					)}
				</Box>
			</Box>
		</>
	)
}

export default Workspace
