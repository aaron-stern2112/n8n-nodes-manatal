import type { INodeProperties } from 'n8n-workflow';
import { CANDIDATE_MODES, CONTACT_MODES, JOB_MODES, MATCH_MODES, ORGANIZATION_MODES } from './SharedFields';

const ALL_NOTE_RESOURCES = [
	'candidateNote',
	'jobNote',
	'matchNote',
	'organizationNote',
	'contactNote',
];

export const noteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ALL_NOTE_RESOURCES } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a note', description: 'Create a new note' },
			{ name: 'Get', value: 'get', action: 'Get a note', description: 'Retrieve a note by ID' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many notes', description: 'Retrieve all notes' },
			{ name: 'Update', value: 'update', action: 'Update a note', description: 'Update a note' },
		],
		default: 'getMany',
	},
];

export const noteFields: INodeProperties[] = [
	// ── Parent ID fields (one per resource) ──────────────────────────────

	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: { show: { resource: ['candidateNote'] } },
		description: 'Numeric ID of the candidate',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Job Get Many step upstream to retrieve IDs',
		modes: JOB_MODES,
		displayOptions: { show: { resource: ['jobNote'] } },
		description: 'Numeric ID of the job',
	},
	{
		displayName: 'Match ID',
		name: 'matchId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Match Get Many step upstream to retrieve IDs',
		modes: MATCH_MODES,
		displayOptions: { show: { resource: ['matchNote'] } },
		description: 'Numeric ID of the match',
	},
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use an Organization Get Many step upstream to retrieve IDs',
		modes: ORGANIZATION_MODES,
		displayOptions: { show: { resource: ['organizationNote'] } },
		description: 'Numeric ID of the organization',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Contact Get Many step upstream to retrieve IDs',
		modes: CONTACT_MODES,
		displayOptions: { show: { resource: ['contactNote'] } },
		description: 'Numeric ID of the contact',
	},

	// ── Note ID (get / update / delete) ──────────────────────────────────

	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 7',
		hint: 'Use a Note → Get Many step upstream to retrieve IDs',
		displayOptions: {
			show: { resource: ALL_NOTE_RESOURCES, operation: ['get', 'update'] },
		},
		description: 'Numeric ID of the note',
	},

	// ── Create ────────────────────────────────────────────────────────────

	{
		displayName: 'Info',
		name: 'info',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		displayOptions: { show: { resource: ALL_NOTE_RESOURCES, operation: ['create'] } },
		description: 'Content of the note',
	},

	// ── Update ────────────────────────────────────────────────────────────

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ALL_NOTE_RESOURCES, operation: ['update'] } },
		options: [
			{
				displayName: 'Info',
				name: 'info',
				type: 'string',
				default: '',
				typeOptions: { rows: 4 },
				description: 'New content of the note',
			},
		],
	},
];
