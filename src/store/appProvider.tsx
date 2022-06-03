import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { getBidsDatabases } from '../api/bids'
import {
	API_CONTAINERS,
	checkError,
	getAvailableAppList,
} from '../api/gatewayClientAPI'
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
	availableApps: { data?: Application[]; error?: Error } | undefined
	containers: [Container[] | null, Error | undefined]
	bIDSDatabases: [
		{ data?: BIDSDatabase[]; error?: Error } | undefined,
		React.Dispatch<
			React.SetStateAction<{ data?: BIDSDatabase[]; error?: Error } | undefined>
		>
	]
	selectedBidsDatabase: [
		BIDSDatabase | undefined,
		React.Dispatch<React.SetStateAction<BIDSDatabase | undefined>>
	]
	selectedParticipants: [
		Participant[] | undefined,
		React.Dispatch<React.SetStateAction<Participant[] | undefined>>
	]
	selectedFiles: [File[] | undefined, React.Dispatch<React.SetStateAction<File[]  | undefined>>]
}

export const fetcher = async (url: string): Promise<void> => {
	const res = await fetch(url)
	return checkError(res)
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
	>()
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [bidsDatabases, setBidsDatabases] = useState<{
		data?: BIDSDatabase[]
		error?: Error
	}>()
	const [selectedBidsDatabase, setSelectedBidsDatabase] = useState<
		BIDSDatabase
	>()
	const [selectedParticipants, setSelectedParticipants] = useState<
		Participant[]
	>()
	const [selectedFiles, setSelectedFiles] = useState<File[]>()

	const { data, error } = useSWR<any, Error | undefined>(
		() => (user ? `${API_CONTAINERS}/${user?.uid}` : null),
		fetcher
	)

	// Fetch initial data
	React.useEffect(() => {
		const currentUser = getCurrentUser() as UserCredentials
		setUser(currentUser)

		getAvailableAppList()
			.then(data => {
				if (data) setAvailableApps({ data })
			})
			.catch(error => {
				setAvailableApps({ error })
			})

		getBidsDatabases(currentUser.uid)
			.then(data => {
				if (data) {
					setBidsDatabases({ data })
				}
			})
			.catch(error => {
				setBidsDatabases({ error })
			})

		setInterval(() => {
			try {
				mutate(`${API_CONTAINERS}/${currentUser?.uid || ''}`)
			} catch (error: any) {
				throw new Error(error.message)
			}	
		}, 3 * 1000)
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			user: [user, setUser],
			availableApps,
			containers: [data?.data || [], error],
			bIDSDatabases: [bidsDatabases, setBidsDatabases],
			selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
			selectedParticipants: [selectedParticipants, setSelectedParticipants],
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
			selectedParticipants,
			setSelectedParticipants,
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
