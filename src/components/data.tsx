import React, { useState, useEffect } from 'react'
import './data.css'
import { TreeTable } from 'primereact/treetable'
import { Column } from 'primereact/column'
import { API_GATEWAY } from '../api/gatewayClientAPI'
import { Tag as TagComponent } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button'
import BIDSConverterForm from './convert'
import { OverlayPanel } from 'primereact/overlaypanel';

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
	const [filesError, setFilesError] = useState()
	const [tags, setTags] = useState<Tag[]>([])
	const op = React.useRef<OverlayPanel>(null);

	useEffect(() => {
		const flow = async () => {
			const { data: tags } = await getTags();
			setTags(tags);
			await getFiles().then(({ data, error }) => {
				if (error) setFilesError(error?.message)
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

	const getFiles = async () => {
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
		} catch (error) {
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
		{node.data.tags.map((t: any) =>
			<TagComponent className="p-mr-2" value={`${tags.find((tag) => tag?.id === t)?.label}`} />
		)}
	</>

	const actionBodyTemplate = (node: { data: Document }) => <Dropdown
		options={tags}
		onChange={(e) => handleChangeTag(node.data, e.value)}
		optionLabel="label"
		placeholder="Tag"
		className="multiselect-custom"
	/>

	const bIDSBodyTemplate = (node: { data: Document }) =>
		node.data.tags.includes(tags?.find(t => t?.label === 'subject')?.id || -1) && <Button
			className='p-button-sm p-mr-2'
			label='Bids converter'
			onClick={(e) => handleBIDSConverter(e, node)}
		/>

	const handleBIDSConverter = (event: any, target?: any) => {
		op?.current?.toggle(event, null)
	}

	return (
		<main className='data p-shadow-5'>
			<section className='data__header'>
				<h2>Data</h2>
				<div>
					<Button
						className='p-button-sm p-mr-2'
						label='Bids converter'
						onClick={(e) => handleBIDSConverter(e)}
					/>
					<OverlayPanel
						ref={op}
						showCloseIcon
						id="overlay_panel"
						style={{ width: "450px" }}
						className="overlaypanel-demo"
					>
						<BIDSConverterForm nodes={nodes} />
					</OverlayPanel>
				</div>
			</section>

			<section className='data__browser'>
				{filesError && <div className='data__error'>filesError</div>}
				{!nodes && !filesError && <div>Loading...</div>}
				{nodes && <TreeTable value={nodes}>
					<Column field='name' header='NAME' expander />
					<Column body={statusBodyTemplate} header='TAGS' />
					<Column body={actionBodyTemplate} header="TAG" />
					<Column body={bIDSBodyTemplate} header='ACTIONS' />
				</TreeTable>
				}
			</section>
		</main>
	)
}

export default Files
