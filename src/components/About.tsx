import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	Typography,
} from '@mui/material'

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ContainerType } from '../api/types'
import { ROUTE_PREFIX } from '../constants'
import { useAppStore } from '../store/appProvider'
import AboutCard from './UI/AboutCard'

const spaces = [
	{
		label: 'About',
		buttonLabel: 'More...',
		url: 'https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/',
		description: 'What is the HIP and why you would use it',
		image: 'public/media/discover_about.png',
		credit: 'Midjourney https://www.midjourney.com/',
		state: 'beta',
	},
	{
		label: 'Onboarding Guide',
		buttonLabel: 'Onboarding Guide',
		url: 'https://hip-infrastructure.github.io/build/html/hip_beta_onboarding.html',
		description:
			'See the onboarding guide for a quick overview of the platform.',
		image: 'public/media/discover_onboarding.png',
		credit: 'Midjourney https://www.midjourney.com/',
		state: 'beta',
	},
	{
		label: 'Beta Release Notes',
		buttonLabel: 'More...',
		url: `${ROUTE_PREFIX}/private/sessions`,
		description: 'Features, Know issues, roadmap',
		image: 'public/media/discover_release.png',
		credit: 'Midjourney https://www.midjourney.com/',
		state: 'beta',
	},

	{
		label: 'Collaborate ',
		buttonLabel: 'more...',
		url: `${ROUTE_PREFIX}/private/sessions`,
		description:
			'How to interact with your team, users of other centers, create shared documents,or even initiate projects.',
		image: 'public/media/discover_collaborate.png',
		credit: 'Midjourney https://www.midjourney.com/',
		state: 'beta',
	},

	{
		label: "Users' Feedback ",
		buttonLabel: 'Feedback',
		url: `${ROUTE_PREFIX}/private/sessions`,
		description: 'We need your insights!!!',
		image: 'public/media/discover_feedback.png',
		credit: 'Midjourney https://www.midjourney.com/',
		state: 'beta',
	},
]

const About = () => {
	const {
		containers: [containers],
		BIDSDatasets: [bidsDatasets],
		user: [user],
	} = useAppStore()
	const navigate = useNavigate()
	const sessions = containers?.filter(c => c.type === ContainerType.SESSION)

	return (
		<Box sx={{ width: 0.75 }}>
			<Box sx={{ mb: 4 }}>
				<Typography variant='h2' sx={{ color: 'secondary.main' }}>
					The Human Intracerebral EEG Platform
				</Typography>
				<Typography gutterBottom variant='h5' sx={{ color: 'secondary.main' }}>
					The HIP - a platform for state-of-the-art processing and international
					sharing of HUMAN intracerebral EEG data
				</Typography>
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					Welcome {user?.displayName}
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					width: '75vw',
					justifyContent: 'start',
					flexWrap: 'wrap',
					gap: '32px 32px',
					alignItems: 'start',
				}}
			>
				{spaces?.map((doc, i) => (
					<AboutCard key={doc.url} doc={doc} />
				))}
			</Box>
		</Box>
	)
}

export default About
