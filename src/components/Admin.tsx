import * as React from 'react'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { getGroupFolders } from '../api/gatewayClientAPI'
import { GroupFolder } from '../api/types'
import { useAppStore } from '../store/appProvider'
import DataBrowser from './DataBrowser'

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
		<Box>
			{groupFolders && <DataBrowser groups={groupFolders.map(g => g.label)} />}
		</Box>
	)
}

export default Admin
