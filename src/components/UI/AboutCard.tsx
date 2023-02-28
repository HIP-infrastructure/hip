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
import { API_GATEWAY } from '../../api/gatewayClientAPI';
import { linkStyle } from '../../constants'
import { Doc } from '../Documentation/About'

const AboutCard = ({ doc }: { doc: Doc }) => {
	const handleClickLink = ({ url, target }: Doc) => {
		if (target === 'self') window.location.href = url || ''
		else window.open(url)
	}

	return (
		<Card
			sx={{
				width: 320,
				height: 400,
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
						src={`${API_GATEWAY}/${doc.image}`}
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
			<CardActions sx={{ alignSelf: 'end' }}>
				{doc.url && (
					<Button
						onClick={() => {
							handleClickLink(doc || '')
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
