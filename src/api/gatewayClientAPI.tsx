import { mutate } from 'swr'
import { uniq } from './utils'

export interface Container {
	id: string
	name: string
	user: string
	url: string
	state: ContainerState
	error: Error | null
	type: ContainerType
	parentId?: string
	apps?: AppContainer[]
}

export type AppContainer = Container & ContainerOptions

export interface ContainerOptions {
	app: string
}

export enum ContainerState {
	UNINITIALIZED = 'uninitialized',
	CREATED = 'created',
	LOADING = 'loading',
	RUNNING = 'running',
	STOPPING = 'stopping',
	PAUSED = 'paused',
	EXITED = 'exited',
	DESTROYED = 'destroyed',
}

export const loading = (state: ContainerState) => [ContainerState.CREATED, ContainerState.LOADING, ContainerState.STOPPING].includes(state)
export const color = (state?: ContainerState) => state && [ContainerState.RUNNING, ContainerState.CREATED, ContainerState.LOADING].includes(state) ? 'success' : 'error'

export enum ContainerType {
	SESSION = 'server',
	APP = 'app',
}

export interface UserCredentials {
	uid?: string
	displayName?: string | null
	isAdmin?: boolean
	password?: string
}

export interface Application {
	name: string
	description: string
	status: string
	url: string
	icon: string,
	state: 'ready' | 'beta' | 'faulty',
	version: string,
	label?: string
}

export interface Workflow {
	id: string;
	label: string;
	description: string;
	state: 'ready' | 'beta' | 'faulty',
	enabled: boolean
}

export interface TreeNode {
	key: string
	label: string
	icon: string
	data: Document
	children?: TreeNode[]
}

export interface Document {
	type: string
	size: number
	updated: string
	name: string
	path: string
	tags: number[]
	id: number
}

export interface Tag {
	label: string;
	id: number;
}

const API_GATEWAY = process.env.REACT_APP_GATEWAY_API
	? `${process.env.REACT_APP_GATEWAY_API}`
	: `${window.location.protocol}//${window.location.host}`
export const API_REMOTE_APP = `${API_GATEWAY}/remote-app`
export const API_CONTAINERS = `${API_REMOTE_APP}/containers`

// Debug functions
export const fetchRemote = (): void => {
	const url = `${API_CONTAINERS}/fetch`
	fetch(url)
}

export const forceRemove = (id: string): void => {
	const url = `${API_CONTAINERS}/forceRemove/${id}`
	fetch(url)
}

// Gateway API

// Files
// export const getFiles = (): Promise<{ files: any[] | null, error: Error | null }> => {
// 	const url = `${API_GATEWAY}/files/`
// 	const files = fetch(url)
// 		.then(a => a.json())
// 		.catch(error => ({ files: null, error }))
// 		.then(json => json.statusCode ?
// 			({ files: null, error: json }) :
// 			({ files: json, error: null }))

// 	return files
// }

export const getFiles = async (path: string): Promise<TreeNode[]> => {
	//try {
	const response = await fetch(`/index.php/apps/hip/document/files?path=${path}`);
	const node: TreeNode[] = await response.json()

	// 			size: Math.round(s.size / 1024),
	// 			updated: new Date(s.modifiedDate).toLocaleDateString('en-US', {
	// 				day: 'numeric',
	// 				month: 'short',
	// 				year: 'numeric',
	// 				hour: 'numeric',
	// 				minute: 'numeric',
	// 			}),

	return node

	// } catch (error: any) {
	// 	return { data: null, error }
	// }
}

export const getFileContent = async (path: string): Promise<string> => {
	const response = await fetch(`/index.php/apps/hip/document/file?path=${path}`);

	return await response.text()
}

export const getJsonFileContent = async (path: string): Promise<{ [key: string]: string | number }> => {

	try {
		const response = await fetch(`/index.php/apps/hip/document/file?path=${path}`);

		const maybeJson = await response.json()
		const j = maybeJson.replace(/\\n/g, '')

		return JSON.parse(j)
	} catch (e) {
		console.log(e)

		return 
	}
}

export const createFolder = async (parentPath: string, name: string): Promise<TreeNode[]> => {
	const response = await fetch(`/index.php/apps/hip/document/folder?parentPath=${parentPath}&name=${name}`);
	const node: TreeNode[] = await response.json()

	return node
}

export const search = async (term: string) => {
	return fetch(`https://hip.local/api/v1/files/search/${term}`, {
		headers: {
			'requesttoken': window.OC.requestToken
		}
	}).then(data => data.json())
}


const getTags = async () => {
	try {
		const response = await fetch(`/index.php/apps/hip/tag/list`);
		const data = await response.json()
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

	// await getFiles().then(({ data, error }) => {
	// 	if (error) setFilesError(error?.message)
	// 	if (data) setNodes(data as TreeNode[])
	// })
}


// Sessions & apps

export const getAvailableAppList = (): Promise<{ apps: Application[] | null, error: Error | null }> => {
	const url = `${API_REMOTE_APP}/apps`
	const availableApps = fetch(url)
		.then(a => a.json())
		.catch(error => ({ apps: null, error }))
		.then(json => json.statusCode ?
			({ apps: null, error: json }) :
			({ apps: (json as Application[]), error: null }))

	return availableApps
}

export const createSession = (userId: string): Promise<Container> => {
	const id = uniq('session')
	const url = `${API_CONTAINERS}/${id}/start`
	const session = fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${userId}`)
			return r.json()
		})
		.then(j => j.data)

	return session
}

export const createApp = (
	session: Container,
	user: UserCredentials,
	appName: string
): Promise<Container> => {
	const appId = uniq('app')
	const url = `${API_CONTAINERS}/${session.id}/apps/${appId}/start`
	const app = fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ appName, userId: user.uid, password: user.password }),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${user.uid}`)
			return r.json()
		})
		.then(j => j.data)

	return app
}

export const createSessionAndApp = (
	user: UserCredentials,
	appName: string
): Promise<Container> => {
	const url = `${API_REMOTE_APP}/apps/${appName}/start`
	const sessionAndApp = fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId: user.uid, password: user.password }),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${user.uid}`)
			return r.json()
		})
		.then(j => j.data)

	return sessionAndApp
}

export const removeAppsAndSession = (
	sessionId: string,
	userId: string
): void => {
	const url = `${API_CONTAINERS}/${sessionId}/remove`
	fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	}).then(() => mutate(`${API_CONTAINERS}/${userId}`))
}

export const pauseAppsAndSession = (
	sessionId: string,
	userId: string
): void => {
	const url = `${API_CONTAINERS}/${sessionId}/pause`
	fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	}).then(() => mutate(`${API_CONTAINERS}/${userId}`))
}

export const resumeAppsAndSession = (
	sessionId: string,
	userId: string
): void => {
	const url = `${API_CONTAINERS}/${sessionId}/resume`
	fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	}).then(() => mutate(`${API_CONTAINERS}/${userId}`))
}

export const stopApp = (
	sessionId: string,
	userId: string,
	appId: string
): void => {
	const url = `${API_CONTAINERS}/${sessionId}/apps/${appId}/stop`
	const app = fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId }),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${userId}`)
			return r.json()
		})
		.then(j => j.data)
}