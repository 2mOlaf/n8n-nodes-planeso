import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

// Core resources
import { userDescription, userGetMe } from './resources/user';
import { memberDescription, memberGetAll } from './resources/member';
import {
	projectCreate,
	projectDelete,
	projectDescription,
	projectGet,
	projectGetAll,
	projectUpdate,
} from './resources/project';
import {
	stateCreate,
	stateDelete,
	stateDescription,
	stateGet,
	stateGetAll,
	stateUpdate,
} from './resources/state';
import {
	labelCreate,
	labelDelete,
	labelDescription,
	labelGet,
	labelGetAll,
	labelUpdate,
} from './resources/label';

// Work item resources
import {
	workItemCreate,
	workItemDelete,
	workItemDescription,
	workItemGet,
	workItemGetAll,
	workItemGetByIdentifier,
	workItemSearch,
	workItemUpdate,
} from './resources/workItem';
import {
	workItemLinkCreate,
	workItemLinkDelete,
	workItemLinkDescription,
	workItemLinkGet,
	workItemLinkGetAll,
	workItemLinkUpdate,
} from './resources/workItemLink';
import {
	workItemActivityDescription,
	workItemActivityGet,
	workItemActivityGetAll,
} from './resources/workItemActivity';
import {
	workItemCommentCreate,
	workItemCommentDelete,
	workItemCommentDescription,
	workItemCommentGet,
	workItemCommentGetAll,
	workItemCommentUpdate,
} from './resources/workItemComment';
import {
	workItemAttachmentDelete,
	workItemAttachmentDescription,
	workItemAttachmentGet,
	workItemAttachmentGetAll,
} from './resources/workItemAttachment';
import {
	workItemTypeCreate,
	workItemTypeDelete,
	workItemTypeDescription,
	workItemTypeGet,
	workItemTypeGetAll,
	workItemTypeUpdate,
} from './resources/workItemType';

// Custom property resources
import {
	customPropertyCreate,
	customPropertyDelete,
	customPropertyDescription,
	customPropertyGet,
	customPropertyGetAll,
	customPropertyUpdate,
} from './resources/customProperty';
import {
	customPropertyValueDescription,
	customPropertyValueGetAll,
	customPropertyValueUpdate,
} from './resources/customPropertyValue';
import {
	customPropertyOptionCreate,
	customPropertyOptionDelete,
	customPropertyOptionDescription,
	customPropertyOptionGet,
	customPropertyOptionGetAll,
	customPropertyOptionUpdate,
} from './resources/customPropertyOption';

// Planning resources
import {
	cycleCreate,
	cycleDelete,
	cycleDescription,
	cycleGet,
	cycleGetAll,
	cycleUpdate,
} from './resources/cycle';
import {
	moduleCreate,
	moduleDelete,
	moduleDescription,
	moduleGet,
	moduleGetAll,
	moduleUpdate,
} from './resources/module';
import { pageCreate, pageDescription, pageGet } from './resources/page';
import {
	intakeCreate,
	intakeDelete,
	intakeDescription,
	intakeGet,
	intakeGetAll,
	intakeUpdate,
} from './resources/intake';
import {
	timeTrackingCreate,
	timeTrackingDelete,
	timeTrackingDescription,
	timeTrackingGetAll,
	timeTrackingUpdate,
} from './resources/timeTracking';
import { epicDescription, epicGet, epicGetAll } from './resources/epic';

// Strategic resources
import {
	initiativeCreate,
	initiativeDelete,
	initiativeDescription,
	initiativeGet,
	initiativeGetAll,
	initiativeUpdate,
} from './resources/initiative';
import {
	initiativeLabelAddToInitiative,
	initiativeLabelCreate,
	initiativeLabelDelete,
	initiativeLabelDescription,
	initiativeLabelGet,
	initiativeLabelGetAll,
	initiativeLabelGetAllForInitiative,
	initiativeLabelRemoveFromInitiative,
	initiativeLabelUpdate,
} from './resources/initiativeLabel';
import {
	initiativeProjectAdd,
	initiativeProjectDescription,
	initiativeProjectGetAll,
	initiativeProjectRemove,
} from './resources/initiativeProject';
import {
	initiativeEpicAdd,
	initiativeEpicDescription,
	initiativeEpicGetAll,
	initiativeEpicRemove,
} from './resources/initiativeEpic';

// Customer resources
import {
	customerCreate,
	customerDelete,
	customerDescription,
	customerGet,
	customerGetAll,
	customerGetWorkItems,
	customerLinkWorkItems,
	customerUnlinkWorkItem,
	customerUpdate,
} from './resources/customer';
import {
	customerPropertyCreate,
	customerPropertyDelete,
	customerPropertyDescription,
	customerPropertyGet,
	customerPropertyGetAll,
	customerPropertyUpdate,
} from './resources/customerProperty';
import {
	customerRequestCreate,
	customerRequestDelete,
	customerRequestDescription,
	customerRequestGet,
	customerRequestGetAll,
	customerRequestUpdate,
} from './resources/customerRequest';

