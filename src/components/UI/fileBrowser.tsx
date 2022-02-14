import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { TreeNode } from '../../api/types';
import FilePanel from './filePanel';

interface ITreeSelect {
    nodesPanes?: TreeNode[][]
    handleSelectedPath: (selectedPath: string[]) => void
    children: React.ReactNode
}

export default ({ nodesPanes, handleSelectedPath, children }: ITreeSelect) => {
    const lastRef = useRef<HTMLDivElement>(null)

    // after every render
    useEffect(() => {
        if (lastRef?.current) //lastRef.current.scrollLeft = 1000
        lastRef.current.scrollIntoView({
            inline: 'end',
            block: 'center',
            behavior: "smooth",
        })
    })

    return <Box sx={{ display: 'flex' }}>
        {nodesPanes && nodesPanes.map((nodes, index) =>
            <Box key={`${index}`} sx={{ display: 'flex', flexDirection: 'column' }}>
                <div ref={lastRef} >
                    <FilePanel
                        nodes={nodes}
                        handleSelectedPath={handleSelectedPath} standalone={false} />
                    {index === 0 && children}
                </div>
            </Box>
        )}
    </Box>

}

