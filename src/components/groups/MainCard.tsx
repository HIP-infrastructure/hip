import * as React from 'react'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
	Facebook,
	Instagram,
	LinkedIn,
	Twitter,
	YouTube,
	Language,
} from '@mui/icons-material'
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	IconButton,
	Stack,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUser, getUsersForGroup } from '../../api/gatewayClientAPI'
import { ContainerType, Group, User } from '../../api/types'
import { useAppStore } from '../../store/appProvider'

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
				component = (
					<Twitter
						onClick={() => {
							window.open(`${url}`, '_blank')
						}}
					/>
				)
				break

			case 'instagram':
				component = (
					<Instagram
						onClick={() => {
							window.open(`${url}`, '_blank')
						}}
					/>
				)
				break

			case 'linkedin':
				component = (
					<LinkedIn
						onClick={() => {
							window.open(`${url}`, '_blank')
						}}
					/>
				)
				break

			case 'youtube':
				component = (
					<YouTube
						onClick={() => {
							window.open(`${url}`, '_blank')
						}}
					/>
				)
				break

			default:
				component = (
					<Language
						onClick={() => {
							window.open(`${url}`, '_blank')
						}}
					/>
				)
				break
		}
		return (
			<IconButton aria-label={network} size='small'>
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

								<Typography>{group.pi}</Typography>
								<Typography gutterBottom>
									{group.city}, {group.country}
								</Typography>

								{group.website && (
									<Typography gutterBottom>
										<Link to={group.website} target='_blank' style={linkStyle}>
											{group.website}
										</Link>
									</Typography>
								)}

								<Stack sx={{ mt: 2 }} direction='row' spacing={1}>
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
								</Stack>
							</Stack>
						</Box>
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default MainCard
