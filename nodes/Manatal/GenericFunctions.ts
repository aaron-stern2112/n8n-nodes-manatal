import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.manatal.com/open/v3';
const WEBHOOK_BASE_URL = 'https://manahook.api.manatal.com/v1';

export async function manatalApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	baseUrl: string = BASE_URL,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		qs,
		url: `${baseUrl}${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length) {
		options.body = body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'manatalOpenAPIKey', options);
	} catch (error) {
		const httpError = error as JsonObject;
		const statusCode = (httpError.statusCode as number) ?? 0;

		const messages: Record<number, string> = {
			400: 'Bad request — check the parameters you sent.',
			401: 'Unauthorized — your API token is invalid or missing.',
			403: 'Forbidden — your account does not have permission for this action.',
			404: 'Not found — the resource ID you provided does not exist.',
			409: 'Conflict — a duplicate resource exists.',
			429: 'Rate limit exceeded — Manatal allows 100 requests per 60 seconds. Wait and retry.',
		};

		const message =
			messages[statusCode] ??
			(httpError.message as string | undefined) ??
			'An unexpected error occurred.';
		throw new NodeApiError(this.getNode(), httpError, { message });
	}
}

export async function manatalWebhookApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	return manatalApiRequest.call(this, method, endpoint, body, qs, WEBHOOK_BASE_URL);
}

export async function manatalApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let page = 1;
	const MAX_PAGES = 1000;

	while (page <= MAX_PAGES) {
		const response = await manatalApiRequest.call(this, method, endpoint, body, {
			...qs,
			page,
			page_size: 100,
		});

		const items = (response.results as IDataObject[]) ?? [];
		results.push(...items);

		if (!response.next) break;
		page++;
	}

	return results;
}

export async function handleGetMany(
	this: IExecuteFunctions,
	endpoint: string,
	i: number,
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	if (returnAll) {
		return manatalApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
	}
	const limit = this.getNodeParameter('limit', i) as number;
	const res = await manatalApiRequest.call(this, 'GET', endpoint, {}, { ...qs, page_size: limit });
	return (res.results as IDataObject[]) ?? [];
}

export function asArray(response: unknown): IDataObject[] {
	return Array.isArray(response) ? (response as IDataObject[]) : [];
}

export function parseJsonField(obj: IDataObject, key: string): void {
	if (typeof obj[key] === 'string') {
		try {
			obj[key] = JSON.parse(obj[key] as string) as IDataObject;
		} catch {
			// leave as-is; API will return a validation error with a clear message
		}
	}
}

export function normalizeManatalId(value: unknown): string | number {
	if (value && typeof value === 'object' && 'value' in value) {
		return normalizeManatalId((value as IDataObject).value);
	}

	if (typeof value === 'number') return value;

	const stringValue = String(value ?? '').trim();
	const match = stringValue.match(/\/(\d+)\/?(?:[?#].*)?$/) ?? stringValue.match(/^(\d+)$/);
	return match?.[1] ?? stringValue;
}

export function getManatalIdParameter(
	this: IExecuteFunctions,
	name: string,
	i: number,
): string | number {
	return normalizeManatalId(this.getNodeParameter(name, i));
}

export function normalizeLocatorField(obj: IDataObject, key: string): void {
	if (obj[key] !== undefined && obj[key] !== '') {
		obj[key] = normalizeManatalId(obj[key]);
	}
}

const PARENT_RESOURCES = [
	{ prefix: 'candidate',    apiBase: 'candidates',    idParam: 'candidateId'    },
	{ prefix: 'job',          apiBase: 'jobs',          idParam: 'jobId'          },
	{ prefix: 'match',        apiBase: 'matches',       idParam: 'matchId'        },
	{ prefix: 'organization', apiBase: 'organizations', idParam: 'organizationId' },
	{ prefix: 'contact',      apiBase: 'contacts',      idParam: 'contactId'      },
] as const;

const PARENT_RESOURCE_MAP: Record<string, { apiBase: string; idParam: string }> = Object.fromEntries(
	PARENT_RESOURCES.flatMap(({ prefix, apiBase, idParam }) =>
		['Note', 'Attachment'].map((suffix) => [
			`${prefix}${suffix}`,
			{ apiBase, idParam },
		]),
	),
);

export function parentResourcePath(resource: string): { apiBase: string; idParam: string } {
	const entry = PARENT_RESOURCE_MAP[resource];
	if (!entry) throw new Error(`No parent resource path mapping found for resource "${resource}"`);
	return entry;
}
