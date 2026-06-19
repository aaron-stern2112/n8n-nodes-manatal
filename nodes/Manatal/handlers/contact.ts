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

export async function contactExecute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const id = getManatalIdParameter.call(this, 'contactId', i);
		return manatalApiRequest.call(this, 'GET', `/contacts/${id}/`);
	} else if (operation === 'getMany') {
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		if (filters.organization !== undefined && filters.organization !== '') {
			filters.organization_id = normalizeManatalId(filters.organization);
			delete filters.organization;
		}
		return handleGetMany.call(this, '/contacts/', i, { ...filters });
	} else if (operation === 'create') {
		const fullName = this.getNodeParameter('fullName', i) as string;
		const organization = getManatalIdParameter.call(this, 'organization', i);
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		const body: IDataObject = { full_name: fullName, organization, ...additionalFields };
		parseJsonField(body, 'custom_fields');
		return manatalApiRequest.call(this, 'POST', '/contacts/', body);
	} else if (operation === 'update') {
		const id = getManatalIdParameter.call(this, 'contactId', i);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
		normalizeLocatorField(updateFields, 'organization');
		parseJsonField(updateFields, 'custom_fields');
		return manatalApiRequest.call(this, 'PATCH', `/contacts/${id}/`, updateFields);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "contact"`, { itemIndex: i });
}
