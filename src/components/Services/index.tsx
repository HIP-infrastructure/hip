import React, { useEffect, useRef, useState } from 'react'
import TitleBar from '../UI/titleBar'
import { Box, CircularProgress, Typography } from '@mui/material'
import { DRAWER_WIDTH } from '../../constants'

export default function Service() {
	const [loading, setLoading] = useState(true)
	const iFrameRef = useRef<HTMLIFrameElement>(null)

	useEffect(() => {
		if (!iFrameRef.current) return
		iFrameRef.current.addEventListener('load', function () {
			setLoading(false)
		})
	}, [iFrameRef])

	return (
		<Box>
			<iframe
				ref={iFrameRef}
				title='services'
				src={''}
				allow={'autoplay; clipboard-write;'}
				style={{
					width: `calc(100vw - ${DRAWER_WIDTH}px)`,
					height: 'calc(100vh - 100px)',
					marginLeft: '-120px',
					backgroundColor: '#333',
				}}
				className='iframe-display'
			/>
		</Box>
	)
}
