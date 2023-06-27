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
	Avatar,
	Box,
	Card,
	CardContent,
	CircularProgress,
	IconButton,
	Link,
	Paper,
	Typography,
} from '@mui/material'
import { HIPCenter } from '../../api/types'
import { linkStyle } from '../../constants'
import { API_GATEWAY } from '../../api/gatewayClientAPI'

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
const Center = ({ group }: { group?: HIPCenter }) => {
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
					elevation={3}
					component={Paper}
					sx={{
						width: 280,
					}}
					key={`center-${group.label}`}
				>
					<CardContent>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Typography variant='h6'>{group?.label}</Typography>
							<Avatar
								alt={group?.label}
								src={`${API_GATEWAY}/public/${group.logo}`}
								sx={{ width: 96, height: 96 }}
							/>
						</Box>
						<Typography sx={{ mt: 2 }} variant='body2' color='text.secondary'>
							{group.description}
						</Typography>
						{group.website && (
							<Box sx={{ mb: 2, mt: 2 }}>
								<Typography
									sx={{ wordWrap: 'break-word' }}
									variant='caption'
									color='text.secondary'
								>
									<Link href={group.website} target='_blank' style={linkStyle}>
										{group.website}
									</Link>
								</Typography>
							</Box>
						)}
						<Typography variant='subtitle2'>{group.pi}</Typography>
						<Typography variant='body2' gutterBottom>
							{group.city}, {group.country}
						</Typography>
					</CardContent>
					<Box sx={{ flexGrow: 1 }}></Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'start',
							flexWrap: 'wrap',
							p: 2,
						}}
					>
						{group.socialnetwork &&
							Object.keys(group.socialnetwork).map(
								key =>
									key && (
										<SocialButton
											key={key}
											network={key}
											url={
												(group.socialnetwork && group.socialnetwork[key]) || ''
											}
											aria-label={key}
										></SocialButton>
									)
							)}
					</Box>
				</Card>
			)}
		</>
	)
}

export default Center
