import { Box } from '@mui/material'
import * as React from 'react'
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
			image: 'public/media/documentation_user.png',
			credit: 'Midjourney https://www.midjourney.com/',
		},
		{
			label: 'HIP Technical Documentation',
			buttonLabel: 'Technical Documentation',
			url: `https://github.com/HIP-infrastructure/hip-doc`,
			description: 'Architecture, Components, GitHub repositories',
			image: 'public/media/documentation_tech.png',
			credit: 'Midjourney https://www.midjourney.com/',
		},
		{
			label: 'HIP Website',
			buttonLabel: 'Website',
			url: `https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/`,
			description: 'HIP official webpage on the Human Brain Project',
			image: 'public/media/documentation_website.png',
			credit: 'Midjourney https://www.midjourney.com/',
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
						flexWrap: 'wrap',
						gap: '32px 32px',
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
