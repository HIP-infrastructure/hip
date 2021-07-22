import React, { useState } from 'react'
import useSWR from 'swr'

import { getCurrentUser } from '@nextcloud/auth'

import {
	API_CONTAINERS,
	Container,
	UserCredentials,
} from '../api/gatewayClientAPI'

export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	showWedavForm: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
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
	const [showWedavForm, setShowWedavForm] = useState(false)

	// Fetch Nextcloud user
	React.useEffect(() => {
		const currentUser = getCurrentUser() as UserCredentials
		setUser(currentUser)
	}, [])

	// Start polling containers fetch
	const { data, error } = useSWR(
		() => (user ? `${API_CONTAINERS}/${user?.uid}` : null),
		fetcher,
		{ refreshInterval: 3 * 1000 }
	)

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			currentSession: [currentSession, setCurrentSession],
			showWedavForm: [showWedavForm, setShowWedavForm],
			user: [user, setUser],
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
