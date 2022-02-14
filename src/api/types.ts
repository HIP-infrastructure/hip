import React  from 'react';

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
	id: string;
	path: string;
	Name: string;
	BIDSVersion: string;
	Licence: string;
	Authors: string[];
	Acknowledgements: string;
	HowToAcknowledge: string;
	Funding: string[];
	ReferencesAndLinks: string[];
	DatasetDOI: string;
	participants?: Participant[],
	Browse: string;
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
