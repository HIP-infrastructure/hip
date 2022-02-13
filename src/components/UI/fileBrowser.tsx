import { Box } from '@mui/material';
import React from 'react';
import { TreeNode } from '../../api/gatewayClientAPI';
import FilePanel from './filePanel';

interface ITreeSelect {
    nodesPanes?: TreeNode[][]
    handleSelectedPath: (selectedPath: string[]) => void
    children: React.ReactNode
}

export default ({ nodesPanes, handleSelectedPath, children }: ITreeSelect) =>
    <Box sx={{ display: 'flex' }}>
        {nodesPanes && nodesPanes.map((nodes, index) =>
            <Box key={`${index}`} sx={{ display: 'flex', flexDirection: 'column' }}>
                <FilePanel nodes={nodes} handleSelectedPath={handleSelectedPath} standalone={false} />
                {index === 0 && children}
            </Box>
        )}
    </Box>
