import { API_GATEWAY, catchError, checkForError } from './gatewayClientAPI'

import { BIDSDataset, HIPProject } from './types'

export const getProjects = async (): Promise<HIPProject[]> =>
	fetch(`${process.env.REACT_APP_GATEWAY_API}/public/data/projects.json`, {})
		.then(checkForError)
		.catch(catchError)

export const getProjectDatasets = async (projectId: string): Promise<BIDSDataset[]> =>
	fetch(`${API_GATEWAY}/tools/bids/datasets/search?query=*&ageRange=0,100&participantsCountRange=0,200&datatypes=*&owner=${projectId}&page=1&nbOfResults=2`, {
	headers: {
		'Content-Type': 'application/json',
		requesttoken: window.OC.requestToken,
	},
})
	.then(checkForError)
	.catch(catchError)
