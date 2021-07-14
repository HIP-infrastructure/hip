import React, { useState, useEffect } from 'react'

import { TreeTable } from 'primereact/treetable'
import { Column } from 'primereact/column'
import { API_GATEWAY } from '../api/gatewayClientAPI'

export interface FileStat {
	filename: string
	basename: string
	lastmod: string
	size: number
	type: 'file' | 'directory'
	etag: string | null
	mime?: string
	props?: DAVResultResponseProps
}

export interface DAVResultResponseProps {
	displayname: string
	resourcetype: {
		collection?: boolean
	}
	getlastmodified?: string
	getetag?: string
	getcontentlength?: string
	getcontenttype?: string
	'quota-available-bytes'?: any
	'quota-used-bytes'?: string
}

const Files = (): JSX.Element => {
	// const [loading, setLoading] = useState(true);
	const [nodes, setNodes] = useState<TreeNode[]>([])
	const [filesError, setFilesError] = useState()

	const getFiles = async (path: string) => {
		try {
			const data = await fetch(`${API_GATEWAY}/files${path}`).then(res =>
				res.json()
			)

			if (data.statusCode) {
				return { data: null, error: data }
			}

			const nextNodes = [...(data || [])]
				.sort((a, b) => {
					if (a.type === 'directory') {
						return -1
					}
					if (a.type === b.type) {
						return 0
					}
					return 1
				})
				?.map(s => ({
					key: s.filename,
					label: s.basename,
					leaf: s.type === 'file',
					data: {
						type: s.type,
						size: Math.round(s.size / 1024),
						updated: new Date(s.lastmod).toLocaleDateString('en-US', {
							day: 'numeric',
							month: 'short',
							year: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						}),
						name: s.basename,
						path: s.filename,
					},
					icon: s.type === 'file' ? 'pi pi-file' : 'pi pi-folder',
				}))

			return { data: nextNodes, error: null }
		} catch (error) {
			return { data: null, error }
		}
	}

	useEffect(() => {
		getFiles('/').then(({ data, error }) => {
			if (error) setFilesError(error?.message)
			if (data) setNodes(data as TreeNode[])
		})
	}, [])

	const onExpand = async (event: any) => {
		const { node } = event // as TreeNode;
		if (!node.children) {
			const { data, error } = await getFiles(event.node.data.path)
			if (error) setFilesError(error?.message)
			if (data) {
				node.children = data // TODO: immutable
				setNodes([...nodes])
			}
		}
	}

	if (!nodes) return <div>loading...</div>

	return (
		<main className='data'>
			<section className='data__header'>
				<h2>Files</h2>
			</section>
			<section className='data__browser'>
				{filesError && <div className='data__error'>filesError</div>}
				{!nodes && !filesError && <div>Loading...</div>}
				<TreeTable value={nodes} onExpand={onExpand}>
					<Column field='name' header='' expander />
					<Column field='type' header='TYPE' />
					<Column field='size' header='SIZE' />
					<Column field='updated' header='UPDATED' />
				</TreeTable>
			</section>
		</main>
	)
}

export default Files
