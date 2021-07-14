import React, { useState } from 'react'
import useSWR from 'swr'

import { getCurrentUser } from '@nextcloud/auth'

import { API_SESSIONS, Container, UserCredentials } from '../gatewayClientAPI'

export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	currentSession: [
		Container | null,
		React.Dispatch<React.SetStateAction<Container | null>>
	]
	user: [
		UserCredentials | null,
		React.Dispatch<React.SetStateAction<UserCredentials | null>>
	]
	containers: [Container[] | null, Error]
}

export const fetcher = (url: string): Promise<void> =>
	fetch(url).then(r => r.json())

export const AppContext = React.createContext<IAppState>({} as IAppState)

// Provide state for the HIP app
export const AppStoreProvider = ({
	children,
}: {
	children: JSX.Element
}): JSX.Element => {
	const [debug, setDebug] = useState(false)
	const [currentSession, setCurrentSession] = useState<Container | null>(null)
	const [user, setUser] = useState<UserCredentials | null>(null)

	// Fetch Nextcloud user
	React.useEffect(() => {
		const currentUser = getCurrentUser() as UserCredentials
		setUser(currentUser)
	}, [])

	// Start polling containers fetch
	const { data, error } = useSWR(
		() => `${API_SESSIONS}/${user?.uid}`,
		fetcher,
		{ refreshInterval: 3 * 1000 }
	)

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			currentSession: [currentSession, setCurrentSession],
			user: [user, setUser],
			containers: [data?.data || [], error],
		}),
		[
			debug,
			setDebug,
			currentSession,
			setCurrentSession,
			user,
			setUser,
			data,
			error,
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
