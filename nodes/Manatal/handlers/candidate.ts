import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	asArray,
	getManatalIdParameter,
	handleGetMany,
	manatalApiRequest,
	normalizeLocatorField,
	parseJsonField,
} from '../GenericFunctions';

export async function candidateExecute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const id = getManatalIdParameter.call(this, 'candidateId', i);
		const [candidate, educationsRaw, experiencesRaw] = await Promise.all([
			manatalApiRequest.call(this, 'GET', `/candidates/${id}/`),
			manatalApiRequest.call(this, 'GET', `/candidates/${id}/educations/`),
			manatalApiRequest.call(this, 'GET', `/candidates/${id}/experiences/`),
		]);
		return { ...candidate, educations: asArray(educationsRaw), experiences: asArray(experiencesRaw) };
	} else if (operation === 'getMany') {
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		normalizeLocatorField(filters, 'owner_id');
		return handleGetMany.call(this, '/candidates/', i, { ...filters });
	} else if (operation === 'create') {
		const fullName = this.getNodeParameter('fullName', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		normalizeLocatorField(additionalFields, 'owner');
		const body: IDataObject = { full_name: fullName, ...additionalFields };
		parseJsonField(body, 'custom_fields');
		return manatalApiRequest.call(this, 'POST', '/candidates/', body);
	} else if (operation === 'update') {
		const id = getManatalIdParameter.call(this, 'candidateId', i);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
		normalizeLocatorField(updateFields, 'owner');
		parseJsonField(updateFields, 'custom_fields');
		return manatalApiRequest.call(this, 'PATCH', `/candidates/${id}/`, updateFields);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "candidate"`, { itemIndex: i });
}
