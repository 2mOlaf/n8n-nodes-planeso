# n8n-nodes-planeso

[Plane](https://plane.so) project management community node for [n8n](https://n8n.io).

Provides full API coverage for Plane's REST API including projects, work items, cycles, modules, initiatives, customers, teamspaces, and more.

## Installation

In your n8n instance, go to **Settings > Community Nodes** and install:

```
n8n-nodes-planeso
```

## Credentials

You need a Plane API key:

1. Log into your Plane account
2. Go to **Profile Settings > API Tokens**
3. Create a new token
4. In n8n, create a **Plane API** credential with:
   - **API Key**: Your token
   - **Base URL**: `https://api.plane.so` (or your self-hosted URL)
   - **Workspace Slug**: Your workspace identifier (from the URL)

## Supported Resources

| Resource | Operations |
|----------|-----------|
| User | Get Me |
| Member | Get Many |
| Project | Create, Get, Get Many, Update, Delete |
| State | Create, Get, Get Many, Update, Delete |
| Label | Create, Get, Get Many, Update, Delete |
| Work Item | Create, Get, Get by Identifier, Get Many, Search, Update, Delete |
| Work Item Link | Create, Get, Get Many, Update, Delete |
| Work Item Activity | Get, Get Many |
| Work Item Comment | Create, Get, Get Many, Update, Delete |
| Work Item Attachment | Get, Get Many, Delete |
| Work Item Type | Create, Get, Get Many, Update, Delete |
| Custom Property | Create, Get, Get Many, Update, Delete |
| Custom Property Value | Get Many, Update |
| Custom Property Option | Create, Get, Get Many, Update, Delete |
| Cycle | Create, Get, Get Many, Update, Delete |
| Module | Create, Get, Get Many, Update, Delete |
| Page | Create, Get |
| Intake | Create, Get, Get Many, Update, Delete |
| Time Tracking | Create, Get Many, Update, Delete |
| Epic | Get, Get Many |
| Initiative | Create, Get, Get Many, Update, Delete |
| Initiative Label | Create, Get, Get Many, Update, Delete, Add/Remove/List for Initiative |
| Initiative Project | Add, Get Many, Remove |
| Initiative Epic | Add, Get Many, Remove |
| Customer | Create, Get, Get Many, Update, Delete, Link/Unlink/Get Work Items |
| Customer Property | Create, Get, Get Many, Update, Delete |
| Customer Request | Create, Get, Get Many, Update, Delete |
| Teamspace | Create, Get, Get Many, Update, Delete |
| Teamspace Member | Add, Get Many, Remove |
| Teamspace Project | Add, Get Many, Remove |
| Sticky | Create, Get, Get Many, Update, Delete |

## Development

```zsh
bun install
bun run build
bun run dev
bun run lint
```

## License

MIT
