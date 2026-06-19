import type { INodeProperties } from 'n8n-workflow';
import { CANDIDATE_MODES, CONTACT_MODES, JOB_MODES, MATCH_MODES, ORGANIZATION_MODES } from './SharedFields';

const ALL_ATTACHMENT_RESOURCES = [
	'candidateAttachment',
	'jobAttachment',
	'matchAttachment',
	'organizationAttachment',
	'contactAttachment',
];

export const attachmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ALL_ATTACHMENT_RESOURCES } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create an attachment', description: 'Upload a new attachment' },
			{ name: 'Get', value: 'get', action: 'Get an attachment', description: 'Retrieve an attachment by ID' },
			{ name: 'Get Many', value: 'getMany', action: 'Get many attachments', description: 'Retrieve all attachments' },
			{ name: 'Update', value: 'update', action: 'Update an attachment', description: 'Update an attachment' },
		],
		default: 'getMany',
	},
];

export const attachmentFields: INodeProperties[] = [
	// ── Parent ID fields ──────────────────────────────────────────────────

	{
		displayName: 'Candidate ID',
		name: 'candidateId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Candidate Get Many step upstream to retrieve IDs',
		modes: CANDIDATE_MODES,
		displayOptions: { show: { resource: ['candidateAttachment'] } },
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
		displayOptions: { show: { resource: ['jobAttachment'] } },
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
		displayOptions: { show: { resource: ['matchAttachment'] } },
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
		displayOptions: { show: { resource: ['organizationAttachment'] } },
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
		displayOptions: { show: { resource: ['contactAttachment'] } },
		description: 'Numeric ID of the contact',
	},

	// ── Attachment ID (get / update / delete) ─────────────────────────────

	{
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 7',
		hint: 'Use an Attachment → Get Many step upstream to retrieve IDs',
		displayOptions: {
			show: { resource: ALL_ATTACHMENT_RESOURCES, operation: ['get', 'update'] },
		},
		description: 'Numeric ID of the attachment',
	},

	// ── Create ────────────────────────────────────────────────────────────

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ALL_ATTACHMENT_RESOURCES, operation: ['create'] } },
		description: 'Name of the attachment',
	},
	{
		displayName: 'File URL',
		name: 'file',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/file.pdf',
		displayOptions: { show: { resource: ALL_ATTACHMENT_RESOURCES, operation: ['create'] } },
		description: 'URL pointing to the file',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ALL_ATTACHMENT_RESOURCES, operation: ['create'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the attachment',
			},
		],
	},

	// ── Update ────────────────────────────────────────────────────────────

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ALL_ATTACHMENT_RESOURCES, operation: ['update'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the attachment',
			},
			{
				displayName: 'File URL',
				name: 'file',
				type: 'string',
				default: '',
				description: 'URL pointing to the file',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the attachment',
			},
		],
	},
];
