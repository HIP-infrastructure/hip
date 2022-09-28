import { API_GATEWAY, checkError } from './gatewayClientAPI'
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
import axios from 'axios'

export const getBidsDatasets = async (
	owner?: string
): Promise<BIDSDataset[]> => {
	return fetch(`${API_GATEWAY}/tools/bids/datasets?owner=${owner}`, {
		headers: {
			requesttoken: window.OC.requestToken,
		},
	}).then(checkError)
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
		body: JSON.stringify(createSubject)
	})
	.then(res => res.json())
	.catch( e => {
		console.log('Handling following exception in importSubject...')
		console.log(JSON.stringify(e))
	})

	/*
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			requesttoken: window.OC.requestToken,
		},
		body: JSON.stringify(createSubject)
	}).then(data => data.json())
	*/
	
}

export const importSubjectAxios = async (
	createSubject: CreateSubjectDto
): Promise<CreateSubjectDto> => {
	const url = `${API_GATEWAY}/tools/bids/subject`
	const body = JSON.stringify(createSubject)
	const headers = {
		headers: {
		  // Overwrite Axios's automatically set Content-Type
		  'Content-Type': 'application/json',
		  requesttoken: window.OC.requestToken
		  //'Access-Control-Allow-Origin': `${API_GATEWAY}`,
		  //'Access-Control-Allow-Credentials': 'true',
		  //'Access-Control-Allow-Methods': 'POST',
		  //'Access-Control-Allow-Headers': 'Origin,Cache-Control,Accept,X-Access-Token,X-Requested-With,Content-Type,Access-Control-Request-Method',
		}
	}

	console.log('Sending POST request with Axios to:')
	console.log(url)
	console.log(body)
	console.log(headers)
	
	return axios.post(url, body, headers)
	.then(res => res.data)
	.catch( e => {
		console.log('Handling following exception in importSubjectAxios...')
		console.log(JSON.stringify(e))
	})

}
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
