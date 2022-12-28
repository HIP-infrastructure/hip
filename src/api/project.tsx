import { catchError, checkForError } from './gatewayClientAPI'

import { HIPProject } from './types'

export const getProjects = async (): Promise<HIPProject[]> =>
	fetch(`${process.env.REACT_APP_GATEWAY_API}/public/data/projects.json`, {})
		.then(checkForError)
		.catch(catchError)
