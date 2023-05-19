import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Switch,
	Typography,
} from '@mui/material'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { linkStyle } from '../../constants'
import { useAppStore } from '../../Store'
import { Help } from '@mui/icons-material'

function GettingStartedCard({
	step,
	title,
	subtitle,
	description,
	img,
	video,
	link,
	linkName,
}: any) {
	return (
		<Card sx={{ width: 360, textAlign: 'center', alignSelf: 'stretch' }}>
			{img && (
				<CardMedia
					component='img'
					height='222'
					image={`/api/v1/public/media/${img}`}
					sx={{ borderBottom: '1px solid #e0e0e0' }}
				/>
			)}
			{video && (
				<CardMedia
					component='video'
					height='222'
					autoPlay
					src={`/api/v1/public/media/${video}`}
					controls
				/>
			)}

			<CardContent sx={{ textAlign: 'center' }}>
				<Box
					display='flex'
					gap='32px 32px'
					justifyContent='center'
					alignItems='center'
					sx={{ mb: 2 }}
				>
					<Avatar>{step}</Avatar>
				</Box>
				<Typography sx={{ mt: 2 }} variant='h5' component='div'>
					{title}
				</Typography>

				<Typography sx={{ mb: 2 }} variant='body2' color='text.secondary'>
					{subtitle}
				</Typography>

				<Typography variant='body2' color='text.secondary'>
					{description}
				</Typography>
			</CardContent>
			<Box sx={{ flexGrow: 1 }}></Box>
			<CardActions
				sx={{
					display: 'flex',
					justifyContent: 'end',
					alignItems: 'end',
				}}
			>
				{link && (
					<Button
						size='small'
						color='primary'
						onClick={() => {
							window.location.href = link
						}}
					>
						{linkName || 'Documentation'}
					</Button>
				)}
			</CardActions>
		</Card>
	)
}

const GettingStarted = (): JSX.Element => {
	const {
		tooltips: [showTooltip, setShowTooltip],
	} = useAppStore()

	return (
		<Box>
			<Box sx={{ width: 240 }}>
				<ListItemButton onClick={() => setShowTooltip(!showTooltip)}>
					<ListItemIcon>
						<Help />
					</ListItemIcon>
					<ListItemText primary='Show tooltips' />
					<Switch checked={showTooltip} />
				</ListItemButton>
			</Box>
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Box sx={{ textAlign: 'center' }}>
					<Typography variant='h4' sx={{ mb: 2, color: 'secondary.main' }}>
						Getting started
					</Typography>

					<Typography sx={{ mb: 4, color: 'secondary.main', width: '600' }}>
						Follow these steps to get started with the HIP
					</Typography>
				</Box>

				<Box sx={{ mb: 4, textAlign: 'center', justifyContent: 'stretch' }}>
					<Box
						display='flex'
						gap='64px 64px'
						justifyContent='center'
						alignItems='start'
					>
						<GettingStartedCard
							step={1}
							title='Upload'
							subtitle="Transfer your data to your center's workspace"
							description={
								'Upload up to 1TB directly from the web. Use Nextcloud client for more'
							}
							video='getting-started-upload.mp4'
							link={
								'https://hip-infrastructure.github.io/build/html/guides/GUIDE_How_to_prepare_and_upload_data_to_the_HIP.html'
							}
						/>
						<GettingStartedCard
							step={2}
							title='Process'
							subtitle='Use a Desktop App to process your data.'
							description={'Use Desktops and run applications'}
							img='gettingstarted-2.png'
							link='https://hip-infrastructure.github.io/build/html/guides/GUIDE_How_to_use_Desktops_and_run_applications_from_the_App_Catalog.html'
						/>
						<GettingStartedCard
							step={3}
							title='Collaborate'
							subtitle='Share your data within projects'
							description={
								<Box>
									Convert your files to BIDS (get{' '}
									<NavLink
										style={linkStyle}
										to={`/call/yizibxg5`}
									>
										support
									</NavLink>
									), and transfer your subject to your collaborative project
								</Box>
							}
							img='gettingstarted-3.png'
							link='https://hip-infrastructure.github.io/build/html/guides/GUIDE_How_to_use_the_HIP_spaces_and_share_data_with_other_users.html'
						/>
					</Box>
				</Box>
			</Box>

			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Box sx={{ textAlign: 'center' }}>
					<Typography variant='h4' sx={{ mb: 2, color: 'secondary.main' }}>
						Community
					</Typography>

					<Typography sx={{ mb: 4, color: 'secondary.main', width: '600' }}>
						Join the community to get support and contribute to the platform
					</Typography>
				</Box>

				<Box sx={{ mb: 4, textAlign: 'center' }}>
					<Box
						display='flex'
						gap='64px 64px'
						justifyContent='center'
						alignItems='start'
					>
						<GettingStartedCard
							step={1}
							title='Find your community'
							subtitle='Find your center and join the community'
							description={''}
							img='gettingstarted_community1.png'
						/>
						<GettingStartedCard
							step={2}
							title='Collaborate'
							subtitle='Interact with your team, users of other centers, share documents.'
							description={'Use the chat to ask questions and share your work.'}
							img='gettingstarted-3.png'
						/>
						<GettingStartedCard
							step={3}
							title='Get Support'
							subtitle='Use the support chat to ask questions and get help'
							img='gettingstarted-1.png'
							link={'/call/yizibxg5'}
							linkName='Support'
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default GettingStarted
