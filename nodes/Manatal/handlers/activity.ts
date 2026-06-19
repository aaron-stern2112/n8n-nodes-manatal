import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { asArray, getManatalIdParameter, manatalApiRequest, parentResourcePath } from '../GenericFunctions';

export async function activityExecute(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const { apiBase, idParam } = parentResourcePath(resource);
	const parentId = getManatalIdParameter.call(this, idParam, i);

	if (operation === 'getMany') {
		return asArray(await manatalApiRequest.call(this, 'GET', `/${apiBase}/${parentId}/activities/`));
	} else if (operation === 'get') {
		const activityId = getManatalIdParameter.call(this, 'activityId', i);
		return manatalApiRequest.call(this, 'GET', `/${apiBase}/${parentId}/activities/${activityId}/`);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "${resource}"`, { itemIndex: i });
}
