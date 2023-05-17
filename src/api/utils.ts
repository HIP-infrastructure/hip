import { ContainerState } from './types'

export const loading = (state: ContainerState) =>
	[
		ContainerState.CREATED,
		ContainerState.PAUSING,
		ContainerState.RESUMING,
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
		: 'info'
