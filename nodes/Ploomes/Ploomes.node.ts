import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	NodeConnectionTypes,
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

export class Ploomes implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ploomes CRM',
		name: 'ploomes',
		icon: 'file:ploomes.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Ploomes CRM API with full OData support',
		defaults: {
			name: 'Ploomes CRM',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

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

							const filterStr = buildFilterString(filterConditionsData, customPropertyFiltersData);
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

				const options: IRequestOptions = {
					method,
					url,
					baseURL: 'https://api2.ploomes.com',
					qs,
					json: true,
				};

				if (body) {
					options.body = body;
				}

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'ploomesApi',
					options,
				);

				const responseData = typeof response === 'string' ? JSON.parse(response) : response;

				if (responseData.value && Array.isArray(responseData.value)) {
					for (const item of responseData.value) {
						returnData.push({ json: item });
					}
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
