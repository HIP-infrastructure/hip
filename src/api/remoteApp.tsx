import { API_REMOTE_APP, catchError, checkForError } from './gatewayClientAPI'
import { Application, Container, Workspace } from './types'

const toParams = (data: Record<string, string | boolean>) =>
				Object.keys(data)
					.map(key => `${key}=${encodeURIComponent(String(data[key]))}`)
					.join('&')
					
export const getAvailableAppList = (): Promise<Application[]> =>
	fetch(`${API_REMOTE_APP}/apps`).then(checkForError)

export const getDesktopsAndApps = (
	workspace: Workspace,
	userId: string,
	groupIds: string[],
	isAdmin = false
): Promise<Container[]> =>{
	const query = {
		workspace,
		userId,
		isAdmin
	}
	const g = groupIds.map(g => '&groupIds=' + encodeURIComponent(g)).join('')

	return fetch(
		`${API_REMOTE_APP}?${toParams(query)}${g}`,
		{
			headers: {
				requesttoken: window.OC.requestToken,
			},
		}
	)
		.then(checkForError)
		.catch(catchError)
	}

export const getDesktop = (desktopId: string): Promise<Container> =>
	fetch(`${API_REMOTE_APP}/${desktopId}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const createDesktop = (
	workspace: Workspace,
	userId: string,
	groupIds: string[] = []
): Promise<Container[]> => {
	return fetch(`${API_REMOTE_APP}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ workspace, userId, groupIds }),
	})
		.then(checkForError)
		.catch(catchError)
}

export const createApp = (
	desktopId: string,
	userId: string,
	appName: string
): Promise<Container[]> => {
	const url = `${API_REMOTE_APP}/${desktopId}/${appName}`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({
			userId,
		}),
	})
		.then(checkForError)
		.catch(catchError)
}

export const removeAppsAndDesktop = (
	desktopId: string,
	userId: string
): Promise<Container[]> =>
	fetch(`${API_REMOTE_APP}/${desktopId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId }),
	})
		.then(checkForError)
		.catch(catchError)

export const pauseAppsAndDesktop = (
	desktopId: string,
	userId: string
): Promise<Container[]> =>
	fetch(`${API_REMOTE_APP}/${desktopId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId, cmd: 'pause' }),
	})
		.then(checkForError)
		.catch(catchError)

export const resumeAppsAndDesktop = (
	desktopId: string,
	userId: string
): Promise<Container[]> =>
	fetch(`${API_REMOTE_APP}/${desktopId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId, cmd: 'resume' }),
	})
		.then(checkForError)
		.catch(catchError)

export const stopApp = (
	desktopId: string,
	userId: string,
	appId: string
): Promise<Container[]> =>
	fetch(`${API_REMOTE_APP}/${desktopId}/${appId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({ userId }),
	})
		.then(checkForError)
		.catch(catchError)

// Debug function
export const forceRemoveAppsAndDesktop = (
	desktopId: string
): Promise<Container[]> => {
	const url = `${API_REMOTE_APP}/${desktopId}?force=true`
	return fetch(url, {
		method: 'DELETE',
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)
}
