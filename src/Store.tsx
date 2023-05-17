import { getCurrentUser } from '@nextcloud/auth'
import React, { useState, useRef } from 'react'
import {
	createBidsDatasetsIndex,
	queryBidsDatasets,
	refreshBidsDatasetsIndex,
} from './api/bids'
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
	const [timesRun, setTimesRun] = useState(0)
	const counter = useRef<number>(0)
	const effectCalled = useRef<boolean>(false)
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
				console.error(error) // eslint-disable-line no-console
			})

		getCenters()
			.then(centers => {
				if (centers) {
					setCenters(centers.sort((a,b) => a.label.localeCompare(b.label)))
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

		// Perform a full index of the BIDS datasets
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			if (!effectCalled.current) refreshBidsDatasetsIndex(currentUser.uid)
		} else {
			refreshBidsDatasetsIndex(currentUser.uid)
		}

		queryBidsDatasets(
			currentUser.uid || '',
			'*',
			1,
			200,
			[0, 100],
			[0, 200],
			[]
		)
			.then(data => {
				const { datasets } = data
				if (datasets) {
					const uniqueArray = datasets.filter((obj, index, arr) => {
						return arr.findIndex(t => t.Path === obj.Path) === index
					})
					setBidsDatasets({ data: uniqueArray })
				}
			})
			.catch(error => setBidsDatasets({ error }))

		getDesktopsAndApps('private', currentUser.uid || '', [])
			.then(data => setContainers(data))
			.catch(error => {
				console.error(error) // eslint-disable-line no-console
			})

		// udpade timesRun to track if the component is re-mounted in development mode
		counter.current += 1
		setTimesRun(counter.current)
		effectCalled.current = true
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
			BIDSDatasets: [bidsDatasets, setBidsDatasets],
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
