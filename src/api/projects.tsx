import { API_GATEWAY, catchError, checkForError } from './gatewayClientAPI'

import {
	BIDSDataset,
	BIDSDatasetDescription,
	HIPProject,
	InspectResult,
} from './types'

export const getProjects = async (): Promise<HIPProject[]> =>
	fetch(`${API_GATEWAY}/projects`, {
		headers: { requesttoken: window.OC.requestToken },
	})
		.then(checkForError)
		.catch(catchError)

export const getProjectsForUser = async (
	userId: string
): Promise<HIPProject[]> =>
	fetch(`${API_GATEWAY}/projects/users/${userId}`, {
		headers: { requesttoken: window.OC.requestToken },
	})
		.then(checkForError)
		.catch(catchError)

export const createProject = async (createProject: {
	adminId: string
	title: string
	description: string
	datasetDescription: BIDSDatasetDescription
}): Promise<HIPProject[]> => {
	return fetch(`${API_GATEWAY}/projects`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(createProject),
	})
		.then(checkForError)
		.catch(catchError)
}

export const getProject = async (name: string): Promise<HIPProject> => {
	return fetch(`${API_GATEWAY}/projects/${name}`, {
		headers: { requesttoken: window.OC.requestToken },
	})
		.then(checkForError)
		.catch(catchError)
}

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

export const deleteProject = async (name: string): Promise<HIPProject[]> => {
	return fetch(`${API_GATEWAY}/projects/${name}`, {
		method: 'DELETE',
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)
}

export const addUserToProject = async (
	userId: string,
	projectName: string
): Promise<HIPProject> =>
	fetch(`${API_GATEWAY}/projects/${projectName}/users/${userId}`, {
		method: 'POST',
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const removeUserFromProject = async (
	userId: string,
	projectName: string
): Promise<HIPProject> =>
	fetch(`${API_GATEWAY}/projects/${projectName}/users/${userId}`, {
		method: 'DELETE',
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const getProjectMetadataTree = async (
	projectName: string
): Promise<InspectResult> =>
	fetch(`${API_GATEWAY}/projects/${projectName}/metadataTree`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkForError)
		.catch(catchError)

export const importBIDSSubject = async (
	importSubjectDto: {
		datasetPath: string
		subjectId: string
	},
	projectName: string
): Promise<string> =>
	fetch(`${API_GATEWAY}/projects/${projectName}/subject`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(importSubjectDto),
	})
		.then(checkForError)
		.catch(catchError)

export const importDocument = async (
	importDocumentDto: {
		sourceFilePath: string
		targetDirPath: string
	},
	projectName: string
): Promise<string> =>
	fetch(`${API_GATEWAY}/projects/${projectName}/document`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(importDocumentDto),
	})
		.then(checkForError)
		.catch(catchError)

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
