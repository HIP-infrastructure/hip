import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Link,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Switch,
	Typography,
} from '@mui/material'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PREFIX } from '../../constants'
import { useAppStore } from '../../Store'
import { Help } from '@mui/icons-material'

function GettingStartedCard({
	step,
	title,
	subtitle,
	description,
	img,
	link,
}: any) {
	const {
		tooltips: [showTooltip, setShowTooltip],
	} = useAppStore()

	return (
		<Card sx={{ width: 360, textAlign: 'center' }}>
			<CardContent sx={{ textAlign: 'center' }}>
				<Typography sx={{ mt: 2 }} variant='h5' component='div'>
					{title}
				</Typography>

				<Typography sx={{ mb: 2 }} variant='body2' color='text.secondary'>
					{subtitle}
				</Typography>
				<Box
					display='flex'
					gap='32px 32px'
					justifyContent='center'
					alignItems='center'
					sx={{ mb: 2 }}
				>
					<Avatar>{step}</Avatar>
				</Box>
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
				<Button
					size='small'
					color='primary'
					onClick={() => {
						window.open(link)
					}}
				>
					Documentation
				</Button>
			</CardActions>
			<CardMedia
				component='img'
				height='222'
				image={`/api/v1/public/media/${img}`}
				alt='green iguana'
			/>
		</Card>
	)
}

const GettingStarted = (): JSX.Element => {
	const navigate = useNavigate()

	const {
		user: [user],
		tooltips: [showTooltip, setShowTooltip],
	} = useAppStore()

	return (
		<Box>
			<List sx={{ float: 'right', width: 200}}>
				<ListItemButton onClick={() => setShowTooltip(!showTooltip)}>
					<ListItemIcon>
						<Help />
					</ListItemIcon>
					<ListItemText primary='Tooltips' />
					<Switch checked={showTooltip} />
				</ListItemButton>
			</List>
			<Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#efefef' }}>
				<Box sx={{ mt: 3, textAlign: 'center' }}>
					<Typography variant='h4' sx={{ mb: 2, color: 'secondary.main' }}>
						Getting started
					</Typography>

					<Typography sx={{ mb: 4, color: 'secondary.main', width: '600' }}>
						Follow these steps to get started with the HIP
					</Typography>
				</Box>

				<Box sx={{ mb: 4, textAlign: 'center' }}>
					<Box
						display='flex'
						gap='32px 32px'
						justifyContent='center'
						alignItems='start'
					>
						<GettingStartedCard
							step={1}
							title='Upload'
							subtitle='Transfer your data your center"s workspace'
							description={
								'Upload data directly from the web browser or using the Nextcloud client.'
							}
							img='gettingstarted-1.png'
							link={
								'https://hip-infrastructure.github.io/build/html/guides/GUIDE_How_to_prepare_and_upload_data_to_the_HIP.html'
							}
						/>
						<GettingStartedCard
							step={2}
							title='Process'
							subtitle='Use a Desktop App to process your data'
							description={
								'Use Desktops and run applications from the App Catalog'
							}
							img='gettingstarted-2.png'
							link='https://hip-infrastructure.github.io/build/html/guides/GUIDE_How_to_use_Desktops_and_run_applications_from_the_App_Catalog.html'
						/>
						<GettingStartedCard
							step={3}
							title='Collaborate'
							subtitle='Share your data within projects'
							description={
								'Once converted to BIDS, you can transfer subjects to your collaborative project'
							}
							img='gettingstarted-3.png'
							link='https://hip-infrastructure.github.io/build/html/guides/GUIDE_How_to_use_the_HIP_spaces_and_share_data_with_other_users.html'
						/>
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					mt: 4,
					textAlign: 'center',
					width: '400',
				}}
			>
				<Typography variant='h4' sx={{ mb: 2, color: 'secondary.main' }}>
					Next
				</Typography>

				<Grid
					container
					rowSpacing={1}
					columnSpacing={{ xs: 1, sm: 2, md: 3, width: '500' }}
				>
					<Grid item xs={12}>
						<Typography sx={{ mt: 2 }} variant='h6'>
							<Link onClick={() => navigate(`${ROUTE_PREFIX}/documentation`)}>
								Documentation
							</Link>
						</Typography>
						<Typography sx={{ mb: 4, color: 'secondary.main' }}>
							User Documentation. Technical Documentation
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography sx={{ mt: 2 }} variant='h6'>
							<Link onClick={() => navigate(`${ROUTE_PREFIX}/about`)}>
								About the HIP
							</Link>
						</Typography>
						<Typography sx={{ mb: 4, color: 'secondary.main' }}>
							A platform for processing and sharing intracerebral EEG data
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography sx={{ mt: 2 }} variant='h6'>
							<Link onClick={() => navigate(`${ROUTE_PREFIX}/about`)}>
								Onboarding guide
							</Link>
						</Typography>
						<Typography sx={{ mb: 4, color: 'secondary.main' }}>
							A quick overview of the platform.
						</Typography>
					</Grid>
				</Grid>
			</Box>
		</Box>
	)
}

export default GettingStarted
