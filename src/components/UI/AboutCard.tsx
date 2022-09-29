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
import { Doc } from '../About'

const linkStyle = {
	textDecoration: 'underline',
	color: '#0277bd',
}

const AboutCard = ({ doc }: { doc: Doc }) => {
	const handleClickLink = (url: string) => {
		window.open(url)
	}

	return (
		<Card
			sx={{
				width: 320,
				height: 450,
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
			<CardContent>
				<Typography variant='h5' gutterBottom>
					{doc?.label}
				</Typography>

				{doc.subtitle && (
					<Typography variant='subtitle2'>{doc?.subtitle}</Typography>
				)}

				<Typography
					sx={{ mt: 2 }}
					gutterBottom
					variant='body2'
					color='text.secondary'
				>
					{doc.description}
				</Typography>
			</CardContent>
			<Box sx={{ flexGrow: 1 }}></Box>
			<CardActions sx={{ p: 2, alignSelf: 'end' }}>
				{doc.url && (
					<Button
						onClick={() => {
							handleClickLink(doc.url || '')
						}}
						variant='outlined'
					>
						{doc.buttonLabel}
					</Button>
				)}
				{doc.route && (
					<Typography
						sx={{ wordWrap: 'break-word' }}
						gutterBottom
						variant='caption'
						color='text.secondary'
					>
						<Link to={doc.route} target='_blank' style={linkStyle}>
							{doc.buttonLabel}
						</Link>
					</Typography>
				)}
			</CardActions>
		</Card>
	)
}

export default AboutCard
