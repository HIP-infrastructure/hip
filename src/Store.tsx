import { getCurrentUser } from '@nextcloud/auth'
import React, { useState } from 'react'
import { createBidsDatasetsIndex, refreshBidsDatasetsIndex } from './api/bids'
import { getCenters, getUser } from './api/gatewayClientAPI'
import { getProjects } from './api/projects'
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

const sortApps = (data: Application[]) => {
	return data.sort((a, b) => {
		const aa = a?.label || a.name
		const bb = b?.label || b.name

		return aa.localeCompare(bb)
	})
}

export interface IAppState {
	debug: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
	tooltips: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
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
	selectedProject: [
		HIPProject | null,
		React.Dispatch<React.SetStateAction<HIPProject | null>>
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
	const [showTooltip, setShowTooltip] = React.useState(false)
	const [availableApps, setAvailableApps] = useState<Application[] | null>(null)
	const [containers, setContainers] = useState<Container[] | null>(null)
	const [projectContainers, setProjectContainers] = useState<
		Container[] | null
	>(null)
	const [user, setUser] = useState<UserCredentials | null>(null)
	const [centers, setCenters] = useState<HIPCenter[] | null>(null)
	const [projects, setProjects] = useState<HIPProject[] | null>(null)
	const [selectedProject, setSelectedProject] = useState<HIPProject | null>(
		null
	)

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
				console.error(error) // eslint-disable-line no-console
			})

		getCenters()
			.then(centers => {
				if (centers) {
					setCenters(centers.sort((a, b) => a.label.localeCompare(b.label)))
				}
			})
			.catch(error => {
				console.error(error) // eslint-disable-line no-console
			})

		getProjects()
			.then(projects => {
				if (projects) {
					setProjects(projects)
				}
			})
			.catch(error => {
				setProjects([])
				console.error(error) // eslint-disable-line no-console
			})

		getAvailableAppList()
			.then(data => {
				setAvailableApps(sortApps(data))
			})
			.catch(error => {
				console.error(error) // eslint-disable-line no-console
			})

		// Create initial elasticsearch index for datasets (if it does not exist yet)
		createBidsDatasetsIndex()
			.then(() => {
				return
			})
			.catch(error => {
				throw error
			})

		// Perform a full index of the BIDS datasets
		refreshBidsDatasetsIndex(currentUser.uid)
			.then(() => {
				return
			})
			.catch(error => {
				throw error
			})

		getDesktopsAndApps('private', currentUser.uid || '', [])
			.then(data => setContainers(data))
			.catch(error => {
				console.error(error) // eslint-disable-line no-console
			})
	}, [])

	const value: IAppState = React.useMemo(
		() => ({
			debug: [debug, setDebug],
			tooltips: [showTooltip, setShowTooltip],
			user: [user, setUser],
			centers: [centers, setCenters],
			projects: [projects, setProjects],
			selectedProject: [selectedProject, setSelectedProject],
			availableApps: [availableApps, setAvailableApps],
			containers: [containers, setContainers],
			projectContainers: [projectContainers, setProjectContainers],
			selectedBidsDataset: [selectedBidsDataset, setSelectedBidsDataset],
			selectedParticipants: [selectedParticipants, setSelectedParticipants],
			selectedFiles: [selectedFiles, setSelectedFiles],
		}),
		[
			debug,
			setDebug,
			showTooltip,
			setShowTooltip,
			user,
			setUser,
			centers,
			setCenters,
			projects,
			setProjects,
			selectedProject,
			setSelectedProject,
			containers,
			setContainers,
			projectContainers,
			setProjectContainers,
			availableApps,
			setAvailableApps,
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
