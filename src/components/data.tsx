import React, { useState, useEffect } from 'react'
import TitleBar from './titleBar';

import './data.css'

export interface Document {
	type: string
	size: number
	updated: string
	name: string
	path: string
	tags: number[]
	id: number
}
export interface TreeNode {
	key: string
	label: string
	icon: string
	data: Document
	children?: TreeNode[]
}

export interface Tag {
	label: string;
	id: number;
}

const Files = (): JSX.Element => {
	const [loading, setLoading] = useState(true);
	const [nodes, setNodes] = useState<TreeNode[]>()
	const [filesError, setFilesError] = useState<string>()
	const [tags, setTags] = useState<Tag[]>([])

	useEffect(() => {
		const flow = async () => {
			const { data: tags } = await getTags();
			setTags(tags);
			await getFiles().then(({ data, error }) => {
				// if (error) setFilesError(error?.message)
				if (data) setNodes(data)
			})
		}
		flow();
	}, [])

	const getTags = async () => {
		try {
			const response = await fetch(`/index.php/apps/hip/tag/list`);
			const data = await response.json()
			return { data, error: null }
		} catch (error) {
			return { data: null, error }
		}
	}

	const annotateNodes = (data: TreeNode[]): TreeNode[] => {

		const sort = (nodes: TreeNode[]) => nodes
			.sort((a, b) => {
				if (a.data.type === 'dir') {
					return -1
				}
				if (a.data.type === b.data.type) {
					return 0
				}
				return 1
			})

		const traverse = (nodes: TreeNode[]): TreeNode[] => {

			const nextNodes = nodes.map(node => {
				if (node.children) {
					node.icon = 'pi pi-folder'
					const kids = sort(node.children)
					node.children = traverse(kids)
				}
				node.icon = 'pi pi-file'

				return node
			})

			return nextNodes;
		}

		return traverse(data)
	}

	const getFiles = async (): Promise<{ data: TreeNode[] | null, error: Error | null }> => {
		try {
			const response = await fetch(`/index.php/apps/hip/document/list`);
			const json: TreeNode[] = await response.json()
			const data = annotateNodes(json)

			// 			size: Math.round(s.size / 1024),
			// 			updated: new Date(s.modifiedDate).toLocaleDateString('en-US', {
			// 				day: 'numeric',
			// 				month: 'short',
			// 				year: 'numeric',
			// 				hour: 'numeric',
			// 				minute: 'numeric',
			// 			}),

			return { data, error: null }
		} catch (error: any) {
			return { data: null, error }
		}
	}

	const handleChangeTag = async (data: Document, tag: Tag) => {
		const method = data.tags.includes(tag.id) ? 'DELETE' : 'PUT';
		await fetch(`/remote.php/dav/systemtags-relations/files/${data.id}/${tag.id}`, {
			headers: {
				"requesttoken": window.OC.requestToken,
			},
			method
		});

		await getFiles().then(({ data, error }) => {
			if (error) setFilesError(error?.message)
			if (data) setNodes(data as TreeNode[])
		})
	}

	const statusBodyTemplate = (node: { data: Document }) => <>
		{node.data.tags.map((t: any) => <div></div>
			//<TagComponent key={t.label} className="p-mr-2" value={`${tags.find((tag) => tag?.id === t)?.label}`} />
		)}
	</>

	// const actionBodyTemplate = (node: { data: Document }) => <Dropdown
	// 	options={tags}
	// 	onChange={(e) => handleChangeTag(node.data, e.value)}
	// 	optionLabel="label"
	// 	placeholder="Tag"
	// 	className="multiselect-custom"
	// />

	// const bIDSBodyTemplate = (node: { data: Document }) =>
	// 	node.data.tags.includes(tags?.find(t => t?.label === 'subject')?.id || -1) && <Button
	// 		className='p-button-sm p-mr-2'
	// 		label='Bids converter'
	// 		onClick={(e) => handleBIDSConverter(e, node)}
	// 	/>



	return (
		<>
			<TitleBar title='Data' />
			<section className='data__browser'>
				{filesError && <div className='data__error'>filesError</div>}
				{!nodes && !filesError && <div>Loading...</div>}
				{/* {nodes && <TreeTable value={nodes}>
					<Column field='name' header='NAME' expander />
					<Column body={statusBodyTemplate} header='TAGS' />
					<Column body={actionBodyTemplate} header="TAG" />
				</TreeTable>} */}
			</section>
		</>
	)
}

export default Files
