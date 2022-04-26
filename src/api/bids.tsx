import { API_GATEWAY } from './gatewayClientAPI'
import { BIDSDatabaseResponse, CreateBidsDatabaseDto, CreateSubjectDto } from "./types"


export const getBids = async (): Promise<BIDSDatabaseResponse> => {
    return fetch(`${API_GATEWAY}/files/bids`, {
        headers: {
            requesttoken: window.OC.requestToken,
        },
    })
        .catch(error => { throw new Error(error.message) })
        .then(data => data.json())
}

export const createBidsDatabase = async (
    createBidsDatabaseDto: CreateBidsDatabaseDto
): Promise<BIDSDatabaseResponse> => {
    const url = `${API_GATEWAY}/tools/bids/database`
    const data = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            requesttoken: window.OC.requestToken,
        },
        body: JSON.stringify(createBidsDatabaseDto),
    }).then(data => data.json())

    return data
}

export const createSubject = async (createSubject: CreateSubjectDto): Promise<CreateSubjectDto> => {
    const { database } = createSubject
    const url = `${API_GATEWAY}/tools/bids/database/${database}/subject`
    const data = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            requesttoken: window.OC.requestToken,
        },
        body: JSON.stringify(createSubject),
    }).then(data => data.json())

    return data

}