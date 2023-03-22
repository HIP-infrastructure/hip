import { Box, CircularProgress, Typography } from '@mui/material'
import * as React from 'react'
import { useAppStore } from '../../Store'
import TitleBar from '../UI/titleBar'
import CenterCard from './CenterCard'

const Centers = (): JSX.Element => {
	const {
		centers: [centers],
	} = useAppStore()

	return (
		<>
			<TitleBar title={'Centers Private Workspaces'} description={'Our center workspace provides a secure platform for medical centers to store and process sensitive patient data with privacy at the forefront.'} />

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{!centers && (
					<CircularProgress
						size={32}
						color='secondary'
						sx={{ top: 10, left: 10 }}
					/>
				)}
				{centers?.length === 0 && (
					<Box
						sx={{
							mt: 4,
						}}
					>
						<Typography variant='subtitle1' gutterBottom>
							There is no center to show
						</Typography>
						{/* <Button
							variant='contained'
							color='primary'
							onClick={createNewSession}
						>
							Create Desktop
						</Button> */}
					</Box>
				)}
				{centers?.map(center => (
					<CenterCard key={center.id} group={center} />
				))}
			</Box>
		</>
	)
}

export default Centers
