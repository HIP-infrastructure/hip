import { Card, CardContent, Link, Typography } from '@mui/material'
import { Container } from '../../api/types'
import * as React from 'react'

import { DRAWER_WIDTH } from '../../constants'
import DesktopInfo from '../UI/DesktopInfo'

const SessionInfo = ({ desktop }: { desktop?: Container }) => {
	return (
		<Card
			sx={{
				minWidth: DRAWER_WIDTH,
				bgcolor: 'grey.100',
			}}
		>
			<CardContent>
				{desktop && <DesktopInfo desktop={desktop} />}

				<Link
					href={desktop?.url || ''}
					target='_blank'
					rel='noopener'
					underline='hover'
				>
					Open in new window
				</Link>
				<Typography variant='body2'>{desktop?.error?.message}</Typography>
			</CardContent>
		</Card>
	)
}

export default SessionInfo
