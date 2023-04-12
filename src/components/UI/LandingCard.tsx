import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Button, CardActions } from '@mui/material'

export default function LandingCard({ title, description }: any) {
	return (
		<Card sx={{ width: 345 }}>
			<CardMedia
				component='img'
				height='140'
				image='/api/v1/public/media/651069478_synapses__technology__meta___database__information__network__neural_path__futuristic_and_medical__re.png'
				alt='green iguana'
			/>
			<CardContent>
				<Typography gutterBottom variant='h5' component='div'>
					{title}
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					{description}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size='small' color='primary'>
					Visit
				</Button>
			</CardActions>
		</Card>
	)
}
