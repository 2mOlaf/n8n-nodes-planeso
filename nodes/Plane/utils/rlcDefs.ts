import type { INodeProperties } from 'n8n-workflow';

// ── Resource Locator field builders ───────────────────────────────────
// Each builder returns an INodeProperties definition with `type: 'resourceLocator'`
// using two modes: "list" (searchable dropdown) and "id" (manual UUID input).

function rlc(
	displayName: string,
	name: string,
	description: string,
	searchListMethod: string,
	showFor: Record<string, string[]>,
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: `Select a ${displayName.toLowerCase()}...`,
				typeOptions: {
					searchListMethod,
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 00000000-0000-0000-0000-000000000000',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-fA-F0-9-]+',
							errorMessage: 'Not a valid ID',
						},
					},
				],
			},
		],
		displayOptions: {
			show: showFor,
		},
		...extra,
	} as INodeProperties;
}

function rlcIdOnly(
	displayName: string,
	name: string,
	description: string,
	showFor: Record<string, string[]>,
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		description,
		modes: [
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 00000000-0000-0000-0000-000000000000',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-fA-F0-9-]+',
							errorMessage: 'Not a valid ID',
						},
					},
				],
			},
		],
		displayOptions: {
			show: showFor,
		},
		...extra,
	} as INodeProperties;
}

// ── Workspace-scoped resource locators ────────────────────────────────

export function projectRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Project', 'projectId', 'The project to use', 'searchProjects', showFor, extra);
}

export function teamspaceRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Teamspace', 'teamspaceId', 'The teamspace to use', 'searchTeamspaces', showFor, extra);
}

export function initiativeRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Initiative', 'initiativeId', 'The initiative to use', 'searchInitiatives', showFor, extra);
}

export function customerRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Customer', 'customerId', 'The customer to use', 'searchCustomers', showFor, extra);
}

export function memberRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Member', 'memberId', 'The member to use', 'searchMembers', showFor, extra);
}

export function initiativeLabelRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Label', 'labelId', 'The initiative label to use', 'searchInitiativeLabels', showFor, extra);
}

// ── Project-scoped resource locators ─────────────────────────────────

export function stateRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('State', 'stateId', 'The state to use', 'searchStates', showFor, extra);
}

export function labelRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Label', 'labelId', 'The label to use', 'searchLabels', showFor, extra);
}

export function cycleRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Cycle', 'cycleId', 'The cycle to use', 'searchCycles', showFor, extra);
}

export function moduleRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Module', 'moduleId', 'The module to use', 'searchModules', showFor, extra);
}

export function epicRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Epic', 'epicId', 'The epic to use', 'searchEpics', showFor, extra);
}

export function workItemTypeRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlc('Work Item Type', 'typeId', 'The work item type to use', 'searchWorkItemTypes', showFor, extra);
}

// ── ID-only resource locators (no list search available) ─────────────

export function workItemRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Work Item', 'workItemId', 'The ID of the work item', showFor, extra);
}

export function workItemLinkRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Work Item Link', 'linkId', 'The ID of the link', showFor, extra);
}

export function workItemActivityRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Activity', 'activityId', 'The ID of the activity', showFor, extra);
}

export function workItemCommentRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Comment', 'commentId', 'The ID of the comment', showFor, extra);
}

export function workItemAttachmentRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Attachment', 'attachmentId', 'The ID of the attachment', showFor, extra);
}

export function pageRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Page', 'pageId', 'The ID of the page', showFor, extra);
}

export function propertyRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Property', 'propertyId', 'The ID of the custom property', showFor, extra);
}

export function optionRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Option', 'optionId', 'The ID of the option', showFor, extra);
}

export function timeTrackingRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Worklog', 'worklogId', 'The ID of the worklog entry', showFor, extra);
}

export function intakeRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Intake Issue', 'intakeId', 'The ID of the intake issue', showFor, extra);
}

export function customerRequestRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Request', 'requestId', 'The ID of the customer request', showFor, extra);
}

export function stickyRlc(showFor: Record<string, string[]>, extra?: Partial<INodeProperties>): INodeProperties {
	return rlcIdOnly('Sticky', 'stickyId', 'The ID of the sticky', showFor, extra);
}
