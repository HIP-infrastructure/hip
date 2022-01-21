import React, { useState } from 'react'
import useSWR from 'swr'
import { mutate } from 'swr'

import { getCurrentUser } from '@nextcloud/auth'

import {
	API_CONTAINERS,
	Container,
	UserCredentials,
	Application,
	getAvailableAppList
} from '../api/gatewayClientAPI'

export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
	user: [
		UserCredentials | null,
		React.Dispatch<React.SetStateAction<UserCredentials | null>>
	];
	availableApps: Application[] | null;
	containers: [Container[] | null, Error | undefined];
}

export const fetcher = async (url: string): Promise<void> => {
	const res = await fetch(url)
	let message = ''

	if (!res.ok) {

		switch (true) {
			case res.status === 403:
				message = 'You have been logged out. Please log in again.'
				break;

			default:
				message = 'An error occurred while fetching the data.';
				break;
		}
		const error = new Error(message);
		error.name = `${res.status}`;

		throw error
	}

	return res.json()
}

// fetch(url).then(r => r.json())

export const AppContext = React.createContext<IAppState>({} as IAppState)

// Provide state for the HIP app
export const AppStoreProvider = ({
	children,
}: {
	children: JSX.Element
}): JSX.Element => {
	const [debug, setDebug] = useState(false)
	const [availableApps, setAvailableApps] = useState<Application[] | null>(null)
	const [user, setUser] = useState<UserCredentials | null>(null)

	// Fetch Nextcloud user
	React.useEffect(() => {
		const currentUser = getCurrentUser() as UserCredentials
		setUser(currentUser)

		getAvailableAppList().then(
			r => setAvailableApps(r)
		)

		setInterval(() => {
			mutate(`${API_CONTAINERS}/${currentUser?.uid || ''}`)
		}, 3* 1000)
	}, [])

	// Start polling containers fetch
	const { data, error } = useSWR<any, Error | undefined>(
		() => (user ? `${API_CONTAINERS}/${user?.uid}` : null),
		fetcher
	)

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			user: [user, setUser],
			availableApps,
			containers: [data?.data || [], error],
		}),
		[
			debug,
			setDebug,
			user,
			setUser,
			data,
			error,
			availableApps
		]
	)

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppStore = (): IAppState => {
	const context = React.useContext(AppContext)
	if (!context) {
		throw new Error('Wrap AppProvider!')
	}

	return context
}
