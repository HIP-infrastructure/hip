import React, { useState, useEffect, ChangeEvent } from 'react';
import Search from './search'
import FileBrowser from '../../UI/fileBrowser';
import { TreeNode } from '../../../api/types';
import { getFiles } from '../../../api/gatewayClientAPI';
import { Box } from '@mui/material';


const Files = () => {
    const [filesPanes, setFilesPanes] = useState<TreeNode[][]>();
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [currentBidsFile, setCurrentBidsFile] = useState<File>()

    useEffect(() => {
        files('/').then(f => setFilesPanes([f]))
    }, [])

    const files = async (path: string) => {
        return await getFiles(path)
    }

    const handleSelectedPath = async (pathes: string[]) => {
        console.log(pathes)
        const path = pathes.join('')
        setCurrentBidsFile(f => f ? ({ ...f, path }) : ({ path }))

        const result = await files(path);
        setFilesPanes(prev => {
            if (!prev) return [result];

            prev[pathes.length - 1] = result
            prev.splice(pathes.length)

            return prev
        })
        forceUpdate();
    }

    return <>

        <Box sx={{
            width: 800,
            border: 1,
            borderColor: 'grey.300',
            overflowY: 'auto',
            p: 1
        }}>
            <FileBrowser
                nodesPanes={filesPanes}
                handleSelectedPath={handleSelectedPath}
            >

            </FileBrowser>
        </Box>
        <Search /></>
}

Files.displayName = 'Files'
export default Files

