# Contributing

## Prerequisites

- Node.js 18+
- A Manatal account with API access (**Settings → Integrations → Open API**)
- n8n installed globally or via `npx`
- Familiarity with the [Manatal API](https://developers.manatal.com/reference/getting-started)

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Build the package
npm run build

# 3. Point n8n at this directory
export N8N_CUSTOM_EXTENSIONS="/absolute/path/to/this/repo"

# 4. Start n8n
npx n8n start
```

After any code change: `npm run build` → restart n8n.

Use `npm run dev` for watch mode — TypeScript recompiles on save (you still need to restart n8n to pick up changes).

## Project Structure

```
nodes/Manatal/
├── Manatal.node.ts                    # Main node: resource dropdown, loadOptions, execute() router
├── ManatalTrigger.node.ts             # Webhook trigger node
├── GenericFunctions.ts                # Shared: manatalApiRequest, handleGetMany, asArray, parseJsonField, parentResourcePath
├── manatal.svg                        # Node icon
├── Manatal.node.json                  # Codex metadata
├── ManatalTrigger.node.json           # Codex metadata for trigger
│
├── *Description.ts files              # UI field definitions (INodeProperties[]) per resource group
│   ├── CandidateDescription.ts
│   ├── JobDescription.ts
│   ├── MatchDescription.ts
│   ├── OrganizationDescription.ts
│   ├── ContactDescription.ts
│   ├── NoteDescription.ts             # Shared across all 5 parent resources
│   ├── AttachmentDescription.ts       # Shared across all 5 parent resources
│   ├── CandidateSubresourceDescription.ts
│   └── JobSubresourceDescription.ts
│
└── handlers/                          # Execute logic per resource
    ├── candidate.ts
    ├── job.ts
    ├── match.ts
    ├── organization.ts
    ├── contact.ts
    ├── note.ts                        # Shared handler for *Note resources
    ├── attachment.ts                  # Shared handler for *Attachment resources
    ├── candidateSubresources.ts       # Nationality, Resume, Social Media, Match
    └── jobSubresources.ts             # Job Match
```

## Adding a New Resource

Adding a resource requires changes to three places only:

### 1. Create `nodes/Manatal/<Resource>Description.ts`

Export two arrays: `<resource>Operations` (the Operation dropdown) and `<resource>Fields` (all field definitions). Use `displayOptions.show` to scope every field to its resource and operation.

```typescript
import type { INodeProperties } from 'n8n-workflow';

export const widgetOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['widget'] } },
    options: [
      { name: 'Create', value: 'create', action: 'Create a widget' },
      { name: 'Get',    value: 'get',    action: 'Get a widget' },
    ],
    default: 'get',
  },
];

export const widgetFields: INodeProperties[] = [
  // ... field definitions
];
```

Refer to the [Manatal API Reference](https://developers.manatal.com/reference/getting-started) for field names, types, and required/optional status.

### 2. Create `nodes/Manatal/handlers/widget.ts`

Export one function that handles all operations for the resource.

```typescript
import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { handleGetMany, manatalApiRequest } from '../GenericFunctions';

export async function widgetExecute(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  if (operation === 'get') {
    const id = this.getNodeParameter('widgetId', i) as string;
    return manatalApiRequest.call(this, 'GET', `/widgets/${id}/`);
  } else if (operation === 'getMany') {
    const filters = this.getNodeParameter('filters', i) as IDataObject;
    return handleGetMany.call(this, '/widgets/', i, { ...filters });
  }
  // ... other operations
  throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "widget"`, { itemIndex: i });
}
```

### 3. Wire up `Manatal.node.ts`

Three additions:

```typescript
// a) Import the description arrays
import { widgetOperations, widgetFields } from './WidgetDescription';

// b) Import the handler
import { widgetExecute } from './handlers/widget';

// c) Add to the resource dropdown options array
{ name: 'Widget', value: 'widget' },

// d) Spread fields into properties[]
...widgetOperations, ...widgetFields,

// e) Add a routing branch in execute()
} else if (resource === 'widget') {
  responseData = await widgetExecute.call(this, operation, i);
}
```

## Shared Utilities in GenericFunctions.ts

| Function | Purpose |
|---|---|
| `manatalApiRequest` | Single HTTP request with auth + error handling |
| `manatalApiRequestAllItems` | Auto-paginates through all pages (for paginated endpoints) |
| `manatalWebhookApiRequest` | Same as above but targets the webhook base URL |
| `handleGetMany` | Handles the Return All / Limit / pagination pattern |
| `asArray` | Safely casts raw-array API responses (notes, attachments, social media, resume) |
| `parseJsonField` | Parses a string field to JSON in-place (used for `custom_fields`) |
| `parentResourcePath` | Maps `candidateNote` → `{ apiBase: 'candidates', idParam: 'candidateId' }` etc. |

### Raw Array vs Paginated Responses

This distinction is critical — using the wrong helper returns incorrect data:

| Response shape | Endpoints | How to fetch |
|---|---|---|
| Raw JSON array `[...]` | Notes, Attachments, Social Media, Resume | `asArray(await manatalApiRequest(...))` |
| Paginated `{ count, next, results[] }` | Candidates, Jobs, Matches, Organizations, Contacts, Nationality, Candidate Matches, Job Matches | `handleGetMany(...)` or `manatalApiRequestAllItems(...)` |

## Code Style

```bash
npm run lint       # check
npm run lint:fix   # auto-fix
npm run format     # Prettier
```

Key rules:
- TypeScript only — no JavaScript
- `n8n-core` and `n8n-workflow` must stay in `devDependencies` only (never `dependencies`)
- No runtime `dependencies` block in `package.json`
- All user-facing text (labels, descriptions, error messages) in English

## Before Opening a PR

- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes with no errors
- [ ] New fields match the [Manatal API schema](https://developers.manatal.com/reference/getting-started)
- [ ] Enum values match the API exactly (e.g. `source_type`: `sourced/applied/referred/agency/other`)
- [ ] Read-only API fields are not exposed as writable inputs
- [ ] Filter parameter names use `__gte` / `__lte` suffixes for date ranges
- [ ] Raw-array endpoints (notes, attachments, social media, resume) use `asArray()`, not `handleGetMany()`
- [ ] New handler file exports a single `*Execute` function; no cross-handler imports

## Publishing

Publishing to npm requires GitHub Actions with provenance (mandatory since May 2026). Push a version tag to trigger the publish workflow:

```bash
npm version patch   # or minor / major
git push --follow-tags
```

## Useful Links

- [Manatal API Reference](https://developers.manatal.com/reference/getting-started)
- [Manatal Support Center](https://support.manatal.com/)
- [n8n Community Node docs](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n node linter](https://www.npmjs.com/package/@n8n/scan-community-package)
