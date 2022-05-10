import { API_GATEWAY } from './gatewayClientAPI'
import { BidsDatabaseDefinitionDto, BIDSDatabaseResponse, CreateBidsDatabaseDto, CreateSubjectDto, GetBidsDatabaseDto, Participant } from "./types"
import { stringify, parse } from 'query-string';

export const getBidsDatabases = async (owner?: string): Promise<BIDSDatabaseResponse> => {
    return fetch(`${API_GATEWAY}/tools/bids/databases?owner=${owner}`, {
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

// export const getBidsDatabase = async (getBidsDatabaseDto: GetBidsDatabaseDto): Promise<BidsDatabaseDefinitionDto> => {
//     const query = stringify(getBidsDatabaseDto, { arrayFormat: 'bracket' });
//     const url = `${API_GATEWAY}/tools/bids/database?${query}`
//     const data = fetch(url, {
//         headers: {
//             'Content-Type': 'application/json',
//             requesttoken: window.OC.requestToken,
//         }
//     }).then(data => data.json())

//     return data
// }

export const getParticipants = async (path: string, userId: string): Promise<Participant[]> => {
    const url = `${API_GATEWAY}/tools/bids/participants?path=${path}&owner=${userId}`
    const data = fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            requesttoken: window.OC.requestToken,
        },
    })
        .catch(error => { throw new Error(error.message) })
        .then(data => data.json())

    return data
}

export const importSubject = async (importSubject: CreateSubjectDto): Promise<CreateSubjectDto> => {
    const url = `${API_GATEWAY}/tools/bids/subject`
    const data = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            requesttoken: window.OC.requestToken,
        },
        body: JSON.stringify(importSubject),
    }).then(data => data.json())

    return data
}