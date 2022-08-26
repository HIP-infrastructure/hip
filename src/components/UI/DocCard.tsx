import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
} from '@mui/material'
import * as React from 'react'

export interface Doc {
	label: string
	buttonLabel: string
	url: string
	description: string
	image?: string
	credit: string
}

const DocCard = ({ doc }: { doc: Doc }) => {
	const handleClickLink = (url: string) => {
		window.open(url)
	}

	return (
		<Card
			sx={{
				width: 320,
				height: 320,
				display: 'flex',
				flexDirection: 'column',
			}}
			key={doc.label}
		>
			<Box sx={{ position: 'relative' }}>
				{/* {doc.image && (
					<CardMedia
						component='img'
						height='160'
						src={doc.image}
						alt={doc.label}
						title={doc.credit}
					/>
				)} */}
			</Box>
			<CardContent sx={{ flexGrow: 1 }}>
				<Box sx={{ display: 'flex' }}>
					<Box sx={{ flex: 1 }}>
						<Typography variant='h5'>{doc?.label}</Typography>
					</Box>
				</Box>
				<Typography
					sx={{ mt: 2 }}
					gutterBottom
					variant='body2'
					color='text.secondary'
				>
					{doc.description}
				</Typography>
				<Typography
					sx={{ wordWrap: 'break-word' }}
					onClick={() => {
						handleClickLink(doc.url)
					}}
					gutterBottom
					variant='caption'
					color='text.secondary'
				>
					{doc.url}
				</Typography>
			</CardContent>

			<CardActions sx={{ p: 2, alignSelf: 'end' }}>
				<Button
					onClick={() => {
						handleClickLink(doc.url)
					}}
					variant='outlined'
				>
					{doc.buttonLabel}
				</Button>
			</CardActions>
		</Card>
	)
}

export default DocCard
