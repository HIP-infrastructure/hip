import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import { Typography, Button, Box } from '@mui/material';
import { Folder, FolderOpen, InsertDriveFile, ArrowDropDown, ArrowRight } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { TreeNode } from '../../api/gatewayClientAPI';

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />
    );
}

interface ITreeSelect {
    nodesBoxes?: TreeNode[][]
    handleSelectedPath: (selectedPath: string[]) => void
}

export default function TreeSelect({ nodesBoxes, handleSelectedPath }: ITreeSelect) {
    const [selectedPath, setSelectedPath] = useState<string[]>(['/'])

    const onNodeSelect = (event: React.SyntheticEvent, path: string) => {
        const pathes = path.split('/').map(p => `${p}/`)

        setSelectedPath(pathes)
        handleSelectedPath(pathes)
    }

    // init
    useEffect(() => {
        handleSelectedPath(selectedPath)
    }, [])


    return (
        <Box sx={{ display: 'flex' }}>
            {nodesBoxes && nodesBoxes.map((nodes, index) =>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {index === nodesBoxes.length - 1 &&
                        index !== 0 &&
                        <Button >Create new subject</Button>
                    }
                    <TreeView
                        onNodeSelect={onNodeSelect}
                        aria-label="tree view"
                        defaultExpanded={['3']}
                        defaultCollapseIcon={<ArrowDropDown />}
                        defaultExpandIcon={<ArrowRight />}
                        defaultEndIcon={<div style={{ width: 24 }} />}
                        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    >
                        {nodes.map((node: TreeNode) =>

                            <StyledTreeItem
                                key={node.key}
                                nodeId={node.data.path}
                                labelText={node.label}
                                labelIcon={node.data.type === 'dir' ? Folder : InsertDriveFile}
                            //labelInfo="90"
                            />
                        )}
                    </TreeView>
                </Box>
            )}
        </Box>
    );
}
