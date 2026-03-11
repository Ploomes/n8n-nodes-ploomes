import { INodeProperties } from 'n8n-workflow';

// ─── Resource definitions ───────────────────────────────────────────────────

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{ name: 'Account', value: 'account' },
		{ name: 'City', value: 'city' },
		{ name: 'Contact', value: 'contact' },
		{ name: 'Contact Line of Business', value: 'contactLineOfBusiness' },
		{ name: 'Contact Number of Employees', value: 'contactNumberOfEmployees' },
		{ name: 'Contact Origin', value: 'contactOrigin' },
		{ name: 'Contact Product', value: 'contactProduct' },
		{ name: 'Contact Relationship', value: 'contactRelationship' },
		{ name: 'Contact Status', value: 'contactStatus' },
		{ name: 'Contact Type', value: 'contactType' },
		{ name: 'Country', value: 'country' },
		{ name: 'Currency', value: 'currency' },
		{ name: 'Deal', value: 'deal' },
		{ name: 'Deal Loss Reason', value: 'dealLossReason' },
		{ name: 'Deal Pipeline', value: 'dealPipeline' },
		{ name: 'Deal Stage', value: 'dealStage' },
		{ name: 'Deal Status', value: 'dealStatus' },
		{ name: 'Department', value: 'department' },
		{ name: 'Document', value: 'document' },
		{ name: 'Document Template', value: 'documentTemplate' },
		{ name: 'Field', value: 'field' },
		{ name: 'Field Entity', value: 'fieldEntity' },
		{ name: 'Field Options Table', value: 'fieldOptionsTable' },
		{ name: 'Field Options Table Option', value: 'fieldOptionsTableOption' },
		{ name: 'Field Type', value: 'fieldType' },
		{ name: 'Interaction Record', value: 'interactionRecord' },
		{ name: 'Operation', value: 'operation' },
		{ name: 'Order', value: 'order' },
		{ name: 'Order Stage', value: 'orderStage' },
		{ name: 'Phone Type', value: 'phoneType' },
		{ name: 'Product', value: 'product' },
		{ name: 'Product Family', value: 'productFamily' },
		{ name: 'Product Group', value: 'productGroup' },
		{ name: 'Product Part', value: 'productPart' },
		{ name: 'Quote', value: 'quote' },
		{ name: 'Quote Approval Status', value: 'quoteApprovalStatus' },
		{ name: 'Relative Date', value: 'relativeDate' },
		{ name: 'Role', value: 'role' },
		{ name: 'State', value: 'state' },
		{ name: 'Tag', value: 'tag' },
		{ name: 'Task', value: 'task' },
		{ name: 'Task Email Reminder', value: 'taskEmailReminder' },
		{ name: 'Task Repeat Interval Unit', value: 'taskRepeatIntervalUnit' },
		{ name: 'Task Type', value: 'taskType' },
		{ name: 'Team', value: 'team' },
		{ name: 'User', value: 'user' },
		{ name: 'User Profile', value: 'userProfile' },
		{ name: 'Webhook', value: 'webhook' },
		{ name: 'Webhook Action', value: 'webhookAction' },
	],
	default: 'contact',
};

// ─── Helper to create operation properties ──────────────────────────────────

type OpType = 'getAll' | 'get' | 'create' | 'update' | 'delete' | 'action';

interface OpDef {
	name: string;
	value: string;
	description: string;
	action: string;
}

function op(type: OpType, resourceLabel: string, extra?: Partial<OpDef>): OpDef {
	const map: Record<OpType, OpDef> = {
		getAll: {
			name: 'Get Many',
			value: 'getAll',
			description: `Retrieve many ${resourceLabel} records`,
			action: `Get many ${resourceLabel} records`,
		},
		get: {
			name: 'Get',
			value: 'get',
			description: `Retrieve a single ${resourceLabel} by ID`,
			action: `Get a ${resourceLabel}`,
		},
		create: {
			name: 'Create',
			value: 'create',
			description: `Create a new ${resourceLabel}`,
			action: `Create a ${resourceLabel}`,
		},
		update: {
			name: 'Update',
			value: 'update',
			description: `Update an existing ${resourceLabel}`,
			action: `Update a ${resourceLabel}`,
		},
		delete: {
			name: 'Delete',
			value: 'delete',
			description: `Delete a ${resourceLabel}`,
			action: `Delete a ${resourceLabel}`,
		},
		action: {
			name: extra?.name ?? 'Action',
			value: extra?.value ?? 'action',
			description: extra?.description ?? `Perform action on ${resourceLabel}`,
			action: extra?.action ?? `Perform action on ${resourceLabel}`,
		},
	};
	return { ...map[type], ...extra };
}

