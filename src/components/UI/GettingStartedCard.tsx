import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Box, Button, CardActions } from '@mui/material'

export default function LandingCard({ title, description }: {title: string, description: string}) {
	return (
		<Card sx={{ width: 345, height: 360 }}>
			<CardMedia
				component='img'
				height='140'
				image='/api/v1/public/media/dirtv_minimalist_desktop_background_Hospital_staff_doctors_nurs_9d31e755-26b5-4379-9a94-82c7d853407d.png'
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
			<Box sx={{ flexGrow: 1 }}></Box>
			<CardActions>
				<Button size='small' color='primary'>
					More...
				</Button>
			</CardActions>
		</Card>
	)
}
