import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import { getAndIndexBidsDatasets } from '../api/bids'

import {
	getAvailableAppList,
	getCenters,
	getContainers,
	getUser,
	isLoggedIn,
} from '../api/gatewayClientAPI'
import {
	Application,
	BIDSDataset,
	IndexedBIDSDataset,
	Container,
	File,
	HIPGroup,
	Participant,
	UserCredentials,
} from '../api/types'

export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	user: [
		UserCredentials | null,
		React.Dispatch<React.SetStateAction<UserCredentials | null>>
	]
	hipGroups: [
		HIPGroup[] | null,
		React.Dispatch<React.SetStateAction<HIPGroup[] | null>>
	]
	availableApps: [
		{ data?: Application[]; error?: string } | undefined,
		React.Dispatch<
			React.SetStateAction<{ data?: Application[]; error?: string } | undefined>
		>
	]
	containers: [
		{ data?: Container[]; error?: string } | undefined,
		React.Dispatch<
			React.SetStateAction<{ data?: Container[]; error?: string } | undefined>
		>
	]
	BIDSDatasets: [
		{ data?: IndexedBIDSDataset[]; error?: string } | undefined,
		React.Dispatch<
			React.SetStateAction<{ data?: IndexedBIDSDataset[]; error?: string } | undefined>
		>
	]
	BIDSDatasetsResults: [
		{ data?: IndexedBIDSDataset[]; error?: Error } | undefined,
		React.Dispatch<
			React.SetStateAction<{ data?: IndexedBIDSDataset[]; error?: Error } | undefined>
		>
	]
	selectedBidsDataset: [
		IndexedBIDSDataset | undefined,
		React.Dispatch<React.SetStateAction<IndexedBIDSDataset | undefined>>
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

export const AppContext = React.createContext<IAppState>({} as IAppState)

// Provide state for the HIP app
export const AppStoreProvider = ({
	children,
}: {
	children: JSX.Element
}): JSX.Element => {
	const [debug, setDebug] = useState(false)
	const [availableApps, setAvailableApps] = useState<{
		data?: Application[]
		error?: string
	}>()
	const [containers, setContainers] = useState<{
		data?: Container[]
		error?: string
	}>()
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [hipGroups, setHipGroups] = useState<HIPGroup[] | null>(null)
	const [bidsDatasets, setBidsDatasets] = useState<{
		data?: IndexedBIDSDataset[]
		error?: string
	}>()
	const [bidsDatasetsResults, setBidsDatasetsResults] = useState<{
		data?: IndexedBIDSDataset[]
		error?: Error
	}>()
	const [selectedBidsDataset, setSelectedBidsDataset] = useState<IndexedBIDSDataset>()
	const [selectedParticipants, setSelectedParticipants] =
		useState<Participant[]>()
	const [selectedFiles, setSelectedFiles] = useState<File[]>()

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

		getCenters().then(groups => {
			if (groups) {
				setHipGroups(groups)
			}
		})

		getAvailableAppList()
			.then(data => setAvailableApps({ data }))
			.catch(error => setAvailableApps({ error }))

		getAndIndexBidsDatasets(currentUser.uid)
			.then(data => setBidsDatasets({ data }))
			.catch(error => setBidsDatasets({ error }))

		getContainers(currentUser)
			.then(data => setContainers({ data }))
			.catch(error => setContainers({ error }))

		setInterval(() => {
			isLoggedIn()
		}, 30 * 1000)
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			user: [user, setUser],
			hipGroups: [hipGroups, setHipGroups],
			availableApps: [availableApps, setAvailableApps],
			containers: [containers, setContainers],
			BIDSDatasets: [bidsDatasets, setBidsDatasets],
			BIDSDatasetsResults: [bidsDatasetsResults, setBidsDatasetsResults],
			selectedBidsDataset: [selectedBidsDataset, setSelectedBidsDataset],
			selectedParticipants: [selectedParticipants, setSelectedParticipants],
			selectedFiles: [selectedFiles, setSelectedFiles],
		}),
		[
			debug,
			setDebug,
			user,
			setUser,
			hipGroups,
			setHipGroups,
			containers,
			setContainers,
			availableApps,
			setAvailableApps,
			bidsDatasets,
			setBidsDatasets,
			bidsDatasetsResults,
			setBidsDatasetsResults,
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
