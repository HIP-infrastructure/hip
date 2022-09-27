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
import { Link } from 'react-router-dom'

export interface Doc {
	label: string
	buttonLabel?: string
	url: string
	description: string
	image?: string
	credit: string
}

const linkStyle = {
	textDecoration: 'underline',
	color: '#0277bd',
}

const DocCard = ({ doc }: { doc: Doc }) => {
	const handleClickLink = (url: string) => {
		window.open(url)
	}

	return (
		<Card
			sx={{
				width: 320,
				height: 420,
				display: 'flex',
				flexDirection: 'column',
			}}
			key={doc.label}
		>
			<Box sx={{ position: 'relative' }}>
				{doc.image && (
					<CardMedia
						component='img'
						height='160'
						src={`${process.env.REACT_APP_GATEWAY_API}/${doc.image}`}
						alt={doc.label}
						title={doc.credit}
					/>
				)}
			</Box>
			<CardContent sx={{ flexGrow: 1 }}>
				<Typography variant='h5'>{doc?.label}</Typography>

				<Typography
					sx={{ mt: 2 }}
					gutterBottom
					variant='body2'
					color='text.secondary'
				>
					{doc.description}
				</Typography>
				{/* <Typography
					sx={{ wordWrap: 'break-word' }}
					gutterBottom
					variant='caption'
					color='text.secondary'
				>
					<Link to={doc.url} target='_blank' style={linkStyle}>
						{doc.url}
					</Link>
				</Typography> */}
			</CardContent>
			<Box sx={{ flexGrow: 1 }}></Box>
			{doc.buttonLabel && (
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
			)}
		</Card>
	)
}

export default DocCard
