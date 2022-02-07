import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Link, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { TreeNode, getFiles, getJsonFileContent } from '../api/gatewayClientAPI';
import TitleBar from './titleBar';

const Data = (): JSX.Element => {
	const [nodes, setNodes] = useState<TreeNode[]>()

	const folders = async (path: string) => {
		const f = await getFiles(path)
		return f?.filter(f => f.data.type === 'dir')
	}

	useEffect(() => {
		folders('/').then(fs => {
			Promise.all(fs.map(f => getJsonFileContent(`${f.data.path}/dataset_description.json`)))
		}).then(bids => {
			console.log(bids)
		})
	}, [])

	return (
		<>
			<TitleBar title='Data' />
			<Card>
				<CardContent>
					<Link href="/index.php/apps/files/" underline="hover">
						See your data in NextCloud Browser
					</Link>
				</CardContent>
			</Card>

			{/* <Typography variant="body2">
				BIDS Databases
			</Typography>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{nodes && nodes.map(n => <Card sx={{ maxWidth: 320 }} >
					<CardContent>
						<Box sx={{ display: 'flex' }}>
							<Typography gutterBottom variant="h5" sx={{ flex: 1 }}>
								{n.label}
							</Typography>
						</Box>
						<Typography gutterBottom variant="body2" color="text.secondary">
							52 patients
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Informations
						</Typography>
					</CardContent>
				</Card>)
				}
			</Box> */}
		</>
	)
}

export default Data
