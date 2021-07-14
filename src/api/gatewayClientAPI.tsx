import { mutate } from 'swr'
import { uniq } from './utils'

export interface Container {
	id: string
	name: string
	user: string
	url: string
	state: ContainerState
	error: Error | null
	type: ContainerType
	parentId?: string
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
	EXITED = 'exited',
	DESTROYED = 'destroyed',
}

export enum ContainerType {
	SESSION = 'server',
	APP = 'app',
}

export interface Error {
	code: string
	message: string
}

export interface UserCredentials {
	uid: string
	displayName: string | null
	isAdmin: boolean
	password?: string
	src?: 'session' | 'app'
}

export const API_GATEWAY = `${process.env.REACT_APP_GATEWAY_API}${process.env.REACT_APP_GATEWAY_API_PREFIX}`
export const API_CONTAINERS = `${API_GATEWAY}/remote-app/containers`

export const createSession = (userId: string): Promise<Container> => {
	const id = uniq('session')
	const url = `${API_CONTAINERS}/${id}/start`
	const session = fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ uid: userId }),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${userId}`)
			return r.json()
		})
		.then(j => j.data)

	return session
}

export const createApp = (
	session: Container,
	user: UserCredentials,
	name = 'brainstorm'
): Promise<Container> => {
	const aid = uniq('app')
	const url = `${API_CONTAINERS}/${session.id}/apps/${aid}/start`
	const app = fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ app: name, uid: user.uid, password: user.password }),
	})
		.then(r => {
			mutate(`${API_CONTAINERS}/${user.uid}`)
			return r.json()
		})
		.then(j => j.data)

	return app
}

export const destroyAppsAndSession = (
	sessionId: string,
	userId: string
): void => {
	const url = `${API_CONTAINERS}/${sessionId}/destroy`
	fetch(url).then(() => mutate(`${API_CONTAINERS}/${userId}`))
}
