import React, { useEffect, useRef, useState } from 'react'
import TitleBar from '../UI/titleBar'
import { CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import { SERVICES } from '../../constants'

export default function Service() {
	const [loading, setLoading] = useState(true)
	const [service, setService] = useState<any>(null)
	const iFrameRef = useRef<HTMLIFrameElement>(null)
	const params = useParams()

	// Remove scroll for entire window
	useEffect(() => {
		document.body.classList.add('body-fixed')
		return () => {
			document.body.classList.remove('body-fixed')
		}
	}, [])

	useEffect(() => {
		if (!params.serviceId) return

		const serviceId = params?.serviceId
		const service = SERVICES.find(s => s.id === serviceId)

		if (!service) return

		setService(service)
	}, [params, setService])

	return (
		<>
			{service && (
				<iframe
					ref={iFrameRef}
					title='services'
					src={service?.url}
					allow={'autoplay; fullscreen; clipboard-write;'}
					style={{
						width: '100%',
						height: 'calc(100vh - 164px)',
						backgroundColor: '#333',
					}}
					className='iframe-display'
				/>
			)}
		</>
	)
}