// ─── Operation definitions per resource ─────────────────────────────────────

function makeOperationProp(resource: string, ops: OpDef[]): INodeProperties {
	return {
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: ops,
		default: ops[0].value,
	};
}

// Resources that only have GET (read-only lists)
const readOnlyResources: Record<string, string> = {
	contactRelationship: 'contact relationship',
	contactStatus: 'contact status',
	contactType: 'contact type',
	country: 'country',
	currency: 'currency',
	dealLossReason: 'deal loss reason',
	dealStage: 'deal stage',
	dealStatus: 'deal status',
	documentTemplate: 'document template',
	fieldEntity: 'field entity',
	fieldType: 'field type',
	operation: 'operation',
	phoneType: 'phone type',
	quoteApprovalStatus: 'quote approval status',
	relativeDate: 'relative date',
	state: 'state',
	taskEmailReminder: 'task email reminder',
	taskRepeatIntervalUnit: 'task repeat interval unit',
	taskType: 'task type',
	userProfile: 'user profile',
	webhookAction: 'webhook action',
};

// Resources with full CRUD (get, getAll, create, update, delete)
const crudResources: Record<string, string> = {
	contact: 'contact',
	contactNumberOfEmployees: 'contact number of employees',
	contactOrigin: 'contact origin',
	contactLineOfBusiness: 'contact line of business',
	contactProduct: 'contact product',
	department: 'department',
	document: 'document',
	interactionRecord: 'interaction record',
	order: 'order',
	orderStage: 'order stage',
	product: 'product',
	productFamily: 'product family',
	productGroup: 'product group',
	productPart: 'product part',
	tag: 'tag',
	team: 'team',
	webhook: 'webhook',
};

// Resources with get, getAll, create, update (no delete)
const crudNoDeleteResources: Record<string, string> = {
	user: 'user',
};

// Resources with get, getAll, create (no update, no delete)
const createOnlyResources: Record<string, string> = {
	role: 'role',
	fieldOptionsTable: 'field options table',
	fieldOptionsTableOption: 'field options table option',
};

export const operationProperties: INodeProperties[] = [
	// Account - special: getAll + update
	makeOperationProp('account', [
		op('getAll', 'account'),
		op('update', 'account'),
	]),

	// City - only getAll
	makeOperationProp('city', [op('getAll', 'city')]),

	// Deal - CRUD + Win/Lose/Reopen
	makeOperationProp('deal', [
		op('getAll', 'deal'),
		op('create', 'deal'),
		op('update', 'deal'),
		op('delete', 'deal'),
		op('action', 'deal', { name: 'Win', value: 'win', description: 'Mark a deal as won', action: 'Win a deal' }),
		op('action', 'deal', { name: 'Lose', value: 'lose', description: 'Mark a deal as lost', action: 'Lose a deal' }),
		op('action', 'deal', { name: 'Reopen', value: 'reopen', description: 'Reopen a closed deal', action: 'Reopen a deal' }),
	]),

	// Deal Pipeline - CRUD
	makeOperationProp('dealPipeline', [
		op('getAll', 'deal pipeline'),
		op('create', 'deal pipeline'),
		op('update', 'deal pipeline'),
		op('delete', 'deal pipeline'),
	]),

	// Field - CRUD (uses Key instead of Id for patch/delete)
	makeOperationProp('field', [
		op('getAll', 'field'),
		op('create', 'field'),
		op('update', 'field'),
		op('delete', 'field'),
	]),

	// Quote - CRUD + Review
	makeOperationProp('quote', [
		op('getAll', 'quote'),
		op('create', 'quote'),
		op('update', 'quote'),
		op('delete', 'quote'),
		op('action', 'quote', { name: 'Review', value: 'review', description: 'Submit a quote for review', action: 'Review a quote' }),
	]),

	// Task - CRUD + Finish
	makeOperationProp('task', [
		op('getAll', 'task'),
		op('create', 'task'),
		op('update', 'task'),
		op('delete', 'task'),
		op('action', 'task', { name: 'Finish', value: 'finish', description: 'Mark a task as finished', action: 'Finish a task' }),
	]),

	// Read-only resources
	...Object.entries(readOnlyResources).map(([key, label]) =>
		makeOperationProp(key, [op('getAll', label)]),
	),

	// Full CRUD resources
	...Object.entries(crudResources).map(([key, label]) =>
		makeOperationProp(key, [
			op('getAll', label),
			op('create', label),
			op('update', label),
			op('delete', label),
		]),
	),

	// CRUD without delete
	...Object.entries(crudNoDeleteResources).map(([key, label]) =>
		makeOperationProp(key, [
			op('getAll', label),
			op('create', label),
			op('update', label),
		]),
	),

	// Create only (+ getAll)
	...Object.entries(createOnlyResources).map(([key, label]) =>
		makeOperationProp(key, [
			op('getAll', label),
			op('create', label),
		]),
	),
];

