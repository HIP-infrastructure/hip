import { Box } from '@mui/material'
import * as React from 'react'
import TechnicalDocumentation from '../assets/documentation__technical.png'
import UserDocumentation from '../assets/documentation__user.png'
import WebsiteDocumentation from '../assets/documentation__website.png'
import TitleBar from './UI/titleBar'
import DocCard from './UI/DocCard'

const Documentation = () => {
	const docs = [
		{
			label: 'HIP User Documentation',
			buttonLabel: 'User Documentation',
			url: `https://hip-infrastructure.github.io/`,
			description:
				'HIP guides, tutorials, datasets, Troubleshooting, FAQ and apps',
			image: UserDocumentation,
			credit:
				'Photo by Maksym Kaharlytskyi on Unsplash, https://unsplash.com/@qwitka',
		},
		{
			label: 'HIP Technical Documentation',
			buttonLabel: 'Technical Documentation',
			url: `https://github.com/HIP-infrastructure/hip-doc`,
			description: 'Architecture, Components, GitHub repositories',
			image: TechnicalDocumentation,
			credit:
				'Photo by Maksym Kaleidico on Unsplash, https://unsplash.com/@kaleidico',
		},
		{
			label: 'HIP Website',
			buttonLabel: 'Website',
			url: `https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/`,
			description: 'HIP official webpage on the Human Brain Project',
			image: WebsiteDocumentation,
			credit:
				'Photo by Austin Chan on Unsplash, https://unsplash.com/@austinchan',
		},
	]

	return (
		<>
			<TitleBar title='Documentation' />

			<Box sx={{ width: 0.75, mt: 4 }}>
				<Box
					sx={{
						display: 'flex',
						width: '75vw',
						justifyContent: 'start',
						gap: '64px 64px',
						alignItems: 'start',
					}}
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
