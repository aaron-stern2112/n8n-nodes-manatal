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

export async function matchExecute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const id = getManatalIdParameter.call(this, 'matchId', i);
		return manatalApiRequest.call(this, 'GET', `/matches/${id}/`);
	} else if (operation === 'getMany') {
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		return handleGetMany.call(this, '/matches/', i, { ...filters });
	} else if (operation === 'create') {
		const candidateId = getManatalIdParameter.call(this, 'candidateId', i);
		const jobId = getManatalIdParameter.call(this, 'jobId', i);
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		normalizeLocatorField(additionalFields, 'owner');
		const body: IDataObject = { candidate: candidateId, job: jobId, ...additionalFields };
		parseJsonField(body, 'custom_fields');
		return manatalApiRequest.call(this, 'POST', '/matches/', body);
	} else if (operation === 'update') {
		const id = getManatalIdParameter.call(this, 'matchId', i);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
		normalizeLocatorField(updateFields, 'owner');
		parseJsonField(updateFields, 'custom_fields');
		// The API requires job_pipeline_stage as a nested object {id: value}
		if (updateFields.job_pipeline_stage !== undefined && updateFields.job_pipeline_stage !== '') {
			updateFields.job_pipeline_stage = { id: normalizeManatalId(updateFields.job_pipeline_stage) };
		}
		return manatalApiRequest.call(this, 'PATCH', `/matches/${id}/`, updateFields);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "match"`, { itemIndex: i });
}
