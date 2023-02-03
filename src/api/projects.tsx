import { API_GATEWAY, catchError, checkForError } from './gatewayClientAPI'

import { BIDSDataset, File2, HIPProject } from './types'

export const getProjects = async (): Promise<HIPProject[]> =>
	fetch(`${API_GATEWAY}/projects`, {}).then(checkForError).catch(catchError)

export const getUserProjects = async (userId: string): Promise<HIPProject[]> =>
	fetch(`${API_GATEWAY}/projects?userId=${userId}`, {})
		.then(checkForError)
		.catch(catchError)

export const createProject = async (project: {
	admin: string
	title: string
	description: string
}): Promise<any> => {
	return fetch(`${API_GATEWAY}/projects`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(project),
	})
		.then(checkForError)
		.catch(catchError)
}

export const getProject = async (name: string): Promise<HIPProject> => {
	return fetch(`${API_GATEWAY}/projects/${name}`, {})
		.then(checkForError)
		.catch(catchError)
}

// removeUserFromProject
export const updateProject = async (
	project: HIPProject
): Promise<HIPProject> => {
	return fetch(`${API_GATEWAY}/projects`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(project),
	})
		.then(checkForError)
		.catch(catchError)
}

export const addUserToProject = async (
	name: string,
	userId: string
): Promise<any> => {
	addUserToProject(userId, 'project?.name')
}

export const getProjectDatasets = async (
	projectId: string
): Promise<BIDSDataset[]> =>
	fetch(
		`${API_GATEWAY}/tools/bids/datasets/search?query=*&ageRange=0,100&participantsCountRange=0,200&datatypes=*&owner=${projectId}&page=1&nbOfResults=2`,
		{
			headers: { requesttoken: window.OC.requestToken },
		}
	)
		.then(checkForError)
		.catch(catchError)

export const createBIDSDataset = async (
	projectId: string
): Promise<BIDSDataset> => {
	return fetch(`${process.env.REACT_APP_GATEWAY_API}/`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({}),
	})
		.then(checkForError)
		.catch(catchError)
}

export const copyBIDSFilesToBIDSDataset = async (
	projectId: string
): Promise<void> => {
	return fetch(`${process.env.REACT_APP_GATEWAY_API}/`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({}),
	})
		.then(checkForError)
		.catch(catchError)
}

export const getProjectFiles = async (path: string): Promise<File2[]> =>
	fetch(`${API_GATEWAY}/projects/files?path=${encodeURIComponent(path)}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)
