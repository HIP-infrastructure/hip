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
	SERVER = 'server',
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

export const API_GATEWAY = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_API_PREFIX}`
export const API_SESSIONS = `${API_GATEWAY}/remote-app/servers`

export const createSession = (userId: string): Promise<Container> => {
	const id = uniq('session')
	const url = `${API_SESSIONS}/${id}/start/${userId}`
	const session = fetch(url)
		.then(r => {
			mutate(`${API_SESSIONS}/${userId}`)
			return r.json()
		})
		.then(j => j.data)

	return session
}

export const destroyAppsAndSession = (
	sessionId: string,
	userId: string
): void => {
	const url = `${API_SESSIONS}/${sessionId}/destroy`
	fetch(url).then(() => mutate(`${API_SESSIONS}/${userId}`))
}

export const createApp = (
	server: Container,
	user: UserCredentials,
	name = 'brainstorm'
): Promise<Container> => {
	const aid = uniq('app')
	const url = `${API_SESSIONS}/${server.id}/apps/${aid}/start/${name}/${user.uid}/${user.password}`
	const app = fetch(url)
		.then(r => {
			mutate(`${API_SESSIONS}/${user.uid}`)
			return r.json()
		})
		.then(j => j.data)

	return app
}
