import { Box, Typography } from '@mui/material'
import * as React from 'react'
import DocCard, { Doc } from '../UI/DefaultCard'

const spaces: Doc[] = [
	{
		label: 'About the HIP',
		buttonLabel: 'More...',
		url: 'https://www.ebrains.eu/tools/human-intracerebral-eeg-platform',
		description:
			'The HIP is an open-source platform designed for large scale and optimized collection, storage, curation, sharing and analysis of multiscale Human iEEG data at the international level',
		image: 'public/media/discover_about.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art https://www.midjourney.com/',
		state: 'beta',
	},
	{
		label: 'Onboarding Guide',
		buttonLabel: 'guide',
		url: 'https://hip-infrastructure.github.io/user_doc.html',
		description:
			'See the onboarding guide for a quick overview of the platform.',
		image: 'public/media/discover_onboarding.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
		state: 'beta',
	},
	{
		label: 'HIP Website',
		buttonLabel: 'Website',
		url: `https://www.ebrains.eu/tools/human-intracerebral-eeg-platform`,
		description: 'HIP official webpage on EBRAINS',
		image: 'public/media/documentation_website.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
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
]

const docs = [
	{
		label: 'HIP User Documentation',
		buttonLabel: 'User Documentation',
		url: `https://hip-infrastructure.github.io/user_doc.html`,
		description: 'HIP guides, tutorials, datasets, Troubleshooting and FAQ',
		image: 'public/media/documentation_user.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
	},
	{
		label: 'HIP Technical Documentation',
		buttonLabel: 'Technical Documentation',
		url: `https://github.com/HIP-infrastructure/hip-doc`,
		description: 'Architecture, Components, GitHub repositories',
		image: 'public/media/documentation_tech.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
	},
	{
		label: 'Support',
		buttonLabel: 'Support',
		url: `https://thehip.app/call/yizibxg5`,
		target: 'self',
		description:
			'If you have any questions or need help, please contact us through the chat. We will be happy to help you!',
		image:
			'public/media/3929266907_two_angels_communicating__neural_pathway__consciousness__neurons_and_dendrites__photo_realistic__blue__picture_of_the_day.png',
		credit:
			'Image generated by Midjourney, Text-to-Image Generative Art  https://www.midjourney.com/',
		state: 'beta',
	},
]

const Documentation = () => {
	return (
		<>
			<Box sx={{ p: 4, textAlign: 'center' }}>
				<Box sx={{ textAlign: 'center' }}>
					<Typography variant='h4' sx={{ mb: 2, color: 'secondary.main' }}>
						About the HIP
					</Typography>

					<Typography sx={{ mb: 4, color: 'secondary.main', width: '600' }}>
						The HIP - a platform for state-of-the-art processing and
						international sharing of Human intracerebral EEG data
					</Typography>
				</Box>

				<Box sx={{ mb: 4, textAlign: 'center' }}>
					<Box
						display='flex'
						gap='64px 64px'
						justifyContent='center'
						alignItems='start'
					>
						{spaces?.map((doc, i) => (
							<DocCard key={doc.url} doc={doc} />
						))}
					</Box>
				</Box>
			</Box>

			<Box sx={{ mt: 3, textAlign: 'center' }}>
				<Typography variant='h4' sx={{ mb: 2, color: 'secondary.main' }}>
					Documentation
				</Typography>

				<Typography sx={{ mb: 4, color: 'secondary.main', width: '600' }}>
					User and technical doc
				</Typography>
			</Box>

			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<Box
					display='flex'
					gap='64px 64px'
					justifyContent='center'
					alignItems='start'
				>
					{docs?.map((doc, i) => (
						<DocCard key={doc.url} doc={doc} />
					))}
				</Box>
			</Box>
		</>
	)
}

export default Documentation
