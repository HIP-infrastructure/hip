import { Box, Card, CardContent, Chip, Link, Typography } from '@mui/material'
import * as React from 'react'
import { Container } from '../../api/types'
import { color } from '../../api/utils'

import { DRAWER_WIDTH } from '../../constants'

const SessionInfo = ({ desktop }: { desktop?: Container }) => {
	return (
		<Card
			sx={{
				minWidth: DRAWER_WIDTH,
			}}
		>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} gutterBottom>
					{desktop?.userId}
				</Typography>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant='h5' gutterBottom component='div'>
						Desktop #{desktop?.name}
					</Typography>
					<Chip
						label={
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								{desktop?.state}
							</Box>
						}
						color={color(desktop?.state)}
						variant='outlined'
					/>
				</Box>
				<Link
					href={desktop?.url || ''}
					target='_blank'
					rel='noopener'
					underline='hover'
				>
					Open in Browser
				</Link>
				<Typography variant='body2'>{desktop?.error?.message}</Typography>
			</CardContent>
		</Card>
	)
}

export default SessionInfo
