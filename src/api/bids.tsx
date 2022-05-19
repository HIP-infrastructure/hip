import { API_GATEWAY, CheckError } from './gatewayClientAPI'
import {
	BIDSDatabaseResponse,
	CreateBidsDatabaseDto,
	CreateSubjectDto,
	EditSubjectClinicalDto,
	Participant,
} from './types'

export const getBidsDatabases = async (
	owner?: string
): Promise<BIDSDatabaseResponse> => {
	return fetch(`${API_GATEWAY}/tools/bids/databases?owner=${owner}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	})
		.then(CheckError)
		.then(data => data.json())
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
		.then(CheckError)
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
		.then(CheckError)
		.then(data => data.json())
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
		.then(CheckError)
		.then(data => data.json())
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
		.then(CheckError)
		.then(data => data?.json())
	} catch (error) {
		return Promise.reject(error)
	}
}
