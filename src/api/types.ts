import React from 'react';

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
}

export interface Application {
	name: string
	description: string
	status: string
	url: string
	icon: string,
	state: 'ready' | 'beta' | 'faulty',
	version: string,
	label?: string
}

export interface Workflow {
	id: string;
	label: string;
	description: string;
	state: 'ready' | 'beta' | 'faulty',
	enabled: boolean
}

export interface TreeNode {
	key: string
	label: string
	icon: string
	data: Document
	children?: TreeNode[]
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
	label: string;
	id: number;
}

export type BIDSDatabaseResponse = { data?: BIDSDatabase[], error?: Error }

export interface Participant {
	[key: string]: string | number
}

export interface BIDSDatabase {
	id?: string;
	Path?: string;
	Browse?: string;
	Participants?: Participant[],
	Name: string;
	BIDSVersion: string;
	Licence: string;
	Authors: string[];
	Acknowledgements: string;
	HowToAcknowledge: string;
	Funding: string[];
	ReferencesAndLinks: string[];
	DatasetDOI: string;
}

export interface ISearch {
	name: string;
	isPaginated: true
	entries: ISearchResult[]
}

export interface ISearchResult {
	thumbnailUrl: string;
	title: string;
	subline: string;
	resourceUrl: string;
	icon: string;
	rounded: boolean,
	attributes: {
		fileId: string;
		path: string;
	}
}

export interface Modality {
	name: string;
	type: string;
}

export interface File {
	path?: string;
	modality?: string;
	entities?: Entity[]
}

export interface Entity {
    id: string;
    label: string;
    required: boolean;
    type: "string" | "number",
    value?: string | number,
	modalities?: string[]
}

type CellId = string | number

export interface GridApiRef {
	updateRows: (params: [{ id?: CellId, isNew?: boolean, _action?: string }]) => void
	setRowMode: (id: CellId, mode: string) => void
	scrollToIndexes: ({ rowIndex }: { rowIndex: number }) => void
	setCellFocus: (id: CellId, mode: string) => void
	getRowsCount: (id?: CellId) => number
	getRow: (id: CellId) => { isNew?: boolean }
	commitRowChange: (id: CellId) => void
	getRowMode: (id: CellId) => string
	getEditRowsModel: () => any
}