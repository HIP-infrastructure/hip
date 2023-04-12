import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useAppStore } from '../../Store'
import LandingCard from '../UI/LandingCard'

const LandingPage = (): JSX.Element => {
	const {
		user: [user],
	} = useAppStore()
	return (
		<div>
			<div>
				<Box sx={{ mb: 4 }}>
					<Typography variant='h4' sx={{ color: 'secondary.main' }}>
						The Human Intracerebral EEG Platform
					</Typography>
					<Typography
						gutterBottom
						variant='h5'
						sx={{ color: 'secondary.main' }}
					>
						The HIP - a platform for state-of-the-art processing and
						international sharing of Human intracerebral EEG data
					</Typography>
					<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
						Welcome {user?.displayName}
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						gutterBottom
						variant='h5'
						sx={{ color: 'secondary.main' }}
					>
						Quick Start
					</Typography>
					<Box
						display='flex'
						gap='16px 16px'
						justifyContent='center'
						alignItems='center'
					>
						<LandingCard
							title='1. Upload patient data into your Private Workspace'
							description={
								<Box sx={{ ml: 2 }}>
									<ol>
										<li>Use Desktops to process data</li>
										<li>Create BIDS Datasets, import data to BIDS</li>
									</ol>
								</Box>
							}
						/>
						<LandingCard
							title='2. Transform your data into BIDS Format'
							description={
								<Box sx={{ ml: 2 }}>
									<ol>
										<li>Transform your patient data into a BIDS participant</li>
									</ol>
								</Box>
							}
						/>
						<LandingCard
							title='3. Work in collaborative workspace'
							description={
								<Box sx={{ ml: 2 }}>
									<ol>
										<li>Transfer BIDS Participants to your project</li>
										<li>
											Share your data with the general scientific community.
										</li>
									</ol>
								</Box>
							}
						/>
					</Box>
				</Box>
				<Box sx={{ mt: 4 }}>
					<p>
						Our platform is designed to help clinicians and researchers explore
						the spatiotemporal dynamics of neural functions through the analysis
						of intracerebral electroencephalogram (iEEG) data. Here&apos;s a
						quick overview of the HIP&apos;s features and benefits.
					</p>
					<h2>Data Management</h2>
					<p>
						The HIP provides a secure and optimized platform for collecting,
						managing, and analyzing multi-scale iEEG data. Users can upload and
						store their data in their personal space and choose to share it with
						other HIP users in the collaborative space. The platform also
						supports anonymization and pseudonymization to ensure data privacy
						and security.
					</p>
					<h2>Easy-to-use Interface</h2>
					<p>
						The HIP&apos;s browser-based interface is user-friendly and does not
						require programming skills. Users can easily select and customize
						the tools they need to investigate the spatiotemporal dynamics of
						neural processes.
					</p>
					<h2>Collaborative Projects</h2>
					<p>
						The HIP provides three different workspaces to support different
						levels of collaboration: personal, collaborative, and public spaces.
						Users can share their data in the collaborative space to work on
						specific projects with other HIP users. The public space is
						available for sharing anonymized data with the general scientific
						community.
					</p>
					<h2>Increased Analysis Power</h2>
					<p>
						By combining data from multiple centers, the HIP allows users to
						increase the power of their analysis and advance the understanding
						of brain function. With the HIP, users can gain quick and easy
						access to iEEG visuals and results, enabling them to make more
						informed decisions and conduct more robust research.
					</p>
				</Box>
			</div>
		</div>
	)
}

export default LandingPage
