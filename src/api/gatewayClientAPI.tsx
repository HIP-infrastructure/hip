import { mutate } from 'swr'
import {
	Application,
	Container,
	Group,
	TreeNode,
	User,
	UserCredentials,
} from './types'
import { uniq } from './utils'

export const API_GATEWAY = process.env.REACT_APP_GATEWAY_API
	? `${process.env.REACT_APP_GATEWAY_API}`
	: `${window.location.protocol}//${window.location.host}/api/v1`
export const API_REMOTE_APP = `${API_GATEWAY}/remote-app`
export const API_CONTAINERS = `${API_REMOTE_APP}/containers`

/* Checking the response from the server. */
export const checkError = async (response: Response) => {
	try {
		if (response.status >= 200 && response.status <= 299) {
			return await response.json()
		} else {
			if (response.status > 400 && response.status <= 403) {
				const error = await response.json()
				throw new Error(
					error?.message ?? 'You have been logged out. Please log in again.',
					error?.statusCode ?? 'Unauthorized'
				)
			} else if (response.status >= 500 && response.status <= 599) {
				throw new Error(
					`Bad response from server: ${response.statusText} ${response.status}`
				)
			} else {
				const data = await response.json()
				throw new Error(data.message)
			}
		}
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message)
	}
}

// Debug functions
export const fetchRemote = (): void => {
	const url = `${API_CONTAINERS}/fetch`
	fetch(url).then(checkError)
}

export const forceRemove = (id: string): void => {
	const url = `${API_CONTAINERS}/forceRemove/${id}`
	fetch(url).then(checkError)
}

// NextCloud API

export const getUser = async (userid?: string): Promise<User> => {
	const user = fetch(`${API_GATEWAY}/users/${userid}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)

	return user
}

export const getGroups = async (): Promise<Group[]> => {
	const groups = fetch(`${API_GATEWAY}/groups`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)

	return groups
}

export const getUsersForGroup = async (groupid: string) => {
	const users = fetch(`${API_GATEWAY}/groups/${groupid}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)

	return users
}

export const search = async (term: string) => {
	return fetch(`${API_GATEWAY}/files/search/${term}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkError)
		.then(data => data.json())
}

export const getFiles = async (path: string): Promise<TreeNode[]> => {
	//try {
	const url = `/apps/hip/document/files?path=${path}`
	const response = await fetch(url)
	const node: TreeNode[] = await response.json()

	return node
}

// Sessions & apps

export const getAvailableAppList = (): Promise<Application[] | null> => {
	const url = `${API_REMOTE_APP}/apps`
	return fetch(url).then(checkError)
}

export const createSession = (userId: string): Promise<Container> => {
	const id = uniq('session')
	const url = `${API_CONTAINERS}/${id}/start`
	return fetch(url, {
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
}

export const createApp = (
	session: Container,
	user: UserCredentials,
	appName: string
): Promise<Container> => {
	const appId = uniq('app')
	const url = `${API_CONTAINERS}/${session.id}/apps/${appId}/start`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({
			appName,
			userId: user.uid,
		}),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${user.uid}`)
			return r.json()
		})
		.then(j => j.data)
}

export const createSessionAndApp = (
	user: UserCredentials,
	appName: string
): Promise<Container> => {
	const url = `${API_REMOTE_APP}/apps/${appName}/start`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId: user.uid }),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${user.uid}`)
			return r.json()
		})
		.then(j => j.data)
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
	fetch(url, {
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
