import React, { useCallback, useEffect, useRef, useState } from 'react'
import TitleBar from '../UI/titleBar'

export default function Files() {
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
		})
	}, [iFrameRef])

	return (
		<div>
			<TitleBar
				title={'Files'} />
			<iframe
				ref={iFrameRef}
				title='Nextcloud Files'
				src={'/apps/files'}
				allow={'autoplay; clipboard-write;'}
				style={{
					width: '50vw',
					height: 'calc(100vh - 100px)',
					backgroundColor: '#333',
				}}
				className='iframe-display'
			/>
		</div>
	)
}
