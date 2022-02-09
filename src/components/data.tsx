import { Box, Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getBids } from '../api/gatewayClientAPI';
import { BIDSDatabase } from './bidsConvert';
import TitleBar from './titleBar';


const Data = (): JSX.Element => {
	const [bidsDatabase, setBidsDatabase] = useState<BIDSDatabase[]>([])

	useEffect(() => {
		getBids().then(r => {
			setBidsDatabase(r)
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

			<Typography variant="body2">
				BIDS Databases
			</Typography>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
				{bidsDatabase && bidsDatabase.map((database, i) =>
					<Card sx={{ maxWidth: 320 }} key={`${i}`}>
						<CardContent>
							<Box sx={{ display: 'flex' }}>
								<Typography gutterBottom variant="h5" sx={{ flex: 1 }}>
								</Typography>
							</Box>
							<Typography variant="caption" color="text.secondary">
								{database?.description &&
									Object.keys(database?.description).map((k: string) =>
										<Typography variant="body2" key={k}><em>{k}</em>: {database.description[k]}</Typography>)}
							</Typography>
							<Typography gutterBottom variant="body2" color="text.secondary">
								participants: {database?.participants?.length}
							</Typography>
						</CardContent>
						<CardActions sx={{ p: 2, alignSelf: 'end' }} >
							<Button size="small" onClick={() => { window.open(database?.resourceUrl, '_blank') }}>See Database</Button>
						</CardActions>
					</Card>
				)}
			</Box>
		</>
	)
}

export default Data
