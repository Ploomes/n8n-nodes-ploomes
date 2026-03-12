import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import {
	resourceOptions,
	operationProperties,
	resourceEndpoints,
	idFields,
} from './PloomesResources';

import {
	odataOptions,
	bodyFields,
	buildFilterString,
	buildExpandString,
} from './ODataOptions';

// ─── In-memory cache ────────────────────────────────────────────────────────

interface CacheEntry {
	data: unknown;
	timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();

function getCacheKey(url: string, qs: Record<string, string>): string {
	const sortedQs = Object.keys(qs)
		.sort()
		.map((k) => `${k}=${qs[k]}`)
		.join('&');
	return `${url}?${sortedQs}`;
}

function getCachedResponse(key: string, ttlSeconds: number): unknown | undefined {
	const entry = responseCache.get(key);
	if (!entry) return undefined;
	if (Date.now() - entry.timestamp > ttlSeconds * 1000) {
		responseCache.delete(key);
		return undefined;
	}
	return entry.data;
}

function setCacheResponse(key: string, data: unknown): void {
	responseCache.set(key, { data, timestamp: Date.now() });
}

// ─── Node implementation ────────────────────────────────────────────────────

export class Ploomes implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ploomes CRM',
		name: 'ploomes',
		icon: 'file:ploomes.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Ploomes CRM API with full OData support',
		defaults: {
			name: 'Ploomes CRM',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main, NodeConnectionTypes.Main, NodeConnectionTypes.Main],
		outputNames: ['Sucesso', 'Erro', 'Timeout'],
		credentials: [
			{
				name: 'ploomesApi',
				required: true,
			},
		],
		properties: [
			resourceOptions,
			...operationProperties,
			...idFields,
			...odataOptions,
			...bodyFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const successData: INodeExecutionData[] = [];
		const errorData: INodeExecutionData[] = [];
		const timeoutData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {

				const endpoint = resourceEndpoints[resource];
				if (!endpoint) {
					throw new Error(`Unknown resource: ${resource}`);
				}

				let method: IHttpRequestMethods;
				let url: string = endpoint.basePath;
				let body: object | undefined;
				const qs: Record<string, string> = {};

				switch (operation) {
					case 'getAll': {
						method = 'GET';

						// OData parameters with optimized defaults
						const top = this.getNodeParameter('top', i, 1) as number;
						const skip = this.getNodeParameter('skip', i, 0) as number;
						const select = this.getNodeParameter('select', i, 'Id') as string;
						const orderby = this.getNodeParameter('orderby', i, 'Id') as string;

						if (top) qs['$top'] = String(top);
						if (skip) qs['$skip'] = String(skip);
						if (select) qs['$select'] = select;
						if (orderby) qs['$orderby'] = orderby;

						// Filter
						const useFilterBuilder = this.getNodeParameter('useFilterBuilder', i, true) as boolean;
						if (useFilterBuilder) {
							const filterConditionsData = this.getNodeParameter(
								'filterConditions.conditions',
								i,
								[],
							) as Array<{
								field: string;
								operator: string;
								value: string;
								valueType: string;
								logicalOperator: string;
							}>;

								const customPropertyFiltersData = this.getNodeParameter(
								'customPropertyFilters.filters',
								i,
								[],
							) as Array<{
								fieldId: number;
								valueProperty: string;
								operator: string;
								value: string;
								isNumeric: boolean;
							}>;

								const collectionFiltersData = this.getNodeParameter(
								'collectionFilters.filters',
								i,
								[],
							) as Array<{
								filterType: string;
								collection: string;
								field: string;
								operator: string;
								value: string;
								logicalOperator: string;
							}>;

							const filterStr = buildFilterString(filterConditionsData, customPropertyFiltersData, collectionFiltersData);
							if (filterStr) {
								qs['$filter'] = filterStr;
							}
						} else {
							const filterRaw = this.getNodeParameter('filterRaw', i, '') as string;
							if (filterRaw) {
								qs['$filter'] = filterRaw;
							}
						}

						// Expand
						const useExpandBuilder = this.getNodeParameter('useExpandBuilder', i, true) as boolean;
						if (useExpandBuilder) {
							const expandRelationsData = this.getNodeParameter(
								'expandRelations.expansions',
								i,
								[],
							) as Array<{
								property: string;
								select: string;
								useNestedFilter: boolean;
								filter: string;
								useNestedExpand: boolean;
								nestedExpand: string;
							}>;

							const expandNestedFiltersData = this.getNodeParameter(
								'expandNestedFilters.nestedFilters',
								i,
								[],
							) as Array<{
								expansionProperty: string;
								field: string;
								operator: string;
								value: string;
								isNumeric: boolean;
								logicalOperator: string;
							}>;

							const expandStr = buildExpandString(expandRelationsData, expandNestedFiltersData);
							if (expandStr) {
								qs['$expand'] = expandStr;
							}
						} else {
							const expandRaw = this.getNodeParameter('expandRaw', i, '') as string;
							if (expandRaw) {
								qs['$expand'] = expandRaw;
							}
						}

						break;
					}

						case 'create': {
						method = 'POST';
						const bodyJson = this.getNodeParameter('body', i, '{}') as string | object;
						body = typeof bodyJson === 'string' ? JSON.parse(bodyJson) : bodyJson;
						break;
					}

					case 'update': {
						method = 'PATCH';
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						url = `${endpoint.basePath}(${resourceId})`;
						const bodyJsonUpdate = this.getNodeParameter('body', i, '{}') as string | object;
						body = typeof bodyJsonUpdate === 'string' ? JSON.parse(bodyJsonUpdate) : bodyJsonUpdate;
						break;
					}

					case 'delete': {
						method = 'DELETE';
						const resourceId = this.getNodeParameter('resourceId', i) as string;
						url = `${endpoint.basePath}(${resourceId})`;
						break;
					}

					// Special actions: win, lose, reopen, review, finish
					default: {
						if (endpoint.actions && endpoint.actions[operation]) {
							method = 'POST';
							const resourceId = this.getNodeParameter('resourceId', i) as string;
							url = `${endpoint.basePath}(${resourceId})/${endpoint.actions[operation]}`;
						} else {
							throw new Error(`Unknown operation: ${operation} for resource: ${resource}`);
						}
						break;
					}
				}

				const fullUrl = `https://api2.ploomes.com${url}`;

				const options: IHttpRequestOptions = {
					method,
					url: fullUrl,
					qs,
				};

				if (body) {
					options.body = body as IHttpRequestOptions['body'];
					options.headers = { 'Content-Type': 'application/json' };
				}

				// ─── Cache logic (GET only) ───────────────────────────────────
				const cacheStrategy = operation === 'getAll'
					? (this.getNodeParameter('cacheStrategy', i, 'disabled') as string)
					: 'disabled';
				const cacheTtl = cacheStrategy !== 'disabled'
					? (this.getNodeParameter('cacheTtl', i, 300) as number)
					: 0;
				const cacheKey = cacheStrategy !== 'disabled'
					? getCacheKey(fullUrl, qs)
					: '';

				// Cache First: return cached data if available
				if (cacheStrategy === 'cacheFirst') {
					const cached = getCachedResponse(cacheKey, cacheTtl);
					if (cached !== undefined) {
						const cachedData = cached as Record<string, unknown>;
						if (cachedData.value && Array.isArray(cachedData.value)) {
							for (const item of cachedData.value as Array<Record<string, unknown>>) {
								successData.push({ json: { ...item, _fromCache: true } });
							}
						} else {
							successData.push({ json: { ...cachedData, _fromCache: true } });
						}
						continue;
					}
				}

				let response: unknown;
				let requestFailed = false;

				try {
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'ploomesApi',
						options,
					);
				} catch (requestError) {
					requestFailed = true;

					// Fallback: try to serve from cache on error
					if (cacheStrategy !== 'disabled') {
						const cached = getCachedResponse(cacheKey, cacheTtl);
						if (cached !== undefined) {
							const cachedData = cached as Record<string, unknown>;
							if (cachedData.value && Array.isArray(cachedData.value)) {
								for (const item of cachedData.value as Array<Record<string, unknown>>) {
									successData.push({ json: { ...item, _fromCache: true, _fallback: true } });
								}
							} else {
								successData.push({ json: { ...cachedData, _fromCache: true, _fallback: true } });
							}
							continue;
						}
					}

					// No cache available — rethrow to enter outer catch
					throw requestError;
				}

				if (!requestFailed) {
					// Store in cache for future use
					if (cacheStrategy !== 'disabled' && response !== undefined && response !== null && response !== '') {
						const dataToCache = typeof response === 'string' ? JSON.parse(response as string) : response;
						setCacheResponse(cacheKey, dataToCache);
					}

					// Handle empty responses (e.g., DELETE returns 200 with no body)
					if (response === undefined || response === null || response === '') {
						successData.push({
							json: {
								success: true,
								resource,
								operation,
								timestamp: new Date().toISOString(),
							},
						});
					} else {
						const responseData = typeof response === 'string' ? JSON.parse(response as string) : response;

						if ((responseData as IDataObject).value && Array.isArray((responseData as IDataObject).value)) {
							for (const item of (responseData as IDataObject).value as IDataObject[]) {
								successData.push({ json: item });
							}
						} else {
							successData.push({ json: responseData as IDataObject });
						}
					}
				}
			} catch (error) {
				const err = error as Error & {
					httpCode?: string;
					statusCode?: number;
					cause?: { code?: string };
				};

				const httpCode =
					err.statusCode ??
					(err.httpCode ? Number(err.httpCode) : null) ??
					((err as NodeOperationError).context?.httpCode
						? Number((err as NodeOperationError).context?.httpCode)
						: null);

				const isTimeout = httpCode === 408 || httpCode === 504;

				const errorPayload: INodeExecutionData = {
					json: {
						error: err.message,
						statusCode: httpCode,
						isTimeout,
						resource,
						operation,
						timestamp: new Date().toISOString(),
					},
				};

				if (isTimeout) {
					timeoutData.push(errorPayload);
				} else {
					errorData.push(errorPayload);
				}

				if (!this.continueOnFail() && !isTimeout) {
					throw error;
				}
			}
		}

		return [successData, errorData, timeoutData];
	}
}
