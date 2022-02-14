import { mutate } from 'swr'
import { BIDSDatabase, BIDSDatabaseResponse, Container, Application, UserCredentials } from './types'
import { uniq } from './utils'


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

export const search = async (term: string) => {
	return fetch(`${API_GATEWAY}/files/search/${term}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(data => data.json())
}
export const getBids = async (): Promise<BIDSDatabaseResponse> => {
	return fetch(`${API_GATEWAY}/files/bids`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(data => data.json())
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
		body: JSON.stringify({
			appName,
			userId: user.uid,
			password: user.password,
		}),
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
