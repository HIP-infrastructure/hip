import { Box, Card, CardContent, CircularProgress, Link, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBids } from '../api/gatewayClientAPI';
import { BIDSDatabase } from './bidsConvert';
import TitleBar from './titleBar';


const Data = (): JSX.Element => {
	const [bidsDatabase, setBidsDatabase] = useState<BIDSDatabase[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		getBids().then(r => {
			setBidsDatabase(r)
		})
	}, [])

	return (
		<>
			<TitleBar title='Data' />

			<Box sx={{ mt: 2 }}>
				<Typography variant="h6">
					Private Data
				</Typography>
				<Typography variant="subtitle2">
					See your data in <Link underline="hover" href="/apps/files/" >
						NextCloud Browser
					</Link>
				</Typography>
			</Box>

			<Box sx={{ mt: 2 }}>
				<Typography variant="h6">
					BIDS Databases
				</Typography>

				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px 16px', mt: 2 }}>
					{bidsDatabase.length === 0 && <CircularProgress size={32} />}
					{bidsDatabase && bidsDatabase.map((database, i) =>
						<Card sx={{ minWidth: 320 }} key={`${i}`}>
							{/* <CardMedia
								component="img"
								height="140"
								image={bidsManagerLogo}
								alt="Bids Database"
							/> */}
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									<Link href={database.resourceUrl} underline="always" target="_blank" >
										{database?.description && database?.description['Name']}
									</Link>
								</Typography>
								<Typography gutterBottom variant="caption" color="text.secondary">
									{database?.description &&
										Object.keys(database?.description).map((k: string) =>
											<Typography variant="body2" key={k}><em>{k}</em>: {database.description[k]}</Typography>)}
								</Typography>
								<Box sx={{ m: 2 }}></Box>
								<Typography variant="body2" color="text.secondary">
									participants: {database?.participants?.length}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{database?.participants?.map(p =>
										<>
											<Box key={p.participant_id}>
												<Link
													href={`${database.resourceUrl}/${p.participant_id}`}
													target="_blank"
													underline="always"
												>
													{p.participant_id}
												</Link>
												, {p.age}, {p.sex}
											</Box>
										</>
									)}
								</Typography>
							</CardContent>
						</Card>
					)}
				</Box>
			</Box >
		</>
	)
}

export default Data
