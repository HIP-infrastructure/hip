import { mutate } from 'swr'

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

export const uniq = (type: string = 'session') => {
  const uniqid = `${type === 'session' ? 'session' : 'app'}-${Date.now()
    .toString()
    .slice(-3)}`

  return uniqid
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const createSession = (userId: string): Promise<Container> => {
  const id = uniq('session')
  const url = `${API_SESSIONS}/${id}/start/${userId}`

  return fetch(url).then(() => mutate(`${API_SESSIONS}/${userId}`))
}

export const destroyAppsAndSession = (sessionId: string, userId: string) => {
  const url = `${API_SESSIONS}/${sessionId}/destroy`
  fetch(url).then(() => mutate(`${API_SESSIONS}/${userId}`))
}

export const createApp = async (
  server: Container,
  user: UserCredentials,
  name: string = 'brainstorm'
): Promise<void> => {
  const aid = uniq('app')
  const url = `${API_SESSIONS}/${server.id}/apps/${aid}/start/${name}/${user.uid}/${user.password}`
  fetch(url).then(() => mutate(`${API_SESSIONS}/${user?.uid}`))
}
