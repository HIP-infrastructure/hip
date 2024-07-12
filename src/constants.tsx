import { IEntity } from './api/types'

export const ROUTE_PREFIX = '/apps/hip'
export const APP_MARGIN_TOP = 50
export const DRAWER_WIDTH = 260
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


export const SERVICES = [
	{
		id: 'i2b2',
		name: 'i2b2',
		label: 'Cohort Explorer',
		description: 'i2b2 Cohort Explorer',
		url: 'https://i2b2.horus-tools.intranet.chuv/webclient2/',
		image: 'i2b2',
		target: 'self',
		status: 'on'
	},
	{
		id: 'kheops',
		name: 'Kheops',
		label: 'Images Explorer',
		description: 'Kheops DICOM Images Explorer',
		url: 'https://kheops.chuv.ch/',
		image: 'kheops',
		target: '_blank',
		status: 'on'
	},
	{
		id: 'sarus',
		name: 'Sarus',
		label: 'Remote data analytics interface',
		description: 'Remote query execution environment provided by Sarus technologies',
		url: 'https://sarus.horus-tools.intranet.chuv/',
		image: 'sarus',
		target: 'self',
		status: 'on'
	},
	{
		id: 'ckan',
		name: 'CKAN',
		label: 'Datasets Catalog',
		description: 'Datasets catalog powered by CKAN',
		url: 'https://catalog.horus-services.intranet.chuv/',
		image: 'ckan',
		target: 'self',
		status: 'on'
	},
	{
		id: 'jira',
		name: 'Jira Service Desk',
		label: 'Data request',
		description: '',
		url: 'https://jira.chuv.ch/servicedesk/customer/portal/1',
		image: 'jira',
		target: 'self',
		status: 'off'
	},
	{
		id: 'gitlab',
		name: 'Gitlab',
		label: 'Code Versioning',
		description: '',
		url: '',
		image: 'gitlab',
		target: 'self',
		status: 'off'
	},
	{
		id: 'dsw',
		name: 'DSW',
		label: 'Data stewardship wizard',
		description: '',
		url: '',
		image: 'dsw',
		target: 'self',
		status: 'off'
	}
]

export type ISERVICE = typeof SERVICES[0]
