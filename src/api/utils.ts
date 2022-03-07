import { ContainerState } from './types'

export const uniq = (type = 'session'): string => {
	const uniqid = `${type === 'session' ? 'session' : 'app'}-${Date.now()
		.toString()
		.slice(-3)}`

	return uniqid
}

export const loading = (state: ContainerState) =>
	[
		ContainerState.CREATED,
		ContainerState.LOADING,
		ContainerState.STOPPING,
	].includes(state)
export const color = (state?: ContainerState) =>
	state &&
	[
		ContainerState.RUNNING,
		ContainerState.CREATED,
		ContainerState.LOADING,
	].includes(state)
		? 'success'
		: 'error'
