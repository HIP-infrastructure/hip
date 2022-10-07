import {
	Application,
	Container,
	HIPGroup,
	TreeNode,
	User,
	UserCredentials,
	APIContainersResponse,
} from './types'
import { uniq } from './utils'

export const API_GATEWAY = process.env.REACT_APP_GATEWAY_API
	? `${process.env.REACT_APP_GATEWAY_API}`
	: `${window.location.protocol}//${window.location.host}/api/v1`
export const API_REMOTE_APP = `${API_GATEWAY}/remote-app`
export const API_CONTAINERS = `${API_REMOTE_APP}/containers`

/* Checking the response from the server.
 * server response can have two types of errors:
 * 1) server errors with status (4xx to 5xx) and
 * 2) data processing errors, as { data, error }
 */
export const checkError = async (response: Response) => {
	try {
		const isJson = response.headers
			.get('content-type')
			?.includes('application/json')
		const data = isJson ? await response.json() : null

		if (!response.ok) {
			const error = data?.message || response.status
			if (response.status > 400 && response.status <= 403) {
				window.location.href = '/login'
			}

			return Promise.reject(error)
		}

		if (data?.error) return Promise.reject(data.error.message)

		return data
	} catch (error) {
		if (error instanceof Error) return Promise.reject(error.message)
		return Promise.reject(String(error))
	}
}

// Nextcloud HIP API

export const isLoggedIn = async () => fetch(`${API_GATEWAY}/users/isloggedin`, {
	headers: {
		requesttoken: window.OC.requestToken,
	},
}).then(checkError)

export const getUser = async (userid?: string): Promise<User> =>
	fetch(`${API_GATEWAY}/users/${userid}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)

export const getCenters = async (): Promise<HIPGroup[]> =>
	fetch(
		`${process.env.REACT_APP_GATEWAY_API}/public/data/centers.json`,
		{}
	).then(checkError)

export const getUsersForGroup = async (groupid: string): Promise<User[]> => {
	const users = fetch(`${API_GATEWAY}/groups/${groupid}/users`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)

	return users
}

export const scanUserFiles = async (userid: string): Promise<string> => {
	return fetch(`${API_GATEWAY}/users/${userid}/scan-files`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(result => result.text())
}

export const setNCWorkspace = async (userid: string): Promise<string> => {
	return fetch(`${API_GATEWAY}/users/${userid}/set-workspace`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(result => result.text())
}

export const getFiles = async (path: string): Promise<TreeNode[]> => {
	const url = `/apps/hip/document/files?path=${path}`
	const response = await fetch(url)
	const node: TreeNode[] = await response.json()

	return node
}

export const search = async (term: string) =>
	fetch(`${API_GATEWAY}/files/search/${term}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)

// Remote App API

export const getAvailableAppList = (): Promise<Application[]> =>
	fetch(`${API_REMOTE_APP}/apps`).then(checkError)

export const getContainers = (
	currentUser: UserCredentials
): Promise<Container[]> =>
	fetch(
		`${API_CONTAINERS}?userId=${currentUser.uid}${
			(currentUser.isAdmin && '&isAdmin=1') || ''
		}`,
		{
			headers: {
				'Content-Type': 'application/json',
				requesttoken: window.OC.requestToken,
			},
		}
	).then(checkError)

export const createSession = (userId: string): Promise<Container> => {
	const sessionId = uniq('session')
	const url = `${API_CONTAINERS}`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId, sessionId }),
	}).then(checkError)
}

export const createApp = (
	session: Container,
	user: UserCredentials,
	appName: string
): Promise<Container> => {
	const appId = uniq('app')
	const url = `${API_CONTAINERS}/${session.id}/apps`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({
			appName,
			userId: user.uid,
			appId,
		}),
	}).then(checkError)
}

export const removeAppsAndSession = (sessionId: string, userId: string) =>
	fetch(`${API_CONTAINERS}/${sessionId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId }),
	}).then(checkError)

export const pauseAppsAndSession = (sessionId: string, userId: string) =>
	fetch(`${API_CONTAINERS}/${sessionId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId, cmd: 'pause' }),
	}).then(checkError)

export const resumeAppsAndSession = (sessionId: string, userId: string) =>
	fetch(`${API_CONTAINERS}/${sessionId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId, cmd: 'resume' }),
	}).then(checkError)

export const stopApp = (sessionId: string, userId: string, appId: string) =>
	fetch(`${API_CONTAINERS}/${sessionId}/apps/${appId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId }),
	}).then(checkError)

// Debug function
export const forceRemove = (id: string): Promise<APIContainersResponse> => {
	const url = `${API_CONTAINERS}/force/${id}`
	return fetch(url, {
		method: 'DELETE',
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)
}
