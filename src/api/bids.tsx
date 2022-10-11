import { API_GATEWAY, checkError } from './gatewayClientAPI'
import {
	BIDSDataset,
	BIDSDatasetResponse,
	BIDSSubjectFile,
	CreateBidsDatasetDto,
	CreateSubjectDto,
	EditSubjectClinicalDto,
	IError,
	IndexedBIDSDataset,
	Participant,
} from './types'

export const getBidsDatasets = async (
	owner?: string
): Promise<BIDSDataset[]> => {
	return fetch(`${API_GATEWAY}/tools/bids/datasets?owner=${owner}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)
}

export const getAndIndexBidsDatasets = async (
	owner?: string
): Promise<BIDSDataset[]> => {
	const url = `${API_GATEWAY}/tools/bids/datasets?owner=${owner}`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify({}),
	}).then(checkError)
}

export const getMatchingBidsDatasets = async (
	userId?: string,
	query?: string
): Promise<IndexedBIDSDataset[]> => {
	const url = `${API_GATEWAY}/tools/bids/datasets/search?query=${query}&owner=${userId}`
	console.log(`Get matching BIDS dataset with ${url}`)
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(response => response.json())
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
	}).then(data => data.json())
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
	}).then(data => data.json())
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
	}).then(checkError)
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
	}).then(checkError)
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
		}).then(checkError)
	} catch (error) {
		return Promise.reject(error)
	}
}
