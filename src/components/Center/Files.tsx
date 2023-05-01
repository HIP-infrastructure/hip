import React, { useCallback, useEffect, useRef, useState } from 'react'
import TitleBar from '../UI/titleBar'
import { Box, CircularProgress, Typography } from '@mui/material'

export default function Files() {
	const [loading, setLoading] = useState(true)
	const iFrameRef = useRef<HTMLIFrameElement>(null)

	// Check for XPra readiness
	useEffect(() => {
		if (!iFrameRef.current) return

		iFrameRef?.current?.classList.add('iframe-hidden')
		iFrameRef.current.addEventListener('load', function () {
			const doc = iFrameRef?.current?.contentDocument
			if (!doc) return

			const style = doc.createElement('style')
			style.textContent = `#header {display: none !important} #app-navigation {display: none !important}`
			doc.head.append(style)
			iFrameRef?.current?.classList.remove('iframe-hidden')
			setLoading(false)
		})
	}, [iFrameRef])

	return (
		<Box>
			<Box sx={{ mb: 2 }}>
				<TitleBar title={'Files'} />
			</Box>

			<Box display={'flex'} alignItems={'center'} gap={'0 16px'}>
				<Typography>Nextcloud files</Typography>
				{loading && <CircularProgress size={18} color='secondary' />}
			</Box>
			<iframe
				ref={iFrameRef}
				title='Nextcloud Files'
				src={'/apps/files'}
				allow={'autoplay; clipboard-write;'}
				style={{
					width: '55vw',
					height: 'calc(100vh - 100px)',
					backgroundColor: '#333',
				}}
				className='iframe-display'
			/>
		</Box>
	)
}
