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
import { BIDSDataset, ContainerType, HIPCenter, User } from '../../api/types'
import { useNotification } from '../../hooks/useNotification'
import { useAppStore } from '../../Store'
import TitleBar from '../UI/titleBar'
import DataCard from './Cards/DataCard'
import MainCard from './Cards/MainCard'
import MembersCard from './Cards/MembersCard'
import ToolsCard from './Cards/ToolsCard'
import { linkStyle } from '../../constants'
import { getAllBidsDataset } from '../../api/bids'
import { API_GATEWAY } from '../../api/gatewayClientAPI'

const Workspace = ({ centerId }: { centerId:any }) => {
	const params = useParams()
	if (!centerId && params.centerId) centerId = params.centerId
	const { showNotif } = useNotification()
	// const { trackEvent } = useMatomo()
	const {
		centers: [centers],
		containers: [containers],
		users: [users],
		user: [user],
	} = useAppStore()

	const [center, setCenter] = useState<HIPCenter | undefined>()
	const [bidsDatasets, setBidsDatasets] = useState<BIDSDataset[]>()

	useEffect(() => {
		if (!user?.uid) return

		getAllBidsDataset(user?.uid)
			.then(datasets => {
				if (datasets) setBidsDatasets(datasets)
			})
			.catch(e => {
				showNotif(e.message, 'error')
			})
	}, [user])

	useEffect(() => {
		if (!centerId) return

		const center = centers
			?.filter(c => c.id === centerId)
			?.find((_, i) => i === 0)

		setCenter(center)
	}, [centers, centerId])

	const sessions = containers?.filter(c => c.type === ContainerType.DESKTOP)
	const isMember = center && user?.groups?.includes(center?.id)

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<TitleBar
					title={`${center?.label ?? ''} Private Workspace`}
					description={''}
				/>
			</Box>
			{isMember && (
				<Typography sx={{ color: 'secondary.light' }} gutterBottom variant='h6'>
					Welcome {user?.displayName}
				</Typography>
			)}

			{!center && (
				<Box>
					<Card
						sx={{
							width: 320,
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
							<Typography
								sx={{ mt: 1, color: 'secondary.light' }}
								variant='body2'
							>
								It looks like you don&apos;t belong to any group yet. Please
								contact{' '}
								<Link
									target={'_blank'}
									href={'mailto:support@thehip.app'}
									style={linkStyle}
								>
									support@thehip.app
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
								{center && users && (
									<MembersCard
										group={center}
										users={users.filter(u => u.groups?.includes(center.id))}
									/>
								)}
							</Box>
							<Box sx={{ gridColumn: '1', gridRow: '2' }}>
								<ToolsCard />
							</Box>
							<Box sx={{ gridColumn: '3', gridRow: '1 / 3' }}>
								{bidsDatasets && (
									<DataCard bidsDatasets={bidsDatasets} sessions={sessions} />
								)}
							</Box>
						</>
					)}
					{!isMember && (
						<>
							<Box sx={{ gridColumn: '2', gridRow: '1 / 3' }}>
								{center && users && (
									<MembersCard
										group={center}
										users={users.filter(u => u.groups?.includes(center.id))}
									/>
								)}
							</Box>
						</>
					)}
				</Box>
			</Box>
		</>
	)
}

export default Workspace
