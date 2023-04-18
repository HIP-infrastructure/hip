import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function Files() {
	const iFrameRef = useRef<HTMLIFrameElement>(null)

	// Check for XPra readiness
	useEffect(() => {
		if (!iFrameRef.current) return

		iFrameRef.current.addEventListener('load', function () {
			const doc = iFrameRef?.current?.contentDocument
			if (!doc) return

			const style = doc.createElement('style')
			style.textContent = `#header {display: none !important} #app-navigation {display: none !important}`
			doc.head.append(style)
		})
	}, [iFrameRef])

	return (
		<div>
			Files
			<iframe
				ref={iFrameRef}
				title='Nextcloud Files'
				src={'/apps/files'}
				allow={'autoplay; clipboard-write;'}
				style={{
					width: 'calc(100vw - 320px)',
					height: 'calc(100vh - 100px)',
					backgroundColor: '#333',
				}}
			/>
		</div>
	)
}
