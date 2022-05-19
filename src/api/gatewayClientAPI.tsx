import { mutate } from 'swr'
import { Application, Container, TreeNode, UserCredentials } from './types'
import { uniq } from './utils'

export const API_GATEWAY = process.env.REACT_APP_GATEWAY_API
	? `${process.env.REACT_APP_GATEWAY_API}`
	: `${window.location.protocol}//${window.location.host}`
export const API_REMOTE_APP = `${API_GATEWAY}/remote-app`
export const API_CONTAINERS = `${API_REMOTE_APP}/containers`

export function CheckError(response: Response) {
	if (response.status >= 200 && response.status <= 299) {
		return response
	} else {
		if (response.status > 400 && response.status <= 499)
			throw new Error('You have been logged out. Please log in again.')
		else
			throw new Error('An error occurred while fetching the data.')
	}
}

// Debug functions
export const fetchRemote = (): void => {
	const url = `${API_CONTAINERS}/fetch`
	fetch(url).then(CheckError)
}

export const forceRemove = (id: string): void => {
	const url = `${API_CONTAINERS}/forceRemove/${id}`
	fetch(url).then(CheckError)
}

// Gateway API

export const search = async (term: string) => {
	return fetch(`${API_GATEWAY}/files/search/${term}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(CheckError)
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
	return fetch(url)
		.then(CheckError)
		.then(data => data.json())
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
		.then(CheckError)
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
		},
		body: JSON.stringify({
			appName,
			userId: user.uid,
			password: user.password,
		}),
	})
		.then(CheckError)
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
		body: JSON.stringify({ userId: user.uid, password: user.password }),
	})
		.then(CheckError)
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
	})
		.then(CheckError)
		.then(() => mutate(`${API_CONTAINERS}/${userId}`))
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
	})
		.then(CheckError)
		.then(() => mutate(`${API_CONTAINERS}/${userId}`))
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
	})
		.then(CheckError)
		.then(() => mutate(`${API_CONTAINERS}/${userId}`))
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
		.then(CheckError)
		.then(r => {
			mutate(`${API_CONTAINERS}/${userId}`)
			return r.json()
		})
		.then(j => j.data)
}
