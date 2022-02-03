import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { TreeNode } from '../../api/gatewayClientAPI';
import FilePanel from './filePanel'

interface ITreeSelect {
    nodesBoxes?: TreeNode[][]
    handleSelectedPath: (selectedPath: string[]) => void
}

export default ({ nodesBoxes, handleSelectedPath }: ITreeSelect) => {

    return (
        <Box sx={{ display: 'flex' }}>
            {nodesBoxes && nodesBoxes.map((nodes, index) =>
                <Box key={`${index}`} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FilePanel nodes={nodes} handleSelectedPath={handleSelectedPath} standalone={false} />

                    {index === nodesBoxes.length - 1 &&
                        <Button sx={{ mt: 2, p: 1, mr: 1 }} variant='outlined'>New BIDS Database</Button>
                    }
                </Box>
            )}
        </Box>
    );
}
