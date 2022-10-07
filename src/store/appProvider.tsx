import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import { getBidsDatasets } from '../api/bids'
import {
	API_CONTAINERS,
	checkError,
	getAvailableAppList,
	getCenters,
	getContainers,
	getUser,
} from '../api/gatewayClientAPI'
import {
	Application,
	BIDSDataset,
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
	groups: [
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
		{ data?: BIDSDataset[]; error?: string } | undefined,
		React.Dispatch<
			React.SetStateAction<{ data?: BIDSDataset[]; error?: string } | undefined>
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
	const [groups, setGroups] = useState<HIPGroup[] | null>(null)
	const [bidsDatasets, setBidsDatasets] = useState<{
		data?: BIDSDataset[]
		error?: string
	}>()
	const [selectedBidsDataset, setSelectedBidsDataset] = useState<BIDSDataset>()
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
				setGroups(groups)
			}
		})

		getAvailableAppList()
			.then(data => setAvailableApps({ data }))
			.catch(error => setAvailableApps({ error }))

		getBidsDatasets(currentUser.uid)
			.then(data => setBidsDatasets({ data }))
			.catch(error => setBidsDatasets({ error }))

		getContainers(currentUser)
			.then(data => setContainers({ data }))
			.catch(error => setContainers({ error }))
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			user: [user, setUser],
			groups: [groups, setGroups],
			availableApps: [availableApps, setAvailableApps],
			containers: [containers, setContainers],
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
			containers,
			setContainers,
			availableApps,
			setAvailableApps,
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
