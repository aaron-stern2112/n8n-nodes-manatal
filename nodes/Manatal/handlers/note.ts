import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { asArray, getManatalIdParameter, manatalApiRequest, parentResourcePath } from '../GenericFunctions';

export async function noteExecute(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const { apiBase, idParam } = parentResourcePath(resource);
	const parentId = getManatalIdParameter.call(this, idParam, i);

	if (operation === 'getMany') {
		return asArray(await manatalApiRequest.call(this, 'GET', `/${apiBase}/${parentId}/notes/`));
	} else if (operation === 'get') {
		const noteId = getManatalIdParameter.call(this, 'noteId', i);
		return manatalApiRequest.call(this, 'GET', `/${apiBase}/${parentId}/notes/${noteId}/`);
	} else if (operation === 'create') {
		const info = this.getNodeParameter('info', i) as string;
		return manatalApiRequest.call(this, 'POST', `/${apiBase}/${parentId}/notes/`, { info });
	} else if (operation === 'update') {
		const noteId = getManatalIdParameter.call(this, 'noteId', i);
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
		return manatalApiRequest.call(this, 'PATCH', `/${apiBase}/${parentId}/notes/${noteId}/`, updateFields);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "${resource}"`, { itemIndex: i });
}
