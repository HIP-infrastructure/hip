import React, { useState } from 'react'
import useSWR from 'swr'

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
	showWedavForm: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
	currentSession: [
		Container | null,
		React.Dispatch<React.SetStateAction<Container | null>>
	];
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
	const [currentSession, setCurrentSession] = useState<Container | null>(null)
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [showWedavForm, setShowWedavForm] = useState(false)

	// Fetch Nextcloud user
	React.useEffect(() => {
		const currentUser = getCurrentUser() as UserCredentials
		setUser(currentUser)

		const apps = getAvailableAppList().then(
			r => setAvailableApps(r)
		)
	}, [])

	// Start polling containers fetch
	const { data, error } = useSWR<any, Error | undefined>(
		() => (
			user ? 
				(user.uid === 'hipadmin' ?
					`${API_CONTAINERS}` :
					`${API_CONTAINERS}/${user?.uid}`
				) : 
				null
		),
		fetcher,
		{ refreshInterval: 3 * 1000 }
	)

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			currentSession: [currentSession, setCurrentSession],
			showWedavForm: [showWedavForm, setShowWedavForm],
			user: [user, setUser],
			availableApps,
			containers: [data?.data || [], error],
		}),
		[
			debug,
			setDebug,
			currentSession,
			setCurrentSession,
			showWedavForm,
			setShowWedavForm,
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
