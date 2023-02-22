import React, { useEffect, useRef } from 'react'
import { Typography, Box, Chip } from '@mui/material'
import { Container } from '../../api/types'
import { color } from '../../api/utils'

const DesktopInfo = ({ desktop }: { desktop: Container }) => (
	<>
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				verticalAlign: 'top',
			}}
		>
			<Box>
				<Typography sx={{ fontSize: 14 }}>{desktop?.userId}</Typography>
				<Typography variant='h5' component='div'>
					Desktop #{desktop?.name}
				</Typography>
				{desktop.workspace === 'collab' && (
					<Typography variant='caption' gutterBottom component='div'>
						Collaborative workspace: {desktop.groupIds
							?.map(
								g => g.replace('group-HIP-', '')
							)
							.join(', ')}
					</Typography>
				)}
			</Box>
			<Chip
				label={
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						{desktop?.state === 'destroyed' ? 'exited' : desktop?.state}
					</Box>
				}
				color={color(desktop?.state)}
				variant='outlined'
			/>
		</Box>
	</>
)

DesktopInfo.displayName = 'DesktopInfo'
export default DesktopInfo
