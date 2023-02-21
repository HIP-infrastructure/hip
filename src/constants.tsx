import { IEntity } from './api/types'

export const ROUTE_PREFIX = '/apps/hip'
export const APP_MARGIN_TOP = 50
export const DRAWER_WIDTH = 240
export const POLLING = Number(process.env.REACT_APP_POLLING_INTERVAL) || 2

export const linkStyle = {
	textDecoration: 'underline',
	color: '#0277bd',
}

export const DATA_TYPES = [
	{ name: 'anat', description: 'structural imaging data' },
	{ name: 'ieeg', description: 'intracranial electroencephalography data' },
]

export const MODALITIES: {
	name: string
	type: 'anat' | 'ieeg' | 'ct'
}[] = [
	{
		name: 'T1w',
		type: 'anat',
	},
	{
		name: 'T2w',
		type: 'anat',
	},
	{
		name: 'T1rho',
		type: 'anat',
	},
	{
		name: 'T2start',
		type: 'anat',
	},
	{
		name: 'FLAIR',
		type: 'anat',
	},
	{
		name: 'ieeg',
		type: 'ieeg',
	},
	{
		name: 'photo',
		type: 'ieeg',
	},
	{
		name: 'ct',
		type: 'ct',
	},
]

export const ENTITIES: IEntity[] = [
	{
		name: 'ses',
		label: 'Session',
		description:
			'An intermediate folder in BIDS folder hierarchy to group data that go "logically" together. If used, sessions must be pertinent and consistent across subjects. (e.g. postsurgery)',
		requirements: [
			{
				dataType: 'anat',
				required: false,
			},
			{
				dataType: 'ieeg',
				required: false,
			},
			{
				dataType: 'ct',
				required: false,
			},
		],
		options: [],
	},
	{
		name: 'task',
		label: 'Task',
		description:
			'Identify the task performed by the subject during the acquisition. If used, must be consistent across subjects and sessions. (e.g. eyesclosed)',
		requirements: [
			{
				dataType: 'ieeg',
				modalities: ['ieeg'],
				required: true,
			},
		],
		options: [],
	},
	{
		name: 'acq',
		label: 'Acquisition',
		description:
			'Identify the acquisition parameters used to perform the acquisition. If used, must be consistent across subjects and sessions. (e.g. lowres)',
		requirements: [
			{
				dataType: 'anat',
				required: false,
			},
			{
				dataType: 'ieeg',
				required: false,
			},
			{
				dataType: 'ct',
				required: false,
			},
		],
		options: [],
	},
	{
		name: 'ce',
		label: 'Contrast Agent',
		description:
			'Identify contrast agent. Does not have to be consistent. (e.g. gadolinium)',
		requirements: [
			{
				dataType: 'anat',
				required: false,
			},
			{
				dataType: 'ct',
				required: false,
			},
		],
		options: [],
	},
	{
		name: 'rec',
		label: 'Reconstruction',
		description:
			'Identify reconstruction algorithms. Does not have to be consistent. (e.g. lsqr)',
		requirements: [
			{
				dataType: 'anat',
				required: false,
			},
			{
				dataType: 'ct',
				required: false,
			},
		],
		options: [],
	},
]
