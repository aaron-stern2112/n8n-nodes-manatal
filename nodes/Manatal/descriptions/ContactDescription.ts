import type { INodeProperties } from 'n8n-workflow';
import { CONTACT_MODES, ORGANIZATION_MODES } from './SharedFields';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['contact'] },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a contact',
				description: 'Create a new contact',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a contact',
				description: 'Retrieve a contact by ID',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many contacts',
				description: 'Retrieve a list of contacts',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a contact',
				description: 'Update a contact',
			},
		],
		default: 'getMany',
	},
];

export const contactFields: INodeProperties[] = [
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Contact Get Many step upstream to retrieve IDs',
		modes: CONTACT_MODES,
		displayOptions: {
			show: { resource: ['contact'], operation: ['get'] },
		},
		description: 'Numeric ID of the contact',
	},

	// ── GET MANY ─────────────────────────────────────────────────────────
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['contact'], operation: ['getMany'] },
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 10,
		displayOptions: {
			show: { resource: ['contact'], operation: ['getMany'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['contact'], operation: ['getMany'] },
		},
		options: [
			{
				displayName: 'Created At (From)',
				name: 'created_at__gte',
				type: 'dateTime',
				default: '',
				description: 'Return contacts created on or after this date',
			},
			{
				displayName: 'Created At (To)',
				name: 'created_at__lte',
				type: 'dateTime',
				default: '',
				description: 'Return contacts created on or before this date',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				description: 'Filter by display name (partial match)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
			},
			{
				displayName: 'Full Name',
				name: 'full_name',
				type: 'string',
				default: '',
				description: 'Filter by name (partial match)',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'number',
				default: '',
				description: 'Filter by exact contact ID',
			},
			{
				displayName: 'Organization',
				name: 'organization',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'Filter by organization',
				modes: ORGANIZATION_MODES,
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Updated At (From)',
				name: 'updated_at__gte',
				type: 'dateTime',
				default: '',
				description: 'Return contacts updated on or after this date',
			},
			{
				displayName: 'Updated At (To)',
				name: 'updated_at__lte',
				type: 'dateTime',
				default: '',
				description: 'Return contacts updated on or before this date',
			},
		],
	},

	// ── CREATE ───────────────────────────────────────────────────────────
	{
		displayName: 'Full Name',
		name: 'fullName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['contact'], operation: ['create'] },
		},
		description: "The contact's full name",
	},
	{
		displayName: 'Organization',
		name: 'organization',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: ORGANIZATION_MODES,
		displayOptions: {
			show: { resource: ['contact'], operation: ['create'] },
		},
		description: 'The organization this contact belongs to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['contact'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'json',
				default: '{}',
				description:
					'Custom field values as a JSON object. Must be a full object — partial updates will overwrite existing values.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Description of the contact',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
				description: 'An alternative display name for the contact',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Contact email address',
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Contact phone number',
			},
		],
	},

	// ── UPDATE ───────────────────────────────────────────────────────────
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use a Contact Get Many step upstream to retrieve IDs',
		modes: CONTACT_MODES,
		displayOptions: {
			show: { resource: ['contact'], operation: ['update'] },
		},
		description: 'Numeric ID of the contact to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['contact'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'custom_fields',
				type: 'json',
				default: '{}',
				description:
					'Custom field values as a JSON object. Must be a full object — partial updates will overwrite existing values.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Display Name',
				name: 'display_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			},
			{
				displayName: 'Full Name',
				name: 'full_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Organization',
				name: 'organization',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				modes: ORGANIZATION_MODES,
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
			},
		],
	},
];
