import React, { useState, useEffect } from 'react'
import './data.css'
import { TreeTable } from 'primereact/treetable'
import { Column } from 'primereact/column'
import { API_GATEWAY } from '../api/gatewayClientAPI'
import { Tag as TagComponent } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button'

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
	leaf: boolean
	data: Document
	icon: string
}

export interface Tag {
	label: string;
	id: number;
}

const Files = (): JSX.Element => {
	const [loading, setLoading] = useState(true);
	const [nodes, setNodes] = useState<any>({})
	const [filesError, setFilesError] = useState()
	const [documents, setDocuments] = useState<any>()
	const [tags, setTags] = useState<Tag[]>([])
	const [selectedTags, setSelectedTags] = useState<any>([])

	const getTags = async () => {
		try {
			const response = await fetch(`/index.php/apps/hip/tag/list`);
			const data = await response.json()
			return { data, error: null }
		} catch (error) {
			return { data: null, error }
		}
	}

	const getFiles = async () => {
		try {
			const response = await fetch(`/index.php/apps/hip/document/list`);
			const data = await response.json()

			// const nextNodes = [...(data || [])]
			// 	.sort((a, b) => {
			// 		if (a.type === 'dir') {
			// 			return -1
			// 		}
			// 		if (a.type === b.type) {
			// 			return 0
			// 		}
			// 		return 1
			// 	})
			// 	?.map(s => ({
			// 		key: `${s.id}`,
			// 		label: s.name,
			// 		leaf: s.type === 'file',
			// 		data: {
			// 			id: s.id,
			// 			type: s.type,
			// 			tags: s.tags.map((t: number) => ({
			// 				id: t,
			// 				label: tags.find((tag) => tag?.id === t)?.label
			// 			})),
			// 			size: Math.round(s.size / 1024),
			// 			updated: new Date(s.modifiedDate).toLocaleDateString('en-US', {
			// 				day: 'numeric',
			// 				month: 'short',
			// 				year: 'numeric',
			// 				hour: 'numeric',
			// 				minute: 'numeric',
			// 			}),
			// 			name: s.name,
			// 			path: s.path,
			// 		},
			// 		icon: s.type === 'file' ? 'pi pi-file' : 'pi pi-folder',
			// 	}))

			return { data, error: null }
		} catch (error) {
			return { data: null, error }
		}
	}

	const handleChangeTag = async (data: Document, tag: Tag) => {
		console.log(data, tag)
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

		setSelectedTags(tag)
	}

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

	// const onExpand = async (event: TreeNode) => {
	// 	const node = event.node // as TreeNode;
	// 	if (!node.children) {
	// 		const { data, error } = await getFiles(event.node.data.name, tags);
	// 		if (error) setFilesError(error?.message)
	// 		if (data) {
	// 			node.children = data // TODO: immutable
	// 			setNodes([...nodes])
	// 		}
	// 	}
	// }

	// const selectedTagsTemplate = (option: any) => {
	// 	if (option) {
	// 		return <Tag className="p-mr-2" value={option}></Tag>
	// 	}

	// 	return "Select Tags";
	// }

	// const tagTemplate = (option: string) =>
	// 	<Tag className="p-mr-2" value={option}></Tag>


	const statusBodyTemplate = (node: { data: Document }) => <>
		{node.data.tags.map((t: any) =>
			<TagComponent className="p-mr-2" value={`${tags.find((tag) => tag?.id === t)?.label}`} />
		)}

		<Dropdown
			options={tags}
			onChange={(e) => handleChangeTag(node.data, e.value)}
			optionLabel="label"
			placeholder="Tag"
			className="multiselect-custom"
		/>
	</>


	if (!nodes) return <div>loading...</div>

	return (
		<main className='data p-shadow-5'>
			<section className='data__header'>
				<h2>Data</h2>
			</section>

			<section className='data__browser'>
				{filesError && <div className='data__error'>filesError</div>}
				{!nodes && !filesError && <div>Loading...</div>}
				<TreeTable value={nodes}>
					<Column field='name' header='' expander />
					<Column body={statusBodyTemplate} header='TAGS' />
					{/* <Column field='size' header='SIZE' />
					<Column field='updated' header='UPDATED' />
					<Column field='actions' header='ACTIONS' /> */}
				</TreeTable>
			</section>
		</main>
	)


}

export default Files
