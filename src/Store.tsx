import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import {
	createBidsDatasetsIndex,
	queryBidsDatasets,
	refreshBidsDatasetsIndex,
} from './api/bids'
import { getCenters, getUser } from './api/gatewayClientAPI'
import { getProjects, getUserProjects } from './api/projects'
import { getAvailableAppList, getDesktopsAndApps } from './api/remoteApp'
import {
	Application,
	BIDSDataset,
	BIDSFile,
	Container,
	HIPCenter,
	HIPProject,
	Participant,
	UserCredentials,
} from './api/types'

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
	userProjects: [
		HIPProject[] | null,
		React.Dispatch<React.SetStateAction<HIPProject[] | null>>
	]
	availableApps: [
		Application[] | null,
		React.Dispatch<React.SetStateAction<Application[] | null>>
	]
	containers: [
		Container[] | null,
		React.Dispatch<React.SetStateAction<Container[] | null>>
	]
	projectContainers: [
		Container[] | null,
		React.Dispatch<React.SetStateAction<Container[] | null>>
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
	const [availableApps, setAvailableApps] = useState<Application[] | null>(null)
	const [containers, setContainers] = useState<Container[] | null>(null)
	const [projectContainers, setProjectContainers] = useState<
		Container[] | null
	>(null)
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [centers, setCenters] = useState<HIPCenter[] | null>(null)
	const [projects, setProjects] = useState<HIPProject[] | null>(null)
	const [userProjects, setUserProjects] = useState<HIPProject[] | null>(null)
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
			.then(data => {
				if (data) {
					setUser({
						...currentUser,
						...data,
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

		getUserProjects(currentUser.uid || '').then(projects => {
			setUserProjects(projects)
		})

		getAvailableAppList().then(data => setAvailableApps(data))

		// Create initial elasticsearch index for datasets (if it does not exist yet)
		createBidsDatasetsIndex()

		// Perform a full index of the BIDS datasets
		refreshBidsDatasetsIndex(currentUser.uid)

		queryBidsDatasets(
			currentUser.uid || '',
			'*',
			1,
			200,
			[0, 100],
			[0, 200],
			['anat', 'dwi', 'func', 'ieeg', 'eeg']
		)
			.then(data => {
				// eslint-disable-next-line no-console
				console.error('FIXME: remove duplicates at indexation time')
				const uniqueArray = data.filter((obj, index, arr) => {
					return arr.findIndex(t => t.Path === obj.Path) === index
				})
				setBidsDatasets({ data: uniqueArray })
			})
			.catch(error => setBidsDatasets({ error }))

		getDesktopsAndApps('private', currentUser.uid || '', []).then(data =>
			setContainers(data)
		)
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			user: [user, setUser],
			centers: [centers, setCenters],
			projects: [projects, setProjects],
			userProjects: [userProjects, setUserProjects],
			availableApps: [availableApps, setAvailableApps],
			containers: [containers, setContainers],
			projectContainers: [projectContainers, setProjectContainers],
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
			userProjects,
			setUserProjects,
			containers,
			setContainers,
			projectContainers,
			setProjectContainers,
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