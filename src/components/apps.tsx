import {
	Alert,
	Box,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Divider,
	Link,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useAppStore } from '../store/appProvider'
import TitleBar from './UI/titleBar'

const Apps = () => {
	const { availableApps } = useAppStore()

	return (
		<>
			<TitleBar
				title={'App Catalog'}
				description={
					'A list of all the applications made available to the HIP users. The applications can be started from an existing desktop. Software and applications contained in the HIP are made available pursuant to the terms of their respective licenses.'
				}
			/>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{availableApps?.error && availableApps?.error && (
					<Alert severity='error'>{availableApps?.error.message}</Alert>
				)}
				{availableApps?.data?.map((app, i) => (
					<Card
						sx={{ maxWidth: 288, display: 'flex', flexDirection: 'column' }}
						key={app.name}
					>
						<CardMedia
							component='img'
							height='140'
							src={`${process.env.REACT_APP_GATEWAY_API}/public/media/288x140-${app.name}__logo.png`}
							alt={app.label}
						/>
						<Divider />
						<CardContent sx={{ flexGrow: 1, pb: 0, mb: 0 }}>
							<Box sx={{ display: 'flex' }}>
								<Typography variant='h5' sx={{ flex: 1 }}>
									{app.label}
								</Typography>

								<Chip
									label={app.state}
									color={
										app.state === 'ready'
											? 'success'
											: app.state === 'beta'
											? 'warning'
											: 'error'
									}
									variant='outlined'
								/>
							</Box>
							<Typography gutterBottom variant='caption'>
								version: {app.version}
							</Typography>
							<Typography
								sx={{ mb: 2, mt: 2 }}
								gutterBottom
								variant='body2'
								color='text.secondary'
							>
								{app.description}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{ wordWrap: 'break-word' }}
							>
								<Link href={app.url} target='_blank'>
									{app.url}
								</Link>
							</Typography>
						</CardContent>
					</Card>
				))}
			</Box>
		</>
	)
}

export default Apps
