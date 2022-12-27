import { Box } from '@mui/material';
import * as React from 'react'
import { useAppStore } from '../../store/appProvider'
import CenterCard from './CenterCard'

const Centers = (): JSX.Element => {
	const {
		user: [user],
		hIPCenters: [centers],
	} = useAppStore()

	return centers ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
        {centers.map(center => (
				<CenterCard key={center.id} group={center} />
			))}
		</Box>
	) : (
		<>Loading</>
	)
}

export default Centers
