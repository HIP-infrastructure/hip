import { Box, Typography } from '@mui/material'
import { useAppStore } from '../store/appProvider'
import AboutCard from './UI/AboutCard'
import * as React from 'react'

export interface Doc {
	label: string
	subtitle?: string
	buttonLabel?: string
	url?: string
	route?: string
	description: string
	image?: string
	credit: string
	state?: string
}

const spaces: Doc[] = [
	{
		label: 'About the HIP',
		buttonLabel: 'More...',
		url: 'https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/',
		description:
			'The HIP is an open-source platform designed for large scale and optimized collection, storage, curation, sharing and analysis of multiscale Human iEEG data at the international level',
		image: 'public/media/discover_about.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art https://www.midjourney.com/',
		state: 'beta',
	},
	{
		label: 'Quick Start',
		buttonLabel: 'Onboarding Guide',
		url: 'https://hip-infrastructure.github.io/build/html/hip_beta_onboarding.html',
		description:
			'See the onboarding guide for a quick overview of the platform.',
		image: 'public/media/discover_onboarding.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
		state: 'beta',
	},
	// {
	// 	label: 'Beta Release Notes',
	// 	buttonLabel: 'More...',
	// 	url: `${ROUTE_PREFIX}/private/sessions`,
	// 	description: 'This is a beta release of our software. Please note that there may be bugs and glitches. We would appreciate your feedback so that we can improve the software for the next release. Thank you!',
	// 	image: 'public/media/discover_release.png',
	// 	credit: 'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
	// 	state: 'beta',
	// },
	// {
	// 	label: 'Collaborate ',
	// 	buttonLabel: 'more...',
	// 	url: `${ROUTE_PREFIX}/private/sessions`,
	// 	description:
	// 		'How to interact with your team, users of other centers, create shared documents,or even initiate projects.',
	// 	image: 'public/media/discover_collaborate.png',
	// 	credit: 'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
	// 	state: 'beta',
	// },
	{ 
		label: 'Support',
		buttonLabel: 'Support',
		url: `https://thehip.app/call/yizibxg5`,
		description:
			'If you have any questions or need help, please contact us through the chat. We will be happy to help you!',
		image: 'public/media/3929266907_two_angels_communicating__neural_pathway__consciousness__neurons_and_dendrites__photo_realistic__blue__picture_of_the_day.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
		state: 'beta',
	},
	{
		label: "Users' Feedback ",
		subtitle: 'Bug reports, feature requests, and general feedback',
		buttonLabel: 'Feedback',
		url: `/apps/forms/`,
		description:
			'Hi! We would love to get feedback from our users about our product. Please leave a review or contact us through this form. Thank you!',
		image: 'public/media/discover_feedback.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
		state: 'beta',
	},
	
]

const About = () => {
	const {
		user: [user],
	} = useAppStore()

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
