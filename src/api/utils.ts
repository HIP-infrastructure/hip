import { ContainerState } from './types'

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
