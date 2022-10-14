import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getGroupFolders } from '../api/gatewayClientAPI'
import { GroupFolder } from '../api/types'
import { useAppStore } from '../store/appProvider'
import TreeBrowser from './UI/TreeBrowser'
import FileChooser from './UI/FileChooser'
import TitleBar from './UI/titleBar'
import * as React from 'react'

const AdminCard = ({
	title,
	description,
	children,
}: {
	title: string
	description: string
	children: JSX.Element
}): JSX.Element => (
	<Card sx={{ width: 480 }}>
		<CardMedia
			component='img'
			height='140'
			image='/api/v1/public/media/discover_onboarding.png'
			alt=''
		/>
		<CardContent>
			<Typography gutterBottom variant='h5' component='div'>
				{title}
			</Typography>
			<Typography sx={{ mb: 2 }} variant='body2' color='text.secondary'>
				{description}
			</Typography>
			<Box >{children}</Box>
		</CardContent>
	</Card>
)

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
			<TitleBar title={'Admin'} description={''} />
			<Box sx={{ mb: 2 }}>
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					Welcome {user?.displayName}
				</Typography>
			</Box>

			<Box sx={{ mb: 2 }}>
				<Typography sx={{ mt: 2, color: 'secondary.light' }} variant='h6'>
					UI DEMO WIDGETS
				</Typography>
			</Box>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				<AdminCard
					title='File Browser'
					description='File Browser for private data and groupfolders using Node fs class. Search via NC files api'
				>
					<TreeBrowser groups={groupFolders?.map(g => g.label)} />
				</AdminCard>

				<AdminCard title='File Chooser' description='MUI File Chooser + NC api'>
					<FileChooser />
				</AdminCard>
			</Box>
		</Box>
	)
}

export default Admin
