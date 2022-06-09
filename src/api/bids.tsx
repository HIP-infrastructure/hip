import { API_GATEWAY, checkError } from './gatewayClientAPI'
import {
	BIDSDatabase,
	BIDSDatabaseResponse,
	BIDSSubjectFile,
	CreateBidsDatabaseDto,
	CreateSubjectDto,
	EditSubjectClinicalDto,
	Participant,
} from './types'

export const getBidsDatabases = async (
	owner?: string
): Promise<BIDSDatabase[]> => {
	return fetch(`${API_GATEWAY}/tools/bids/databases?owner=${owner}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
	.then(checkError)
}

export const createBidsDatabase = async (
	createBidsDatabaseDto: CreateBidsDatabaseDto
): Promise<BIDSDatabaseResponse> => {
	const url = `${API_GATEWAY}/tools/bids/database`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(createBidsDatabaseDto),
	})
		.then(data => data.json())
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
		.then(data => data.json())
}

export const getSubject = async (
	path: string,
	userId: string,
	subject: string,
): Promise<BIDSSubjectFile[]> => {
	const url = `${API_GATEWAY}/tools/bids/subject?path=${path}&owner=${userId}&sub=${subject}`
	return fetch(url, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
	.then(checkError)
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
	} catch (error) {
		return Promise.reject(error)
	}
}
