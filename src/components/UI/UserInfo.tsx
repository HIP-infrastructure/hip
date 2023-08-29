import { Chat } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { User } from '../../api/types'
import * as React from 'react'

interface Props {
	user: User
}

const UserInfo = ({ user }: Props) => (
	<Box
		key={user.id}
		sx={{
			display: 'flex ',
			gap: 2,
			justifyContent: 'space-between',
			width: '100%',
		}}
	>
		<Stack>
			<Typography variant='subtitle2'>{user.displayName}</Typography>
			<Typography color='text.secondary' variant='body2'>
				{user.email}
			</Typography>
		</Stack>

	</Box>
)

export default UserInfo
