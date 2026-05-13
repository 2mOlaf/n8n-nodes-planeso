import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodePropertyOptions,
} from 'n8n-workflow';

import { API_ENDPOINTS } from './constants';
import { planeRequest, getWorkspaceSlug } from './helpers';

function extractResults(response: unknown): IDataObject[] {
	if (Array.isArray(response)) return response as IDataObject[];
	return ((response as IDataObject)?.results as IDataObject[]) ?? [];
}

function filterResults(items: IDataObject[], filter: string | undefined, nameKey: string | ((item: IDataObject) => string)): IDataObject[] {
	if (!filter) return items;
	const lower = filter.toLowerCase();
	return items.filter((item) => {
		const name = typeof nameKey === 'function' ? nameKey(item) : (item[nameKey] as string) ?? '';
		return name.toLowerCase().includes(lower);
	});
}

// ── Workspace-scoped (no project dependency) ──────────────────────────

export async function searchProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.PROJECTS(slug),
		});
		const items = filterResults(extractResults(response), filter, (p) =>
			`${p.identifier} - ${p.name}`,
		);
		return {
			results: items.map((p) => ({
				name: `${p.identifier} - ${p.name}` as string,
				value: p.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchMembers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.WORKSPACE_MEMBERS(slug),
		});
		const items = filterResults(extractResults(response), filter, (m) => {
			const member = m.member as IDataObject | undefined;
			return (member?.display_name || member?.email || m.id) as string;
		});
		return {
			results: items.map((m) => {
				const member = m.member as IDataObject | undefined;
				return {
					name: (member?.display_name || member?.email || m.id) as string,
					value: (member?.id || m.id) as string,
				};
			}),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchTeamspaces(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.TEAMSPACES(slug),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((t) => ({
				name: t.name as string,
				value: t.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchInitiatives(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.INITIATIVES(slug),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((i) => ({
				name: i.name as string,
				value: i.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchCustomers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.CUSTOMERS(slug),
		});
		const items = filterResults(extractResults(response), filter, (c) =>
			(c.name || c.email || c.id) as string,
		);
		return {
			results: items.map((c) => ({
				name: (c.name || c.email || c.id) as string,
				value: c.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchInitiativeLabels(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.INITIATIVE_LABELS(slug),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((l) => ({
				name: l.name as string,
				value: l.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

// ── Project-scoped (depend on projectId) ──────────────────────────────

export async function searchStates(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return { results: [] };
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.STATES(slug, projectId),
		});
		const items = filterResults(extractResults(response), filter, (s) =>
			`${s.group} - ${s.name}`,
		);
		return {
			results: items.map((s) => ({
				name: `${s.group} - ${s.name}` as string,
				value: s.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchLabels(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return { results: [] };
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.LABELS(slug, projectId),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((l) => ({
				name: l.name as string,
				value: l.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchCycles(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return { results: [] };
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.CYCLES(slug, projectId),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((c) => ({
				name: c.name as string,
				value: c.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchModules(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return { results: [] };
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.MODULES(slug, projectId),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((m) => ({
				name: m.name as string,
				value: m.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchWorkItemTypes(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return { results: [] };
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.WORK_ITEM_TYPES(slug, projectId),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((t) => ({
				name: t.name as string,
				value: t.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchEpics(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return { results: [] };
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.EPICS(slug, projectId),
		});
		const items = filterResults(extractResults(response), filter, 'name');
		return {
			results: items.map((e) => ({
				name: e.name as string,
				value: e.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

// ── Legacy loadOptions (kept for multiOptions fields) ─────────────────

export async function getTeamspaces(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.TEAMSPACES(slug),
		});
		return extractResults(response).map((t) => ({
			name: t.name as string,
			value: t.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getInitiatives(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.INITIATIVES(slug),
		});
		return extractResults(response).map((i) => ({
			name: i.name as string,
			value: i.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getCustomers(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.CUSTOMERS(slug),
		});
		return extractResults(response).map((c) => ({
			name: (c.name || c.email || c.id) as string,
			value: c.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getCycles(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return [];
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.CYCLES(slug, projectId),
		});
		return extractResults(response).map((c) => ({
			name: c.name as string,
			value: c.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getModules(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return [];
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.MODULES(slug, projectId),
		});
		return extractResults(response).map((m) => ({
			name: m.name as string,
			value: m.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getEpics(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return [];
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.EPICS(slug, projectId),
		});
		return extractResults(response).map((e) => ({
			name: e.name as string,
			value: e.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getMembers(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.WORKSPACE_MEMBERS(slug),
		});
		return extractResults(response).map((m) => {
			const member = m.member as IDataObject | undefined;
			return {
				name: (member?.display_name || member?.email || m.id) as string,
				value: (member?.id || m.id) as string,
			};
		});
	} catch {
		return [];
	}
}

export async function getProjects(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.PROJECTS(slug),
		});
		return extractResults(response).map((p) => ({
			name: `${p.identifier} - ${p.name}` as string,
			value: p.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getInitiativeLabels(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.INITIATIVE_LABELS(slug),
		});
		return extractResults(response).map((l) => ({
			name: l.name as string,
			value: l.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getStates(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return [];
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.STATES(slug, projectId),
		});
		return extractResults(response).map((s) => ({
			name: `${s.group} - ${s.name}` as string,
			value: s.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getLabels(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return [];
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.LABELS(slug, projectId),
		});
		return extractResults(response).map((l) => ({
			name: l.name as string,
			value: l.id as string,
		}));
	} catch {
		return [];
	}
}

export async function getWorkItemTypes(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		const slug = await getWorkspaceSlug(this);
		const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true }) as string;
		if (!projectId) return [];
		const response = await planeRequest.call(this, {
			method: 'GET',
			url: API_ENDPOINTS.WORK_ITEM_TYPES(slug, projectId),
		});
		return extractResults(response).map((t) => ({
			name: t.name as string,
			value: t.id as string,
		}));
	} catch {
		return [];
	}
}
