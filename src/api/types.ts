export interface APIContainersResponse {
	data?: Container[]
	error?: string
}
export interface Container {
	id: string
	name: string
	user: string
	url: string
	state: ContainerState
	error: Error | null
	type: ContainerType
	parentId?: string
	apps?: AppContainer[]
}

export interface GroupFolder {
	id: number
	label: string
	path: string
}

export type AppContainer = Container & ContainerOptions

export interface ContainerOptions {
	app: string
}

export enum ContainerState {
	UNINITIALIZED = 'uninitialized',
	CREATED = 'created',
	LOADING = 'loading',
	RUNNING = 'running',
	STOPPING = 'stopping',
	PAUSED = 'paused',
	EXITED = 'exited',
	DESTROYED = 'destroyed',
}

export enum ContainerType {
	SESSION = 'server',
	APP = 'app',
}

export interface UserCredentials {
	uid?: string
	displayName?: string | null
	isAdmin?: boolean
	password?: string
	groups?: string[]
}

export interface NavigationItem {
	id?: string
	route?: string | null
	link?: string | null
	icon: JSX.Element
	label: string
	children: NavigationItem[]
	title?: string | null
	color?: string | null
	image?: string | null
	disabled: boolean
}

export interface User {
	id: string
	displayName?: string | null
	email?: string | null
	lastLogin: number
	groups?: string[]
	enabled: boolean
}
export interface HIPGroup {
	label: string
	id: string
	pi: string
	email: string
	city: string
	country: string
	logo?: string
	description?: string
	website?: string
	socialnetwork: {
		[index: string]: string
	}
	users?: User[]
}

export interface Application {
	name: string
	description: string
	status: string
	url: string
	icon: string
	state: 'ready' | 'beta' | 'faulty'
	version: string
	label?: string
}

export interface Workflow {
	id: string
	label: string
	description: string
	state: 'ready' | 'beta' | 'faulty'
	enabled: boolean
}

export interface TreeNode {
	key: string
	label: string
	icon: string
	data: Document
	children?: boolean
}

export interface File2 {
	name: string
	isDirectory: boolean
	path: string
	parentPath?: string
}

export interface Document {
	type: string
	size: number
	updated: string
	name: string
	path: string
	tags: number[]
	id: number
}

export interface Tag {
	label: string
	id: number
}

export interface Participant {
	[key: string]: string
}

export type BIDSDatasetResponse = { data?: BIDSDataset[]; error?: Error }

// export interface BIDSDataset {
// 	id: string
// 	path?: string
// 	participants?: Participant[]
// 	Name: string
// 	BIDSVersion?: string
// 	License?: string
// 	Authors?: string[]
// 	Acknowledgements?: string
// 	HowToAcknowledge?: string
// 	Funding?: string[]
// 	ReferencesAndLinks?: string[]
// 	DatasetDOI?: string
// }

export interface BIDSDataset {
	id: string
	User?: string
	Path?: string
	Name: string
	BIDSVersion?: string
	License?: string
	Authors?: string[]
	Acknowledgements?: string
	HowToAcknowledge?: string
	Funding?: string[]
	ReferencesAndLinks?: string[]
	DatasetDOI?: string
	CreationDate: string
	ParticipantsCount: number
	ParticipantsGroups: string[]
	AgeRange: number[]
	Participants?: Participant[]
	SessionsCount?: number
	Tasks?: string[]
	RunsCount?: number
	DataTypes?: string[]
	Formats?: string[]
	SEEGChannelCount?: number
	SamplingFrequency?: number
	RecordingDuration?: number
	EventsFileCount?: number
	Size?: string
	FileCount?: number
}

export type IOption = { label: string; inputValue?: string }

export interface IEntity {
	name: string
	label: string
	description: string
	requirements: {
		dataType: string
		required: boolean
		modalities?: string[]
	}[]
	options: IOption[]
}

export interface ISearch {
	name: string
	isPaginated: true
	entries: ISearchResult[]
}

export interface ISearchResult {
	thumbnailUrl: string
	title: string
	subline: string
	resourceUrl: string
	icon: string
	rounded: boolean
	attributes: {
		fileId: string
		path: string
	}
}

export interface BIDSSubjectFile {
	sub: string
	ses: string
	acq: string
	ce: string
	rec: string
	run: string
	mod: string
	modality: string
	fileLoc: string
	AnatJSON: Record<string, unknown>
}

export interface Entity {
	id: string
	label: string
	required: boolean
	type: 'string' | 'number'
	value?: string | number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	modalities?: any
}

type CellId = string | number

export interface GridApiRef {
	updateRows: (
		params: [{ id?: CellId; isNew?: boolean; _action?: string }]
	) => void
	setRowMode: (id: CellId, mode: string) => void
	scrollToIndexes: ({ rowIndex }: { rowIndex: number }) => void
	setCellFocus: (id: CellId, mode: string) => void
	getRowsCount: (id?: CellId) => number
	getRow: (id: CellId) => { isNew?: boolean }
	commitRowChange: (id: CellId) => void
	getRowMode: (id: CellId) => string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getEditRowsModel: () => any
}

export interface IError {
	statusCode: string
	message: string
}

export interface CreateBidsDatasetDto {
	readonly owner: string
	readonly parent_path: string // relative path for user or group eg: data/file.md

	readonly DatasetDescJSON: {
		readonly Name: string
		readonly BIDSVersion: string
		readonly License: string
		readonly Authors: string[]
		readonly Acknowledgements: string
		readonly HowToAcknowledge: string
		readonly Funding: string[]
		readonly ReferencesAndLinks: string[]
		readonly DatasetDOI: string
	}
}

export interface CreateSubjectDto {
	readonly owner: string
	readonly dataset_path: string
	subjects: Participant[]
	readonly files: BIDSFile[]
}

export interface EditSubjectClinicalDto {
	readonly owner: string
	readonly dataset: string
	readonly path: string // relative path for user or group eg: data/file.md
	readonly subject: string
	readonly clinical: {
		[key: string]: string
	}
}

export interface BIDSFile {
	modality: string
	subject: string
	path: string
	entities?: {
		[key: string]: string
	}
}

export interface GetBidsDatasetDto {
	readonly owner: string
	readonly dataset: string
	readonly path: string // relative path for user or group eg: data/file.md
	BIDS_definitions: string[]
}

export class BidsDatasetDefinitionDto {
	'BIDS_definitions': {
		Anat: {
			keylist: string[]
			required_keys: string[]
			allowed_modalities: string[]
			allowed_file_formats: string[]
			readable_file_formats: string[]
			required_protocol_keys: []
		}
		AnatJSON: {
			keylist: string[]
		}
		Ieeg: {
			keylist: string[]
			required_keys: string[]
			allowed_modalities: string[]
			allowed_file_formats: string[]
			readable_file_formats: string[]
			channel_type: string[]
			mod_channel_type: string[]
			required_protocol_keys: []
		}
		IeegJSON: {
			keylist: string[]
			required_keys: string[]
		}
		DatasetDescJSON: {
			keylist: string[]
			required_keys: string[]
			filename: string
			bids_version: string
		}
	}
}
