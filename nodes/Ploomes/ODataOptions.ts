import { INodeProperties } from 'n8n-workflow';

// ─── OData query parameters (shown for GET operations) ──────────────────────

export const odataOptions: INodeProperties[] = [
	// ─── $top ────────────────────────────────────────────────────────────────
	{
		displayName: '$top (Limit)',
		name: 'top',
		type: 'number',
		default: 1,
		description: 'Maximum number of records to return. Default is 1 for optimized queries.',
		displayOptions: {
			show: {
				operation: ['getAll'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
	},

	// ─── $skip ───────────────────────────────────────────────────────────────
	{
		displayName: '$skip (Offset)',
		name: 'skip',
		type: 'number',
		default: 0,
		description: 'Number of records to skip for pagination',
		displayOptions: {
			show: {
				operation: ['getAll'],
			},
		},
		typeOptions: {
			minValue: 0,
		},
	},

	// ─── $select ─────────────────────────────────────────────────────────────
	{
		displayName: '$select (Fields)',
		name: 'select',
		type: 'string',
		default: 'Id',
		description: 'Comma-separated list of fields to return. Default is "Id" for optimized queries. Example: Id,Name,Title',
		displayOptions: {
			show: {
				operation: ['getAll'],
			},
		},
	},

	// ─── $orderby ────────────────────────────────────────────────────────────
	{
		displayName: '$orderby (Sort)',
		name: 'orderby',
		type: 'string',
		default: 'Id',
		description: 'Field to sort by with optional direction (asc/desc). Default is "Id". Example: Id desc, Name asc',
		displayOptions: {
			show: {
				operation: ['getAll'],
			},
		},
	},

	// ─── $filter builder ─────────────────────────────────────────────────────
	{
		displayName: 'Use Filter Builder',
		name: 'useFilterBuilder',
		type: 'boolean',
		default: true,
		description: 'Whether to use the visual filter builder or write a raw OData $filter string',
		displayOptions: {
			show: {
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: '$filter (Raw)',
		name: 'filterRaw',
		type: 'string',
		default: '',
		description: 'Raw OData $filter expression. Example: Id eq 123 and Name eq \'John\'',
		displayOptions: {
			show: {
				operation: ['getAll'],
				useFilterBuilder: [false],
			},
		},
	},
	{
		displayName: 'Filter Conditions',
		name: 'filterConditions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Build OData $filter conditions visually',
		displayOptions: {
			show: {
				operation: ['getAll'],
				useFilterBuilder: [true],
			},
		},
		options: [
			{
				displayName: 'Conditions',
				name: 'conditions',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'string',
						default: '',
						description: 'The field name to filter on (e.g., Id, Name, Title, StatusId)',
						required: true,
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{ name: 'Equals (eq)', value: 'eq' },
							{ name: 'Not Equals (ne)', value: 'ne' },
							{ name: 'Greater Than (gt)', value: 'gt' },
							{ name: 'Greater Than or Equal (ge)', value: 'ge' },
							{ name: 'Less Than (lt)', value: 'lt' },
							{ name: 'Less Than or Equal (le)', value: 'le' },
							{ name: 'Contains', value: 'contains' },
							{ name: 'Starts With', value: 'startswith' },
							{ name: 'Ends With', value: 'endswith' },
						],
						default: 'eq',
						description: 'The comparison operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to compare against. Strings are auto-quoted.',
						required: true,
					},
					{
						displayName: 'Value Type',
						name: 'valueType',
						type: 'options',
						options: [
							{ name: 'String', value: 'string' },
							{ name: 'Number', value: 'number' },
							{ name: 'Boolean', value: 'boolean' },
							{ name: 'Date', value: 'date' },
							{ name: 'Null', value: 'null' },
						],
						default: 'string',
						description: 'The type of the value (determines quoting behavior)',
					},
					{
						displayName: 'Logical Operator',
						name: 'logicalOperator',
						type: 'options',
						options: [
							{ name: 'AND', value: 'and' },
							{ name: 'OR', value: 'or' },
						],
						default: 'and',
						description: 'Logical operator to combine with the next condition (ignored for the last condition)',
					},
				],
			},
		],
	},

	// ─── Custom Property Filter (OtherProperties) ────────────────────────────
	{
		displayName: 'Custom Property Filters',
		name: 'customPropertyFilters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Filter by custom field values (OtherProperties). These are combined with AND to the main filter.',
		displayOptions: {
			show: {
				operation: ['getAll'],
				useFilterBuilder: [true],
			},
		},
		options: [
			{
				displayName: 'Custom Filters',
				name: 'filters',
				values: [
					{
						displayName: 'Field ID',
						name: 'fieldId',
						type: 'number',
						default: 0,
						description: 'The ID of the custom field (from /Fields endpoint)',
						required: true,
					},
					{
						displayName: 'Value Property',
						name: 'valueProperty',
						type: 'options',
						options: [
							{ name: 'String Value', value: 'StringValue' },
							{ name: 'Integer Value', value: 'IntegerValue' },
							{ name: 'Decimal Value', value: 'BigStringValue' },
							{ name: 'Boolean Value', value: 'BoolValue' },
							{ name: 'Date Value', value: 'DateTimeValue' },
							{ name: 'Object Value ID', value: 'ObjectValueId' },
						],
						default: 'StringValue',
						description: 'Which value property to compare against',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{ name: 'Equals (eq)', value: 'eq' },
							{ name: 'Not Equals (ne)', value: 'ne' },
							{ name: 'Greater Than (gt)', value: 'gt' },
							{ name: 'Greater Than or Equal (ge)', value: 'ge' },
							{ name: 'Less Than (lt)', value: 'lt' },
							{ name: 'Less Than or Equal (le)', value: 'le' },
						],
						default: 'eq',
						description: 'The comparison operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to match. Strings are auto-quoted.',
						required: true,
					},
					{
						displayName: 'Value Is Numeric',
						name: 'isNumeric',
						type: 'boolean',
						default: false,
						description: 'Whether the value is numeric (no quoting)',
					},
				],
			},
		],
	},

	// ─── Collection Filter (any/all lambda) ─────────────────────────────────
	{
		displayName: 'Collection Filters (any)',
		name: 'collectionFilters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Filter by collection navigation properties using OData any() lambda. Example: Lists/any(l: l/ListId eq 123). Combined with AND to the main filter.',
		displayOptions: {
			show: {
				operation: ['getAll'],
				useFilterBuilder: [true],
			},
		},
		options: [
			{
				displayName: 'Filters',
				name: 'filters',
				values: [
					{
						displayName: 'Collection',
						name: 'collection',
						type: 'string',
						default: '',
						description: 'The collection navigation property name (e.g., Lists, Tags, Phones, Emails, Products)',
						placeholder: 'Lists',
						required: true,
					},
					{
						displayName: 'Field',
						name: 'field',
						type: 'string',
						default: '',
						description: 'The field inside the collection to filter on (e.g., ListId, TagId, Id)',
						placeholder: 'ListId',
						required: true,
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{ name: 'Equals (eq)', value: 'eq' },
							{ name: 'Not Equals (ne)', value: 'ne' },
							{ name: 'Greater Than (gt)', value: 'gt' },
							{ name: 'Greater Than or Equal (ge)', value: 'ge' },
							{ name: 'Less Than (lt)', value: 'lt' },
							{ name: 'Less Than or Equal (le)', value: 'le' },
						],
						default: 'eq',
						description: 'The comparison operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to compare against. Numbers are auto-detected.',
						placeholder: '11002349',
						required: true,
					},
					{
						displayName: 'Logical Operator',
						name: 'logicalOperator',
						type: 'options',
						options: [
							{ name: 'AND', value: 'and' },
							{ name: 'OR', value: 'or' },
						],
						default: 'and',
						description: 'Logical operator to combine with the next collection filter (ignored for the last one)',
					},
				],
			},
		],
	},

	// ─── $expand builder ─────────────────────────────────────────────────────
	{
		displayName: 'Use Expand Builder',
		name: 'useExpandBuilder',
		type: 'boolean',
		default: true,
		description: 'Whether to use the visual expand builder or write a raw OData $expand string',
		displayOptions: {
			show: {
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: '$expand (Raw)',
		name: 'expandRaw',
		type: 'string',
		default: '',
		description: 'Raw OData $expand expression. Example: OtherProperties,Owner($select=Id,Name)',
		displayOptions: {
			show: {
				operation: ['getAll'],
				useExpandBuilder: [false],
			},
		},
	},
	{
		displayName: 'Expand Relations',
		name: 'expandRelations',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Expand related entities (equivalent to OData $expand)',
		displayOptions: {
			show: {
				operation: ['getAll'],
				useExpandBuilder: [true],
			},
		},
		options: [
			{
				displayName: 'Expansions',
				name: 'expansions',
				values: [
					{
						displayName: 'Property Name',
						name: 'property',
						type: 'string',
						default: '',
						description: 'The navigation property to expand (e.g., OtherProperties, Owner, Stage, Pipeline, Status, Creator)',
						required: true,
					},
					{
						displayName: '$select (Nested)',
						name: 'select',
						type: 'string',
						default: '',
						description: 'Comma-separated fields to select from the expanded entity. Leave empty for all fields. Example: Id,Name',
					},
					{
						displayName: 'Use Nested Filter',
						name: 'useNestedFilter',
						type: 'boolean',
						default: false,
						description: 'Whether to add a $filter inside this expansion',
					},
					{
						displayName: '$filter (Nested)',
						name: 'filter',
						type: 'string',
						default: '',
						description: 'OData $filter to apply within this expansion. Example: FieldId eq 12345 or FieldId eq 67890',
						displayOptions: {
							show: {
								useNestedFilter: [true],
							},
						},
					},
					{
						displayName: 'Use Nested Expand',
						name: 'useNestedExpand',
						type: 'boolean',
						default: false,
						description: 'Whether to add a nested $expand inside this expansion',
					},
					{
						displayName: '$expand (Nested)',
						name: 'nestedExpand',
						type: 'string',
						default: '',
						description: 'Nested expansion within this expansion. Example: CurrencyValue or Stages',
						displayOptions: {
							show: {
								useNestedExpand: [true],
							},
						},
					},
				],
			},
		],
	},

	// ─── Nested Filter Builder for Expand ────────────────────────────────────
	{
		displayName: 'Expand Nested Filters',
		name: 'expandNestedFilters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Build nested $filter conditions for expanded properties using a visual builder (alternative to writing raw filter in expansions)',
		displayOptions: {
			show: {
				operation: ['getAll'],
				useExpandBuilder: [true],
			},
		},
		options: [
			{
				displayName: 'Nested Filters',
				name: 'nestedFilters',
				values: [
					{
						displayName: 'Expansion Property',
						name: 'expansionProperty',
						type: 'string',
						default: '',
						description: 'The name of the expansion this filter applies to (must match a property name in Expand Relations). E.g., OtherProperties',
						required: true,
					},
					{
						displayName: 'Field',
						name: 'field',
						type: 'string',
						default: '',
						description: 'The field to filter on inside the expansion. E.g., FieldId',
						required: true,
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: [
							{ name: 'Equals (eq)', value: 'eq' },
							{ name: 'Not Equals (ne)', value: 'ne' },
							{ name: 'Greater Than (gt)', value: 'gt' },
							{ name: 'Greater Than or Equal (ge)', value: 'ge' },
							{ name: 'Less Than (lt)', value: 'lt' },
							{ name: 'Less Than or Equal (le)', value: 'le' },
						],
						default: 'eq',
						description: 'The comparison operator',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to compare against',
						required: true,
					},
					{
						displayName: 'Value Is Numeric',
						name: 'isNumeric',
						type: 'boolean',
						default: true,
						description: 'Whether the value is numeric (no quoting)',
					},
					{
						displayName: 'Logical Operator',
						name: 'logicalOperator',
						type: 'options',
						options: [
							{ name: 'AND', value: 'and' },
							{ name: 'OR', value: 'or' },
						],
						default: 'or',
						description: 'How to combine with the next condition for the same expansion',
					},
				],
			},
		],
	},
];

// ─── Body fields for create/update operations ───────────────────────────────

export const bodyFields: INodeProperties[] = [
	{
		displayName: 'Body (JSON)',
		name: 'body',
		type: 'json',
		default: '{}',
		description: 'The JSON body to send with the request. For creating/updating records, include the entity properties here.',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
	},
];

// ─── OData helpers ──────────────────────────────────────────────────────────

interface FilterCondition {
	field: string;
	operator: string;
	value: string;
	valueType: string;
	logicalOperator: string;
}

interface CustomPropertyFilter {
	fieldId: number;
	valueProperty: string;
	operator: string;
	value: string;
	isNumeric: boolean;
}

interface CollectionFilter {
	collection: string;
	field: string;
	operator: string;
	value: string;
	logicalOperator: string;
}

interface ExpandRelation {
	property: string;
	select: string;
	useNestedFilter: boolean;
	filter: string;
	useNestedExpand: boolean;
	nestedExpand: string;
}

interface NestedFilterDef {
	expansionProperty: string;
	field: string;
	operator: string;
	value: string;
	isNumeric: boolean;
	logicalOperator: string;
}

function formatFilterValue(value: string, valueType: string): string {
	switch (valueType) {
		case 'number':
			return value;
		case 'boolean':
			return value.toLowerCase();
		case 'null':
			return 'null';
		case 'date':
			return value;
		case 'string':
		default:
			// Auto-detect numeric values to avoid quoting numbers as strings
			// This prevents issues like Id eq '123' which OData rejects
			if (/^\d+(\.\d+)?$/.test(value.trim())) {
				return value.trim();
			}
			return `'${value.replace(/'/g, "''")}'`;
	}
}

export function buildFilterString(
	conditions: FilterCondition[],
	customFilters: CustomPropertyFilter[],
	collectionFilters?: CollectionFilter[],
): string {
	const parts: string[] = [];

	// Standard filter conditions
	if (conditions && conditions.length > 0) {
		for (let i = 0; i < conditions.length; i++) {
			const c = conditions[i];
			const formattedValue = formatFilterValue(c.value, c.valueType);
			let expr: string;

			if (['contains', 'startswith', 'endswith'].includes(c.operator)) {
				expr = `${c.operator}(${c.field},${formattedValue})`;
			} else {
				expr = `${c.field} ${c.operator} ${formattedValue}`;
			}

			parts.push(expr);
			if (i < conditions.length - 1) {
				parts.push(c.logicalOperator);
			}
		}
	}

	// Custom property filters (OtherProperties/any(...))
	if (customFilters && customFilters.length > 0) {
		const customParts: string[] = [];
		for (const cf of customFilters) {
			const val = cf.isNumeric ? cf.value : `'${cf.value.replace(/'/g, "''")}'`;
			customParts.push(
				`OtherProperties/any(o: o/FieldId eq ${cf.fieldId} and (o/${cf.valueProperty} ${cf.operator} ${val}))`,
			);
		}
		const customExpr = customParts.join(' and ');
		if (parts.length > 0) {
			parts.push('and');
		}
		parts.push(customExpr);
	}

	// Collection filters (any() lambda) - e.g., Lists/any(l: l/ListId eq 123)
	if (collectionFilters && collectionFilters.length > 0) {
		const collectionParts: string[] = [];
		for (let i = 0; i < collectionFilters.length; i++) {
			const cf = collectionFilters[i];
			const alias = cf.collection.charAt(0).toLowerCase();
			const val = /^\d+(\.\d+)?$/.test(cf.value.trim()) ? cf.value.trim() : `'${cf.value.replace(/'/g, "''")}'`;
			collectionParts.push(
				`${cf.collection}/any(${alias}: ${alias}/${cf.field} ${cf.operator} ${val})`,
			);
			if (i < collectionFilters.length - 1) {
				collectionParts.push(cf.logicalOperator);
			}
		}
		const collectionExpr = collectionParts.join(' ');
		if (parts.length > 0) {
			parts.push('and');
		}
		parts.push(collectionExpr);
	}

	return parts.join(' ');
}

export function buildExpandString(
	expansions: ExpandRelation[],
	nestedFilters: NestedFilterDef[],
): string {
	if (!expansions || expansions.length === 0) return '';

	// Group nested filters by expansion property
	const nestedFilterMap: Record<string, string> = {};
	if (nestedFilters && nestedFilters.length > 0) {
		const grouped: Record<string, NestedFilterDef[]> = {};
		for (const nf of nestedFilters) {
			if (!grouped[nf.expansionProperty]) {
				grouped[nf.expansionProperty] = [];
			}
			grouped[nf.expansionProperty].push(nf);
		}
		for (const [prop, filters] of Object.entries(grouped)) {
			const filterParts: string[] = [];
			for (let i = 0; i < filters.length; i++) {
				const f = filters[i];
				const val = f.isNumeric ? f.value : `'${f.value.replace(/'/g, "''")}'`;
				filterParts.push(`${f.field} ${f.operator} ${val}`);
				if (i < filters.length - 1) {
					filterParts.push(f.logicalOperator);
				}
			}
			nestedFilterMap[prop] = filterParts.join(' ');
		}
	}

	const expandParts: string[] = [];
	for (const exp of expansions) {
		const innerParts: string[] = [];

		if (exp.select) {
			innerParts.push(`$select=${exp.select}`);
		}

		// Combine manual filter + builder nested filters
		const manualFilter = exp.useNestedFilter && exp.filter ? exp.filter : '';
		const builderFilter = nestedFilterMap[exp.property] || '';
		let combinedFilter = '';
		if (manualFilter && builderFilter) {
			combinedFilter = `${manualFilter} and ${builderFilter}`;
		} else {
			combinedFilter = manualFilter || builderFilter;
		}
		if (combinedFilter) {
			innerParts.push(`$filter=${combinedFilter}`);
		}

		if (exp.useNestedExpand && exp.nestedExpand) {
			innerParts.push(`$expand=${exp.nestedExpand}`);
		}

		if (innerParts.length > 0) {
			expandParts.push(`${exp.property}(${innerParts.join(';')})`);
		} else {
			expandParts.push(exp.property);
		}
	}

	return expandParts.join(',');
}