// Collaboration resources
import {
	teamspaceCreate,
	teamspaceDelete,
	teamspaceDescription,
	teamspaceGet,
	teamspaceGetAll,
	teamspaceUpdate,
} from './resources/teamspace';
import {
	teamspaceMemberAdd,
	teamspaceMemberDescription,
	teamspaceMemberGetAll,
	teamspaceMemberRemove,
} from './resources/teamspaceMember';
import {
	teamspaceProjectAdd,
	teamspaceProjectDescription,
	teamspaceProjectGetAll,
	teamspaceProjectRemove,
} from './resources/teamspaceProject';
import {
	stickyCreate,
	stickyDelete,
	stickyDescription,
	stickyGet,
	stickyGetAll,
	stickyUpdate,
} from './resources/sticky';

export class Plane implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Plane',
		name: 'plane',
		icon: 'file:../../icons/plane.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Plane API',
		defaults: {
			name: 'Plane',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'planeApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Custom Property', value: 'customProperty' },
					{ name: 'Custom Property Option', value: 'customPropertyOption' },
					{ name: 'Custom Property Value', value: 'customPropertyValue' },
					{ name: 'Customer', value: 'customer' },
					{ name: 'Customer Property', value: 'customerProperty' },
					{ name: 'Customer Request', value: 'customerRequest' },
					{ name: 'Cycle', value: 'cycle' },
					{ name: 'Epic', value: 'epic' },
					{ name: 'Initiative', value: 'initiative' },
					{ name: 'Initiative Epic', value: 'initiativeEpic' },
					{ name: 'Initiative Label', value: 'initiativeLabel' },
					{ name: 'Initiative Project', value: 'initiativeProject' },
					{ name: 'Intake', value: 'intake' },
					{ name: 'Label', value: 'label' },
					{ name: 'Member', value: 'member' },
					{ name: 'Module', value: 'module' },
					{ name: 'Page', value: 'page' },
					{ name: 'Project', value: 'project' },
					{ name: 'State', value: 'state' },
					{ name: 'Sticky', value: 'sticky' },
					{ name: 'Teamspace', value: 'teamspace' },
					{ name: 'Teamspace Member', value: 'teamspaceMember' },
					{ name: 'Teamspace Project', value: 'teamspaceProject' },
					{ name: 'Time Tracking', value: 'timeTracking' },
					{ name: 'User', value: 'user' },
					{ name: 'Work Item', value: 'workItem' },
					{ name: 'Work Item Activity', value: 'workItemActivity' },
					{ name: 'Work Item Attachment', value: 'workItemAttachment' },
					{ name: 'Work Item Comment', value: 'workItemComment' },
					{ name: 'Work Item Link', value: 'workItemLink' },
					{ name: 'Work Item Type', value: 'workItemType' },
				],
				default: 'workItem',
			},
			// Core
			...userDescription,
			...memberDescription,
			...projectDescription,
			...stateDescription,
			...labelDescription,
			// Work items
			...workItemDescription,
			...workItemLinkDescription,
			...workItemActivityDescription,
			...workItemCommentDescription,
			...workItemAttachmentDescription,
			...workItemTypeDescription,
			// Custom properties
			...customPropertyDescription,
			...customPropertyValueDescription,
			...customPropertyOptionDescription,
			// Planning
			...cycleDescription,
			...moduleDescription,
			...pageDescription,
			...intakeDescription,
			...timeTrackingDescription,
			...epicDescription,
			// Strategic
			...initiativeDescription,
			...initiativeLabelDescription,
			...initiativeProjectDescription,
			...initiativeEpicDescription,
			// Customers
			...customerDescription,
			...customerPropertyDescription,
			...customerRequestDescription,
			// Collaboration
			...teamspaceDescription,
			...teamspaceMemberDescription,
			...teamspaceProjectDescription,
			...stickyDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		await this.getCredentials('planeApi');

		const handlers: Record<
			string,
			Record<string, (this: IExecuteFunctions) => Promise<INodeExecutionData[]>>
		> = {
			user: {
				getMe: userGetMe,
			},
			member: {
				getAll: memberGetAll,
			},
			project: {
				create: projectCreate,
				get: projectGet,
				getAll: projectGetAll,
				update: projectUpdate,
				delete: projectDelete,
			},
			state: {
				create: stateCreate,
				get: stateGet,
				getAll: stateGetAll,
				update: stateUpdate,
				delete: stateDelete,
			},
			label: {
				create: labelCreate,
				get: labelGet,
				getAll: labelGetAll,
				update: labelUpdate,
				delete: labelDelete,
			},
			workItem: {
				create: workItemCreate,
				get: workItemGet,
				getByIdentifier: workItemGetByIdentifier,
				getAll: workItemGetAll,
				search: workItemSearch,
				update: workItemUpdate,
				delete: workItemDelete,
			},
			workItemLink: {
				create: workItemLinkCreate,
				get: workItemLinkGet,
				getAll: workItemLinkGetAll,
				update: workItemLinkUpdate,
				delete: workItemLinkDelete,
			},
			workItemActivity: {
				get: workItemActivityGet,
				getAll: workItemActivityGetAll,
			},
			workItemComment: {
				create: workItemCommentCreate,
				get: workItemCommentGet,
				getAll: workItemCommentGetAll,
				update: workItemCommentUpdate,
				delete: workItemCommentDelete,
			},
			workItemAttachment: {
				get: workItemAttachmentGet,
				getAll: workItemAttachmentGetAll,
				delete: workItemAttachmentDelete,
			},
			workItemType: {
				create: workItemTypeCreate,
				get: workItemTypeGet,
				getAll: workItemTypeGetAll,
				update: workItemTypeUpdate,
				delete: workItemTypeDelete,
			},
			customProperty: {
				create: customPropertyCreate,
				get: customPropertyGet,
				getAll: customPropertyGetAll,
				update: customPropertyUpdate,
				delete: customPropertyDelete,
			},
			customPropertyValue: {
				getAll: customPropertyValueGetAll,
				update: customPropertyValueUpdate,
			},
			customPropertyOption: {
				create: customPropertyOptionCreate,
				get: customPropertyOptionGet,
				getAll: customPropertyOptionGetAll,
				update: customPropertyOptionUpdate,
				delete: customPropertyOptionDelete,
			},
			cycle: {
				create: cycleCreate,
				get: cycleGet,
				getAll: cycleGetAll,
				update: cycleUpdate,
				delete: cycleDelete,
			},
			module: {
				create: moduleCreate,
				get: moduleGet,
				getAll: moduleGetAll,
				update: moduleUpdate,
				delete: moduleDelete,
			},
			page: {
				create: pageCreate,
				get: pageGet,
			},
			intake: {
				create: intakeCreate,
				get: intakeGet,
				getAll: intakeGetAll,
				update: intakeUpdate,
				delete: intakeDelete,
			},
			timeTracking: {
				create: timeTrackingCreate,
				getAll: timeTrackingGetAll,
				update: timeTrackingUpdate,
				delete: timeTrackingDelete,
			},
			epic: {
				get: epicGet,
				getAll: epicGetAll,
			},
			initiative: {
				create: initiativeCreate,
				get: initiativeGet,
				getAll: initiativeGetAll,
				update: initiativeUpdate,
				delete: initiativeDelete,
			},
			initiativeLabel: {
				create: initiativeLabelCreate,
				get: initiativeLabelGet,
				getAll: initiativeLabelGetAll,
				update: initiativeLabelUpdate,
				delete: initiativeLabelDelete,
				addToInitiative: initiativeLabelAddToInitiative,
				removeFromInitiative: initiativeLabelRemoveFromInitiative,
				getAllForInitiative: initiativeLabelGetAllForInitiative,
			},
			initiativeProject: {
				add: initiativeProjectAdd,
				getAll: initiativeProjectGetAll,
				remove: initiativeProjectRemove,
			},
			initiativeEpic: {
				add: initiativeEpicAdd,
				getAll: initiativeEpicGetAll,
				remove: initiativeEpicRemove,
			},
			customer: {
				create: customerCreate,
				get: customerGet,
				getAll: customerGetAll,
				update: customerUpdate,
				delete: customerDelete,
				linkWorkItems: customerLinkWorkItems,
				unlinkWorkItem: customerUnlinkWorkItem,
				getWorkItems: customerGetWorkItems,
			},
			customerProperty: {
				create: customerPropertyCreate,
				get: customerPropertyGet,
				getAll: customerPropertyGetAll,
				update: customerPropertyUpdate,
				delete: customerPropertyDelete,
			},
			customerRequest: {
				create: customerRequestCreate,
				get: customerRequestGet,
				getAll: customerRequestGetAll,
				update: customerRequestUpdate,
				delete: customerRequestDelete,
			},
			teamspace: {
				create: teamspaceCreate,
				get: teamspaceGet,
				getAll: teamspaceGetAll,
				update: teamspaceUpdate,
				delete: teamspaceDelete,
			},
			teamspaceMember: {
				add: teamspaceMemberAdd,
				getAll: teamspaceMemberGetAll,
				remove: teamspaceMemberRemove,
			},
			teamspaceProject: {
				add: teamspaceProjectAdd,
				getAll: teamspaceProjectGetAll,
				remove: teamspaceProjectRemove,
			},
			sticky: {
				create: stickyCreate,
				get: stickyGet,
				getAll: stickyGetAll,
				update: stickyUpdate,
				delete: stickyDelete,
			},
		};

		try {
			const handler = handlers[resource]?.[operation];
			if (!handler) {
				throw new NodeOperationError(
					this.getNode(),
					`Unsupported operation "${operation}" for resource "${resource}"`,
				);
			}

			const res = await handler.call(this);
			return [res];
		} catch (error: unknown) {
			if (error instanceof NodeOperationError) {
				throw error;
			}
			if (error instanceof Error) {
				throw new NodeOperationError(this.getNode(), error.message);
			}
			throw new NodeOperationError(this.getNode(), `${error}`);
		}
	}
}
