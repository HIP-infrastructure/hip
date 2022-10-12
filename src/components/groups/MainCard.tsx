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
	Link,
	Typography,
} from '@mui/material'
import { HIPGroup } from '../../api/types'

const linkStyle = {
	textDecoration: 'underline',
	color: '#0277bd',
}

const MainCard = ({ group }: { group?: HIPGroup }) => {
	const SocialButton = ({ network, url }: { network: string; url: string }) => {
		let component
		switch (network) {
			case 'facebook':
				component = <Facebook />
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
						width: 320,
						height: 440,
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
						<Typography variant='h5'>{group?.label}</Typography>

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
								<Link href={group.website} target='_blank' style={linkStyle}>
									{group.website}
								</Link>
							</Typography>
						)}

						<Box sx={{ mt: 2, display: 'flex', justifyContent: 'start' }}>
							{group.socialnetwork &&
								Object.keys(group.socialnetwork).map(
									(key) =>
										key && (
											<SocialButton
												key={key}
												network={key}
												url={group.socialnetwork[key]}
											></SocialButton>
										)
								)}
						</Box>
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default MainCard
