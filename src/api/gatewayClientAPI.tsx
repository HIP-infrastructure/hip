import { Node, HIPCenter, TreeNode, User, GroupFolder } from './types'

export const API_GATEWAY = process.env.REACT_APP_GATEWAY_API
	? `${process.env.REACT_APP_GATEWAY_API}`
	: `${window.location.protocol}//${window.location.host}/api/v1`
export const API_REMOTE_APP = `${API_GATEWAY}/remote-app`

/* Checking the response from the server.
 * server response can have two types of errors:
 * 1) server errors with status (4xx to 5xx) and
 * 2) data processing errors, as { data, error }
 */
export const checkForError = async (response: Response) => {
	try {
		const isJson = response.headers
			.get('content-type')
			?.includes('application/json')
		const data = isJson ? await response.json() : response.text()

		if (!response.ok) {
			const error = data?.message || response.status
			if (response.status === 401) {
				window.location.href = '/login'
			}

			return Promise.reject(error)
		}

		if (data?.error) return Promise.reject(data.error.message || data.error)

		return data
	} catch (error) {
		catchError(error)
	}
}

export const catchError = (error: unknown) => {
	if (error instanceof Error) return Promise.reject(error.message)
	return Promise.reject(String(error))
}

// Nextcloud HIP API

export const isLoggedIn = async () =>
	fetch(`${API_GATEWAY}/users/isloggedin`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const getUsers = async (): Promise<User[]> =>
	fetch(`${API_GATEWAY}/users`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const getUser = async (userid: string): Promise<User> =>
	fetch(`${API_GATEWAY}/users/${userid}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const getGroupFolders = async (
	userid?: string
): Promise<GroupFolder[]> =>
	fetch(`${API_GATEWAY}/groups/${userid}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const getCenters = async (): Promise<HIPCenter[]> =>
	fetch(`${API_GATEWAY}/public/data/centers.json`, {})
		.then(checkForError)
		.catch(catchError)

export const scanUserFiles = async (userid: string): Promise<string> => {
	return fetch(`${API_GATEWAY}/users/${userid}/scan-files`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(result => result.text())
		.catch(catchError)
}

export const setNCWorkspace = async (userid: string): Promise<string> => {
	return fetch(`${API_GATEWAY}/users/${userid}/set-workspace`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(result => result.text())
		.catch(catchError)
}

export const getFiles = async (path: string): Promise<TreeNode[]> => {
	const url = `/apps/hip/document/files?path=${path}`
	const response = await fetch(url)
	const node: TreeNode[] = await response.json()

	return node
}

export const getFiles2 = async (path: string): Promise<Node[]> =>
	fetch(`${API_GATEWAY}/files?path=${encodeURIComponent(path)}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const search = async (term: string) =>
	fetch(`${API_GATEWAY}/files/search/${term}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const fileContent = async (path: string) =>
	fetch(`${API_GATEWAY}/files/content?path=${encodeURIComponent(path)}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)
