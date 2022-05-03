import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { getBidsDatabases } from '../api/bids'
import { API_CONTAINERS, getAvailableAppList } from '../api/gatewayClientAPI'
import {
	Application,
	BIDSDatabase,
	Container,
	File,
	Participant,
	UserCredentials,
} from '../api/types'
export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	user: [
		UserCredentials | null,
		React.Dispatch<React.SetStateAction<UserCredentials | null>>
	]
	availableApps: { apps: Application[] | null; error: Error | null }
	containers: [Container[] | null, Error | undefined]
	bidsDatabases: [
		BIDSDatabase[] | null,
		React.Dispatch<React.SetStateAction<BIDSDatabase[] | null>>
	]
	selectedBidsDatabase: [
		BIDSDatabase,
		React.Dispatch<React.SetStateAction<BIDSDatabase>>
	]
	participants: [
		Participant[] | null,
		React.Dispatch<React.SetStateAction<Participant[] | null>>
	]
	selectedParticipant: [
		Participant,
		React.Dispatch<React.SetStateAction<Participant>>
	]
	selectedFiles: [File[], React.Dispatch<React.SetStateAction<File[]>>]
}

export const fetcher = async (url: string): Promise<void> => {
	const res = await fetch(url)
	let message = ''

	if (!res.ok) {
		switch (true) {
			case res.status === 403:
				message = 'You have been logged out. Please log in again.'
				break

			default:
				message = 'An error occurred while fetching the data.'
				break
		}
		const error = new Error(message)
		error.name = `${res.status}`

		throw error
	}

	return res.json()
}

export const AppContext = React.createContext<IAppState>({} as IAppState)

// Provide state for the HIP app
export const AppStoreProvider = ({
	children,
}: {
	children: JSX.Element
}): JSX.Element => {
	const [debug, setDebug] = useState(false)
	const [availableApps, setAvailableApps] = useState<
		IAppState['availableApps']
	>({ apps: [], error: null })
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [bidsDatabases, setBidsDatabases] = useState<BIDSDatabase[] | null>(
		null
	)
	const [selectedBidsDatabase, setSelectedBidsDatabase] = useState<
		BIDSDatabase
	>()
	const [participants, setParticipants] = useState<
		Participant[]
	>()
	const [selectedParticipant, setSelectedParticipant] = useState<Participant>()
	const [selectedFiles, setSelectedFiles] = useState<IFile[]>()

	const { data, error } = useSWR<any, Error | undefined>(
		() => (user ? `${API_CONTAINERS}/${user?.uid}` : null),
		fetcher
	)

	// Fetch initial data
	React.useEffect(() => {
		const currentUser = getCurrentUser() as UserCredentials
		setUser(currentUser)

		getAvailableAppList().then(({ ...data }) => {
			setAvailableApps(data)
		})

		getBidsDatabases().then(response => {
			if (response.error) {
				throw new Error(error?.message)
			}

			if (response.data) setBidsDatabases(response.data)
		})

		setInterval(() => {
			mutate(`${API_CONTAINERS}/${currentUser?.uid || ''}`)
		}, 3 * 1000)
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			user: [user, setUser],
			availableApps,
			containers: [data?.data || [], error],
			bidsDatabases: [bidsDatabases, setBidsDatabases],
			selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
			participants: [participants, setParticipants],
			selectedParticipant: [selectedParticipant, setSelectedParticipant],
			selectedFiles: [selectedFiles, setSelectedFiles],
		}),
		[
			debug,
			setDebug,
			user,
			setUser,
			data,
			error,
			availableApps,
			bidsDatabases,
			setBidsDatabases,
			selectedBidsDatabase,
			setSelectedBidsDatabase,
			participants,
			setParticipants,
			selectedParticipant,
			setSelectedParticipant,
			selectedFiles,
			setSelectedFiles,
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
