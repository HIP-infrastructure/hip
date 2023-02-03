import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import {
	createBidsDatasetsIndex,
	refreshBidsDatasetsIndex,
	queryBidsDatasets
} from '../api/bids'
import { getProjects } from '../api/projects'
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
	Container,
	BIDSFile,
	HIPCenter,
	Participant,
	UserCredentials,
	HIPProject,
} from '../api/types'

export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	user: [
		UserCredentials | null,
		React.Dispatch<React.SetStateAction<UserCredentials | null>>
	]
	centers: [
		HIPCenter[] | null,
		React.Dispatch<React.SetStateAction<HIPCenter[] | null>>
	]
	projects: [
		HIPProject[] | null,
		React.Dispatch<React.SetStateAction<HIPProject[] | null>>
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
		BIDSFile[] | undefined,
		React.Dispatch<React.SetStateAction<BIDSFile[] | undefined>>
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
	const [centers, setCenters] = useState<HIPCenter[] | null>(null)
	const [projects, setProjects] = useState<HIPProject[] | null>(null)
	const [bidsDatasets, setBidsDatasets] = useState<{
		data?: BIDSDataset[]
		error?: string
	}>()

	// BIDS Tools Store, to be renamed or refactored into a new type
	const [selectedBidsDataset, setSelectedBidsDataset] = useState<BIDSDataset>()
	const [selectedParticipants, setSelectedParticipants] =
		useState<Participant[]>()
	const [selectedFiles, setSelectedFiles] = useState<BIDSFile[]>()

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

		getCenters().then(centers => {
			if (centers) {
				setCenters(centers)
			}
		})

		getProjects().then(projects => {
			if (projects) {
				setProjects(projects)
			}
		})

		getAvailableAppList()
			.then(data => setAvailableApps({ data }))
			.catch(error => setAvailableApps({ error }))
		
		//Create initial elasticsearch index for datasets (if it does not exist yet)
		// createBidsDatasetsIndex()

		// // // Perform a full index of the BIDS datasets
		// refreshBidsDatasetsIndex(currentUser.uid)

		queryBidsDatasets(currentUser.uid || '')
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
			centers: [centers, setCenters],
			projects: [projects, setProjects],
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
			centers,
			setCenters,
			projects,
			setProjects,
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
