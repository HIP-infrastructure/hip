import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	Divider,
	Link,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import { API_GATEWAY } from '../../api/gatewayClientAPI'
import TitleBar from '../UI/titleBar'
import React from 'react'
import { ROUTE_PREFIX, SERVICES, ISERVICE } from '../../constants'
import { useNavigate } from 'react-router-dom'

const Services = () => {
	const navigate = useNavigate()

	const goto = (service: ISERVICE) => {
		if (service.target === '_blank') {
			window.open(service.url, '_blank')
			return
		}

		navigate(`${ROUTE_PREFIX}/services/${service.id}`)
	}

	return (
		<>
			<TitleBar
				title={'Services Catalog'}
				description={'A list of all the services made available to the users.'}
			/>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{SERVICES?.map((service, i) => (
					<Card
						sx={{
							cursor: 'pointer',
							width: 288,
							display: 'flex',
							flexDirection: 'column',
						}}
						key={service.label}
						onClick={() => {
							goto(service)
						}}
					>
						<CardMedia
							component='img'
							height='140'
							src={`${API_GATEWAY}/public/media/288x140-${service.image}__logo.png`}
							alt={service.label}
							sx={{ cursor: 'pointer' }}
						/>
						<Divider />
						<CardContent sx={{ cursor: 'pointer', flexGrow: 1, pb: 0, mb: 0 }}>
							<Box sx={{ display: 'flex' }}>
								<Typography variant='h5' sx={{ flex: 1 }}>
									{service.label}
								</Typography>
							</Box>
							<Typography
								sx={{ mb: 2, mt: 2 }}
								gutterBottom
								variant='body2'
								color='text.secondary'
							>
								{service.description}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{ wordWrap: 'break-word' }}
							>
								<Link href={service.url} target='_blank'>
									{service.url}
								</Link>
							</Typography>
						</CardContent>
						<CardActions sx={{ p: 2 }}>
							<Button
								onClick={() => {
									goto(service)
								}}
							>
								Open Service
							</Button>
						</CardActions>
					</Card>
				))}
			</Box>
		</>
	)
}

export default Services
