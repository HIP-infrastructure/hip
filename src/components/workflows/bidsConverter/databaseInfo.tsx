import { Box, CardContent, Typography } from '@mui/material'
import React from 'react'
import { BIDSDatabase } from '../../data'

const DatabaseInfo = ({ database }: { database?: BIDSDatabase }) => (
	<Box
		sx={{
			minWidth: 240,
			maxWidth: 400,
			overflowY: 'auto',
			border: 1,
			borderColor: 'grey.400',
			p: 2,
			mr: 1,
		}}
	>
		{
			<Typography gutterBottom variant='subtitle2'>
				BIDS Database
			</Typography>
		}

		{/* {database?.path && <Typography sx={{ overflowWrap: 'break-word' }}>
                    <strong>path:</strong> {database?.path}
                </Typography>} */}

		{database?.participants && (
			<Typography variant='body2'>
				<em>Number of subjects:</em> {database?.participants?.length}
			</Typography>
		)}

		{/* {database?.description &&
			Object.keys(database?.description).map((k: string) => (
				<Typography variant='body2' key={k}>
					<em>{k}</em>: {database.description[k]}
				</Typography>
			))} */}
	</Box>
)

export default DatabaseInfo
