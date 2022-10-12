import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getGroupFolders } from '../api/gatewayClientAPI'
import { GroupFolder } from '../api/types'
import { useAppStore } from '../store/appProvider'
import DataBrowser from './DataBrowser'
import TitleBar from './UI/titleBar'

const Admin = () => {
	const {
		user: [user],
	} = useAppStore()

	const [groupFolders, setGroupFolders] = useState<GroupFolder[] | null>(null)

	useEffect(() => {
		getGroupFolders(user?.uid).then(groupFolders => {
			setGroupFolders(groupFolders)
		})
	}, [user])

	return (
		<Box sx={{ width: 0.75 }}>
			<TitleBar
				title={'Admin'}
				description={
					''
				}
			/>
			<Box sx={{ mb: 4 }}>
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					Welcome {user?.displayName}
				</Typography>
			</Box>
			<Box sx={{ mb: 4 }}>
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					Experimental async File Browser for private data and groupfolders using Node fs class.
					Search via NC files api
				</Typography>
				{groupFolders && <DataBrowser groups={groupFolders.map(g => g.label)} />}
			</Box>
		</Box>
	)
}

export default Admin
