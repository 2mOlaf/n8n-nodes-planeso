import type { INodeProperties } from 'n8n-workflow';

import { initiativeLabelAddToInitiative, initiativeLabelAddToInitiativeDescription } from './addToInitiative';
import { initiativeLabelCreate, initiativeLabelCreateDescription } from './create';
import { initiativeLabelDelete, initiativeLabelDeleteDescription } from './delete';
import { initiativeLabelGet, initiativeLabelGetDescription } from './get';
import { initiativeLabelGetAll, initiativeLabelGetAllDescription } from './getAll';
import { initiativeLabelGetAllForInitiative, initiativeLabelGetAllForInitiativeDescription } from './getAllForInitiative';
import { initiativeLabelRemoveFromInitiative, initiativeLabelRemoveFromInitiativeDescription } from './removeFromInitiative';
import { initiativeLabelUpdate, initiativeLabelUpdateDescription } from './update';

export {
	initiativeLabelAddToInitiative,
	initiativeLabelCreate,
	initiativeLabelDelete,
	initiativeLabelGet,
	initiativeLabelGetAll,
	initiativeLabelGetAllForInitiative,
	initiativeLabelRemoveFromInitiative,
	initiativeLabelUpdate,
};

export const initiativeLabelDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['initiativeLabel'],
			},
		},
		options: [
			{
				name: 'Add to Initiative',
				value: 'addToInitiative',
				description: 'Add labels to an initiative',
				action: 'Add labels to an initiative',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create an initiative label',
				action: 'Create an initiative label',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an initiative label',
				action: 'Delete an initiative label',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an initiative label',
				action: 'Get an initiative label',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many initiative labels',
				action: 'Get many initiative labels',
			},
			{
				name: 'Get Many for Initiative',
				value: 'getAllForInitiative',
				description: 'Get many labels for a specific initiative',
				action: 'Get many labels for an initiative',
			},
			{
				name: 'Remove From Initiative',
				value: 'removeFromInitiative',
				description: 'Remove labels from an initiative',
				action: 'Remove labels from an initiative',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an initiative label',
				action: 'Update an initiative label',
			},
		],
		default: 'create',
	},
	...initiativeLabelAddToInitiativeDescription,
	...initiativeLabelCreateDescription,
	...initiativeLabelDeleteDescription,
	...initiativeLabelGetDescription,
	...initiativeLabelGetAllDescription,
	...initiativeLabelGetAllForInitiativeDescription,
	...initiativeLabelRemoveFromInitiativeDescription,
	...initiativeLabelUpdateDescription,
];
