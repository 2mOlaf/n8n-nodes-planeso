export const DEFAULT_BASE_URL = 'https://api.plane.so';

const V1 = '/api/v1';
const ws = (s: string) => `${V1}/workspaces/${s}`;
const proj = (s: string, p: string) => `${ws(s)}/projects/${p}`;

export const API_ENDPOINTS = {
	// User
	USERS_ME: `${V1}/users/me/`,

	// Project
	PROJECTS: (s: string) => `${ws(s)}/projects/`,
	PROJECT: (s: string, id: string) => `${ws(s)}/projects/${id}/`,

	// Member
	WORKSPACE_MEMBERS: (s: string) => `${ws(s)}/members/`,
	PROJECT_MEMBERS: (s: string, p: string) => `${proj(s, p)}/members/`,

	// State
	STATES: (s: string, p: string) => `${proj(s, p)}/states/`,
	STATE: (s: string, p: string, id: string) => `${proj(s, p)}/states/${id}/`,

	// Label
	LABELS: (s: string, p: string) => `${proj(s, p)}/labels/`,
	LABEL: (s: string, p: string, id: string) => `${proj(s, p)}/labels/${id}/`,

	// Work Item
	WORK_ITEMS: (s: string, p: string) => `${proj(s, p)}/work-items/`,
	WORK_ITEM: (s: string, p: string, id: string) => `${proj(s, p)}/work-items/${id}/`,
	WORK_ITEM_BY_IDENTIFIER: (s: string, identifier: string) =>
		`${ws(s)}/work-items/${identifier}/`,
	WORK_ITEMS_SEARCH: (s: string) => `${ws(s)}/work-items/search/`,

	// Work Item Link
	WORK_ITEM_LINKS: (s: string, p: string, wi: string) =>
		`${proj(s, p)}/work-items/${wi}/links/`,
	WORK_ITEM_LINK: (s: string, p: string, wi: string, id: string) =>
		`${proj(s, p)}/work-items/${wi}/links/${id}/`,

	// Work Item Activity
	WORK_ITEM_ACTIVITIES: (s: string, p: string, wi: string) =>
		`${proj(s, p)}/work-items/${wi}/activity/`,
	WORK_ITEM_ACTIVITY: (s: string, p: string, wi: string, id: string) =>
		`${proj(s, p)}/work-items/${wi}/activity/${id}/`,

	// Work Item Comment
	WORK_ITEM_COMMENTS: (s: string, p: string, wi: string) =>
		`${proj(s, p)}/work-items/${wi}/comments/`,
	WORK_ITEM_COMMENT: (s: string, p: string, wi: string, id: string) =>
		`${proj(s, p)}/work-items/${wi}/comments/${id}/`,

	// Work Item Attachment
	WORK_ITEM_ATTACHMENTS: (s: string, p: string, wi: string) =>
		`${proj(s, p)}/work-items/${wi}/attachments/`,
	WORK_ITEM_ATTACHMENT: (s: string, p: string, wi: string, id: string) =>
		`${proj(s, p)}/work-items/${wi}/attachments/${id}/`,

	// Work Item Type
	WORK_ITEM_TYPES: (s: string, p: string) => `${proj(s, p)}/work-item-types/`,
	WORK_ITEM_TYPE: (s: string, p: string, id: string) => `${proj(s, p)}/work-item-types/${id}/`,

	// Custom Property
	CUSTOM_PROPERTIES: (s: string, p: string, t: string) =>
		`${proj(s, p)}/work-item-types/${t}/work-item-properties/`,
	CUSTOM_PROPERTY: (s: string, p: string, t: string, id: string) =>
		`${proj(s, p)}/work-item-types/${t}/work-item-properties/${id}/`,

	// Custom Property Value
	CUSTOM_PROPERTY_VALUES: (s: string, p: string, wi: string) =>
		`${proj(s, p)}/work-items/${wi}/property-values/`,
	CUSTOM_PROPERTY_VALUE: (s: string, p: string, wi: string, id: string) =>
		`${proj(s, p)}/work-items/${wi}/property-values/${id}/`,

	// Custom Property Option
	CUSTOM_PROPERTY_OPTIONS: (s: string, p: string, propId: string) =>
		`${proj(s, p)}/work-item-properties/${propId}/options/`,
	CUSTOM_PROPERTY_OPTION: (s: string, p: string, propId: string, id: string) =>
		`${proj(s, p)}/work-item-properties/${propId}/options/${id}/`,

	// Cycle
	CYCLES: (s: string, p: string) => `${proj(s, p)}/cycles/`,
	CYCLE: (s: string, p: string, id: string) => `${proj(s, p)}/cycles/${id}/`,

	// Module
	MODULES: (s: string, p: string) => `${proj(s, p)}/modules/`,
	MODULE: (s: string, p: string, id: string) => `${proj(s, p)}/modules/${id}/`,

	// Page
	WORKSPACE_PAGES: (s: string) => `${ws(s)}/pages/`,
	WORKSPACE_PAGE: (s: string, id: string) => `${ws(s)}/pages/${id}/`,
	PROJECT_PAGES: (s: string, p: string) => `${proj(s, p)}/pages/`,
	PROJECT_PAGE: (s: string, p: string, id: string) => `${proj(s, p)}/pages/${id}/`,

	// Intake
	INTAKE_ISSUES: (s: string) => `${ws(s)}/intake-issues/`,
	INTAKE_ISSUE: (s: string, id: string) => `${ws(s)}/intake-issues/${id}/`,

	// Time Tracking (Worklogs)
	WORKLOGS: (s: string, p: string, wi: string) =>
		`${proj(s, p)}/work-items/${wi}/worklogs/`,
	WORKLOG: (s: string, p: string, wi: string, id: string) =>
		`${proj(s, p)}/work-items/${wi}/worklogs/${id}/`,
	WORKLOG_TOTAL: (s: string, p: string, wi: string) =>
		`${proj(s, p)}/work-items/${wi}/worklogs/total/`,

	// Epic
	EPICS: (s: string, p: string) => `${proj(s, p)}/epics/`,
	EPIC: (s: string, p: string, id: string) => `${proj(s, p)}/epics/${id}/`,

	// Initiative
	INITIATIVES: (s: string) => `${ws(s)}/initiatives/`,
	INITIATIVE: (s: string, id: string) => `${ws(s)}/initiatives/${id}/`,

	// Initiative Label
	INITIATIVE_LABELS: (s: string) => `${ws(s)}/initiatives/labels/`,
	INITIATIVE_LABEL: (s: string, id: string) => `${ws(s)}/initiatives/labels/${id}/`,
	INITIATIVE_LABELS_FOR: (s: string, initId: string) =>
		`${ws(s)}/initiatives/${initId}/labels/`,

	// Initiative Project
	INITIATIVE_PROJECTS: (s: string, initId: string) =>
		`${ws(s)}/initiatives/${initId}/projects/`,

	// Initiative Epic
	INITIATIVE_EPICS: (s: string, initId: string) =>
		`${ws(s)}/initiatives/${initId}/epics/`,

	// Customer
	CUSTOMERS: (s: string) => `${ws(s)}/customers/`,
	CUSTOMER: (s: string, id: string) => `${ws(s)}/customers/${id}/`,
	CUSTOMER_PROPERTY_VALUES: (s: string, custId: string) =>
		`${ws(s)}/customers/${custId}/property-values/`,
	CUSTOMER_PROPERTY_VALUE: (s: string, custId: string, propId: string) =>
		`${ws(s)}/customers/${custId}/property-values/${propId}/`,
	CUSTOMER_WORK_ITEMS: (s: string, custId: string) =>
		`${ws(s)}/customers/${custId}/work-items/`,

	// Customer Property
	CUSTOMER_PROPERTIES: (s: string) => `${ws(s)}/customer-properties/`,
	CUSTOMER_PROPERTY: (s: string, id: string) => `${ws(s)}/customer-properties/${id}/`,

	// Customer Request
	CUSTOMER_REQUESTS: (s: string, custId: string) =>
		`${ws(s)}/customers/${custId}/requests/`,
	CUSTOMER_REQUEST: (s: string, custId: string, id: string) =>
		`${ws(s)}/customers/${custId}/requests/${id}/`,

	// Teamspace
	TEAMSPACES: (s: string) => `${ws(s)}/teamspaces/`,
	TEAMSPACE: (s: string, id: string) => `${ws(s)}/teamspaces/${id}/`,

	// Teamspace Member
	TEAMSPACE_MEMBERS: (s: string, tsId: string) => `${ws(s)}/teamspaces/${tsId}/members/`,

	// Teamspace Project
	TEAMSPACE_PROJECTS: (s: string, tsId: string) => `${ws(s)}/teamspaces/${tsId}/projects/`,

	// Sticky
	STICKIES: (s: string) => `${ws(s)}/stickies/`,
	STICKY: (s: string, id: string) => `${ws(s)}/stickies/${id}/`,
};
