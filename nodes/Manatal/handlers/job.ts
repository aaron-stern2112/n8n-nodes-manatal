import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	getManatalIdParameter,
	handleGetMany,
	manatalApiRequest,
	normalizeLocatorField,
	normalizeManatalId,
	parseJsonField,
} from '../GenericFunctions';

export async function jobExecute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const id = getManatalIdParameter.call(this, 'jobId', i);
		return manatalApiRequest.call(this, 'GET', `/jobs/${id}/`);
	} else if (operation === 'getMany') {
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		if (filters.organization !== undefined && filters.organization !== '') {
			filters.organization_id = normalizeManatalId(filters.organization);
			delete filters.organization;
		}
		normalizeLocatorField(filters, 'creator_id');
		normalizeLocatorField(filters, 'owner_id');
		return handleGetMany.call(this, '/jobs/', i, { ...filters });
	} else if (operation === 'create') {
		const positionName = this.getNodeParameter('positionName', i) as string;
		const organization = getManatalIdParameter.call(this, 'organization', i);
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		normalizeLocatorField(additionalFields, 'owner');
		const body: IDataObject = { position_name: positionName, organization, ...additionalFields };
		parseJsonField(body, 'custom_fields');
		return manatalApiRequest.call(this, 'POST', '/jobs/', body);
	} else if (operation === 'update') {
		const id = getManatalIdParameter.call(this, 'jobId', i);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
		normalizeLocatorField(updateFields, 'owner');
		parseJsonField(updateFields, 'custom_fields');
		return manatalApiRequest.call(this, 'PATCH', `/jobs/${id}/`, updateFields);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "job"`, { itemIndex: i });
}
