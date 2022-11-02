import { API_GATEWAY, catchError, checkError } from './gatewayClientAPI'

import {
	BIDSDataset,
	BIDSDatasetResponse,
	BIDSSubjectFile,
	CreateBidsDatasetDto,
	CreateSubjectDto,
	EditSubjectClinicalDto,
	IError,
	Participant,
} from './types'

export const createBidsDatasetsIndex = async (): Promise<any> => {
	const url = `${API_GATEWAY}/tools/bids/datasets/create_index`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkError)
		.catch(catchError)
}

export const indexBidsDataset = async (
	owner?: string,
	path?: string
): Promise<BIDSDataset> => {
	const url = `${API_GATEWAY}/tools/bids/dataset/index?owner=${owner}&path=${path}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkError)
		.catch(catchError)
}

export const indexBidsDatasets = async (
	owner?: string
): Promise<BIDSDataset[]> => {
	const url = `${API_GATEWAY}/tools/bids/datasets/index?owner=${owner}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkError)
		.catch(catchError)
}

export const queryBidsDatasets = async (
	userId?: string,
	query = '*',
	page = 1,
	nbOfResults = 200
): Promise<BIDSDataset[]> => {
	if (!userId) return []
	
	const url = `${API_GATEWAY}/tools/bids/datasets/search?query=${query}&owner=${userId}&page=${page}&nbOfResults=${nbOfResults}`
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then(checkError)
		.catch(catchError)
}

export const createBidsDataset = async (
	CreateBidsDatasetDto: CreateBidsDatasetDto
): Promise<BIDSDatasetResponse | IError> => {
	const url = `${API_GATEWAY}/tools/bids/dataset`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(CreateBidsDatasetDto),
	})
		.then(checkError)
		.catch(catchError)
}

export const getParticipants = async (
	path: string,
	userId: string
): Promise<Participant[]> => {
	const url = `${API_GATEWAY}/tools/bids/participants?path=${path}&owner=${userId}`
	return fetch(url, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkError)
		.catch(catchError)
}

export const getSubject = async (
	path: string,
	userId: string,
	subject: string
): Promise<BIDSSubjectFile[]> => {
	const url = `${API_GATEWAY}/tools/bids/subject?path=${path}&owner=${userId}&sub=${subject}`
	return fetch(url, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(checkError)
		.catch(catchError)
}

export const importSubject = async (
	createSubject: CreateSubjectDto
): Promise<CreateSubjectDto> => {
	const url = `${API_GATEWAY}/tools/bids/subject`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(createSubject),
	})
		.then(checkError)
		.catch(catchError)
}

export const subEditClinical = async (
	editSubject: EditSubjectClinicalDto
): Promise<EditSubjectClinicalDto> => {
	const url = `${API_GATEWAY}/tools/bids/subject`
	try {
		return await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				requesttoken: window.OC.requestToken,
			},
			body: JSON.stringify(editSubject),
		})
			.then(checkError)
			.catch(catchError)
	} catch (error) {
		return Promise.reject(error)
	}
}
