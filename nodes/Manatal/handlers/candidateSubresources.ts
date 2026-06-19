import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { asArray, getManatalIdParameter, handleGetMany, manatalApiRequest } from '../GenericFunctions';

type SubresourceConfig = {
	endpoint: (candidateId: string | number) => string;
	idParam: string;
	listMode: 'raw' | 'paginated';
	createParams?: string[];
};

const SUBRESOURCE_CONFIG: Record<string, SubresourceConfig> = {
	candidateNationality: {
		endpoint: (id) => `/candidates/${id}/nationalities/`,
		idParam: 'nationalityId',
		listMode: 'paginated',
		createParams: ['country'],
	},
	candidateMatch: {
		endpoint: (id) => `/candidates/${id}/matches/`,
		idParam: 'matchId',
		listMode: 'paginated',
	},
};

async function handleSubresource(
	ctx: IExecuteFunctions,
	config: SubresourceConfig,
	candidateId: string | number,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getMany') {
		if (config.listMode === 'raw')
			return asArray(await manatalApiRequest.call(ctx, 'GET', config.endpoint(candidateId)));
		return handleGetMany.call(ctx, config.endpoint(candidateId), i, {});
	}
	if (operation === 'get') {
		const itemId = getManatalIdParameter.call(ctx, config.idParam, i);
		return manatalApiRequest.call(ctx, 'GET', `${config.endpoint(candidateId)}${itemId}/`);
	}
	if (operation === 'create' || operation === 'add') {
		const body: IDataObject = {};
		for (const param of config.createParams ?? []) body[param] = ctx.getNodeParameter(param, i);
		const additionalFields = ctx.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return manatalApiRequest.call(ctx, 'POST', config.endpoint(candidateId), { ...body, ...additionalFields });
	}
	if (operation === 'update') {
		const itemId = getManatalIdParameter.call(ctx, config.idParam, i);
		const updateFields = ctx.getNodeParameter('updateFields', i) as IDataObject;
		return manatalApiRequest.call(ctx, 'PATCH', `${config.endpoint(candidateId)}${itemId}/`, updateFields);
	}
	throw new NodeOperationError(ctx.getNode(), `Unknown operation "${operation}"`, { itemIndex: i });
}

export async function candidateSubresourceExecute(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const candidateId = getManatalIdParameter.call(this, 'candidateId', i);

	const config = SUBRESOURCE_CONFIG[resource];
	if (config) return handleSubresource(this, config, candidateId, operation, i);

	// resume — non-standard URL shape (no trailing ID segment on list), no update
	if (resource === 'candidateResume') {
		if (operation === 'get')
			return asArray(await manatalApiRequest.call(this, 'GET', `/candidates/${candidateId}/resume/`));
		if (operation === 'upload') {
			const resumeFile = this.getNodeParameter('resume_file', i) as string;
			return manatalApiRequest.call(this, 'POST', `/candidates/${candidateId}/resume/`, { resume_file: resumeFile });
		}
	}

	// socialMedia — optional platform filter on getMany, no update
	if (resource === 'candidateSocialMedia') {
		if (operation === 'getMany') {
			const filters = this.getNodeParameter('filters', i) as IDataObject;
			const qs: IDataObject = {};
			if (filters.social_media) qs.social_media = filters.social_media;
			return asArray(await manatalApiRequest.call(this, 'GET', `/candidates/${candidateId}/social-media/`, {}, qs));
		}
		if (operation === 'get') {
			const socialMediaId = getManatalIdParameter.call(this, 'socialMediaId', i);
			return manatalApiRequest.call(this, 'GET', `/candidates/${candidateId}/social-media/${socialMediaId}/`);
		}
		if (operation === 'create') {
			const social_media = this.getNodeParameter('social_media', i) as string;
			const social_media_url = this.getNodeParameter('social_media_url', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return manatalApiRequest.call(this, 'POST', `/candidates/${candidateId}/social-media/`, {
				social_media,
				social_media_url,
				...additionalFields,
			});
		}
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "${resource}"`, { itemIndex: i });
}
