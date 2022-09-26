import * as React from 'react'
import {
	Facebook,
	Instagram,
	Language,
	LinkedIn,
	Twitter,
	YouTube,
} from '@mui/icons-material'
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Group } from '../../api/types'

const linkStyle = {
	textDecoration: 'underline',
	color: '#0277bd',
}

const MainCard = ({ group }: { group?: Group }) => {
	const SocialButton = ({ network, url }: { network: string; url: any }) => {
		let component
		switch (network) {
			case 'facebook':
				component = (
					<Facebook
						onClick={() => {
							window.open(`${url}`, '_blank')
						}}
					/>
				)
				break

			case 'twitter':
				component = <Twitter />
				break

			case 'instagram':
				component = <Instagram />
				break

			case 'linkedin':
				component = <LinkedIn />
				break

			case 'youtube':
				component = <YouTube />
				break

			default:
				component = <Language />
				break
		}
		return (
			<IconButton
				aria-label={network}
				size='small'
				onClick={() => {
					window.open(`${url}`, '_blank')
				}}
			>
				{component}
			</IconButton>
		)
	}

	return (
		<>
			{!group && (
				<CircularProgress
					size={32}
					color='secondary'
					sx={{ position: 'absolute', top: 10, left: 10 }}
				/>
			)}

			{group && (
				<Card
					sx={{
						display: 'flex',
						width: 320,
						flexDirection: 'column',
					}}
					key={`center-${group.label}`}
				>
					<CardMedia
						component='img'
						height='160'
						src={`${process.env.REACT_APP_GATEWAY_API}/public/${group.logo}`}
						alt={group.label}
						title={group.label}
					/>

					<CardContent>
						<Box
							sx={{
								display: 'flex',
								direction: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Stack>
								<Typography variant='h5' gutterBottom>
									{group?.label}
								</Typography>

								<Typography
									sx={{ mt: 2 }}
									gutterBottom
									variant='body2'
									color='text.secondary'
								>
									{group.description}
								</Typography>

								<Typography variant='subtitle2'>{group.pi}</Typography>
								<Typography variant='body2' gutterBottom>
									{group.city}, {group.country}
								</Typography>

								{group.website && (
									<Typography
										sx={{ wordWrap: 'break-word' }}
										gutterBottom
										variant='caption'
										color='text.secondary'
									>
										<Link to={group.website} target='_blank' style={linkStyle}>
											{group.website}
										</Link>
									</Typography>
								)}

								<Box sx={{ mt: 2, display: 'flex', justifyContent: 'start' }}>
									{group.socialnetwork &&
										Object.keys(group.socialnetwork).map(
											(key: any) =>
												key && (
													<SocialButton
														network={key}
														url={group.socialnetwork[key]}
													></SocialButton>
												)
										)}
								</Box>
							</Stack>
						</Box>
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default MainCard