// ─── Endpoint mapping ───────────────────────────────────────────────────────

export interface ResourceEndpoint {
	basePath: string;
	idParam?: 'Id' | 'Key';
	actions?: Record<string, string>; // action value -> sub-path e.g. 'win' -> 'Win'
}

export const resourceEndpoints: Record<string, ResourceEndpoint> = {
	account: { basePath: '/Account' },
	city: { basePath: '/Cities' },
	contact: { basePath: '/Contacts' },
	contactNumberOfEmployees: { basePath: '/Contacts/NumbersOfEmployees' },
	contactOrigin: { basePath: '/Contacts/Origins' },
	contactLineOfBusiness: { basePath: '/Contacts/LinesOfBusiness' },
	contactRelationship: { basePath: '/Contacts/Relationships' },
	contactStatus: { basePath: '/Contacts/Status' },
	contactType: { basePath: '/Contacts/Types' },
	contactProduct: { basePath: '/Contacts/Products' },
	country: { basePath: '/Cities/Countries' },
	state: { basePath: '/Cities/Countries/States' },
	currency: { basePath: '/Currencies' },
	deal: { basePath: '/Deals', actions: { win: 'Win', lose: 'Lose', reopen: 'Reopen' } },
	dealStage: { basePath: '/Deals/Stages' },
	dealStatus: { basePath: '/Deals/Status' },
	dealLossReason: { basePath: '/Deals/LossReasons' },
	dealPipeline: { basePath: '/Deals/Pipelines' },
	department: { basePath: '/Departments' },
	document: { basePath: '/Documents' },
	documentTemplate: { basePath: '/DocumentTemplates' },
	field: { basePath: '/Fields', idParam: 'Key' },
	fieldEntity: { basePath: '/Fields/Entities' },
	fieldOptionsTable: { basePath: '/Fields/OptionsTables' },
	fieldOptionsTableOption: { basePath: '/Fields/OptionsTables/Options' },
	fieldType: { basePath: '/Fields/Types' },
	interactionRecord: { basePath: '/InteractionRecords' },
	operation: { basePath: '/Operations' },
	order: { basePath: '/Orders' },
	orderStage: { basePath: '/Orders/Stages' },
	phoneType: { basePath: '/PhoneTypes' },
	product: { basePath: '/Products' },
	productFamily: { basePath: '/Products/Families' },
	productGroup: { basePath: '/Products/Groups' },
	productPart: { basePath: '/Products/Parts' },
	quote: { basePath: '/Quotes', actions: { review: 'Review' } },
	quoteApprovalStatus: { basePath: '/Quotes/ApprovalStatus' },
	relativeDate: { basePath: '/RelativeDates' },
	role: { basePath: '/Roles' },
	tag: { basePath: '/Tags' },
	task: { basePath: '/Tasks', actions: { finish: 'Finish' } },
	taskType: { basePath: '/Tasks/Types' },
	taskRepeatIntervalUnit: { basePath: '/Tasks/RepeatIntervalUnits' },
	taskEmailReminder: { basePath: '/Tasks/EmailReminders' },
	team: { basePath: '/Teams' },
	user: { basePath: '/Users' },
	userProfile: { basePath: '/Users/Profiles' },
	webhook: { basePath: '/Webhooks' },
	webhookAction: { basePath: '/Webhooks/Actions' },
};

// ─── Resources that need an ID for update/delete/actions ────────────────────

const needsIdResources = Object.keys(resourceEndpoints);

// The ID field shown for update/delete/action operations
export const idFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'resourceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID (or Key for Fields) of the resource',
		displayOptions: {
			show: {
				operation: ['update', 'delete', 'win', 'lose', 'reopen', 'review', 'finish'],
			},
			hide: {
				resource: Object.keys(readOnlyResources),
			},
		},
	},
];
