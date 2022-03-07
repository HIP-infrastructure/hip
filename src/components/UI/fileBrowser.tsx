import { Box } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { TreeNode } from '../../api/types'
import FilePanel from './filePanel'

interface ITreeSelect {
	nodesPanes?: TreeNode[][]
	handleSelectedNode: (node?: TreeNode) => void
}

const FileBrowser = ({ nodesPanes, handleSelectedNode }: ITreeSelect) => {
	const lastRef = useRef<HTMLDivElement>(null)

	// after every render
	useEffect(() => {
		if (lastRef?.current)
			//lastRef.current.scrollLeft = 1000
			lastRef.current.scrollIntoView({
				inline: 'end',
				block: 'center',
				behavior: 'smooth',
			})
	})

	return (
		<Box sx={{ display: 'flex' }}>
			{nodesPanes &&
				nodesPanes.map((nodes, index) => (
					<Box
						key={`${index}`}
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						<div ref={lastRef}>
							<FilePanel
								nodes={nodes}
								handleSelectedNode={handleSelectedNode}
								standalone={false}
							/>
						</div>
					</Box>
				))}
		</Box>
	)
}

FileBrowser.DisplayName = 'FileBrowser'
export default FileBrowser
