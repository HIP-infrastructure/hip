import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { getBidsDatasets } from '../api/bids'
import {
	API_CONTAINERS,
	checkError,
	getAvailableAppList,
	getGroups,
	getUser,
} from '../api/gatewayClientAPI'
import {
	Application,
	BIDSDataset,
	Container,
	File,
	Group,
	Participant,
	UserCredentials,
} from '../api/types'

export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	user: [
		UserCredentials | null,
		React.Dispatch<React.SetStateAction<UserCredentials | null>>
	]
	groups: [Group[] | null, React.Dispatch<React.SetStateAction<Group[] | null>>]
	availableApps: { data?: Application[]; error?: Error } | undefined
	containers: [Container[] | null, Error | undefined]
	BIDSDatasets: [
		{ data?: BIDSDataset[]; error?: Error } | undefined,
		React.Dispatch<
			React.SetStateAction<{ data?: BIDSDataset[]; error?: Error } | undefined>
		>
	]
	selectedBidsDataset: [
		BIDSDataset | undefined,
		React.Dispatch<React.SetStateAction<BIDSDataset | undefined>>
	]
	selectedParticipants: [
		Participant[] | undefined,
		React.Dispatch<React.SetStateAction<Participant[] | undefined>>
	]
	selectedFiles: [
		File[] | undefined,
		React.Dispatch<React.SetStateAction<File[] | undefined>>
	]
}

export const fetcher = async (url: string): Promise<void> => {
	try {
		const res = await fetch(url)
		return checkError(res)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export const AppContext = React.createContext<IAppState>({} as IAppState)

// Provide state for the HIP app
export const AppStoreProvider = ({
	children,
}: {
	children: JSX.Element
}): JSX.Element => {
	const [debug, setDebug] = useState(false)
	const [availableApps, setAvailableApps] =
		useState<IAppState['availableApps']>()
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [groups, setGroups] = useState<Group[] | null>(null)
	const [bidsDatasets, setBidsDatasets] = useState<{
		data?: BIDSDataset[]
		error?: Error
	}>()
	const [selectedBidsDataset, setSelectedBidsDataset] = useState<BIDSDataset>()
	const [selectedParticipants, setSelectedParticipants] =
		useState<Participant[]>()
	const [selectedFiles, setSelectedFiles] = useState<File[]>()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, error } = useSWR<any, Error | undefined>(
		() => (user ? `${API_CONTAINERS}/${user?.uid}` : null),
		fetcher
	)

	// Fetch initial data
	React.useEffect(() => {
		const currentUser = getCurrentUser() as UserCredentials
		setUser(currentUser)

		getUser(currentUser.uid)
			.then(({ groups }) => {
				if (groups) {
					setUser({
						...currentUser,
						groups,
					})
				}
			})
			.catch(error => {
				// console.log(error)
			})

		getGroups().then(groups => {
			if (groups) {
				setGroups(groups)
			}
		})

		getAvailableAppList()
			.then(data => {
				if (data) setAvailableApps({ data })
			})
			.catch(error => {
				setAvailableApps({ error })
			})

		getBidsDatasets(currentUser.uid)
			.then(data => {
				if (data) {
					setBidsDatasets({ data })
				}
			})
			.catch(error => {
				setBidsDatasets({ error })
			})

		setInterval(() => {
			try {
				mutate(`${API_CONTAINERS}/${currentUser?.uid || ''}`)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				throw new Error(error.message)
			}
		}, 3 * 1000)
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			user: [user, setUser],
			groups: [groups, setGroups],
			availableApps,
			containers: [data?.data || null, error],
			BIDSDatasets: [bidsDatasets, setBidsDatasets],
			selectedBidsDataset: [selectedBidsDataset, setSelectedBidsDataset],
			selectedParticipants: [selectedParticipants, setSelectedParticipants],
			selectedFiles: [selectedFiles, setSelectedFiles],
		}),
		[
			debug,
			setDebug,
			user,
			setUser,
			groups,
			setGroups,
			data,
			error,
			availableApps,
			bidsDatasets,
			setBidsDatasets,
			selectedBidsDataset,
			setSelectedBidsDataset,
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
