import type { INodeProperties } from 'n8n-workflow';
import { ORGANIZATION_MODES, USER_MODES } from './SharedFields';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['organization'] },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an organization',
				description: 'Create a new organization',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an organization',
				description: 'Retrieve an organization by ID',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many organizations',
				description: 'Retrieve a list of organizations',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an organization',
				description: 'Update an organization',
			},
		],
		default: 'getMany',
	},
];

export const organizationFields: INodeProperties[] = [
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use an Organization Get Many step upstream to retrieve IDs',
		modes: ORGANIZATION_MODES,
		displayOptions: {
			show: { resource: ['organization'], operation: ['get'] },
		},
		description: 'Numeric ID of the organization',
	},

	// ── GET MANY ─────────────────────────────────────────────────────────
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['organization'], operation: ['getMany'] },
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
			show: { resource: ['organization'], operation: ['getMany'], returnAll: [false] },
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
			show: { resource: ['organization'], operation: ['getMany'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Filter by address (partial match)',
			},
			{
				displayName: 'Created At (From)',
				name: 'created_at__gte',
				type: 'dateTime',
				default: '',
				description: 'Return organizations created on or after this date',
			},
			{
				displayName: 'Created At (To)',
				name: 'created_at__lte',
				type: 'dateTime',
				default: '',
				description: 'Return organizations created on or before this date',
			},
			{
				displayName: 'Creator',
				name: 'creator_id',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'Filter by creator user',
				modes: USER_MODES,
			},
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'Filter by the external system ID',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'number',
				default: '',
				description: 'Filter by exact organization ID',
			},
			{
				displayName: 'Is Public',
				name: 'is_public',
				type: 'boolean',
				default: true,
				description: 'Whether to filter by public/private organizations',
			},
			{
				displayName: 'Is Visible',
				name: 'is_visible',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by name (partial match)',
			},
			{
				displayName: 'Owner',
				name: 'owner_id',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'Filter by owner user',
				modes: USER_MODES,
			},
			{
				displayName: 'Updated At (From)',
				name: 'updated_at__gte',
				type: 'dateTime',
				default: '',
				description: 'Return organizations updated on or after this date',
			},
			{
				displayName: 'Updated At (To)',
				name: 'updated_at__lte',
				type: 'dateTime',
				default: '',
				description: 'Return organizations updated on or before this date',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Filter by website URL (partial match)',
			},
		],
	},

	// ── CREATE ───────────────────────────────────────────────────────────
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['organization'], operation: ['create'] },
		},
		description: 'The name of the organization',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['organization'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'Address of the organization',
			},
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
				description: 'Description of the organization',
			},
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'ID of the organization in the API consumer system',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'User who owns this organization record',
				modes: USER_MODES,
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				placeholder: 'https://example.com',
				description: 'Website of the organization',
			},
		],
	},

	// ── UPDATE ───────────────────────────────────────────────────────────
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		hint: 'Use an Organization Get Many step upstream to retrieve IDs',
		modes: ORGANIZATION_MODES,
		displayOptions: {
			show: { resource: ['organization'], operation: ['update'] },
		},
		description: 'Numeric ID of the organization to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['organization'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
			},
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
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				modes: USER_MODES,
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
			},
		],
	},
];
