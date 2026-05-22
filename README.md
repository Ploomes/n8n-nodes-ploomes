<p align="center">
  <img src="nodes/Ploomes/ploomes.png" alt="Ploomes CRM" width="80" />
</p>

<h1 align="center">n8n-nodes-ploomes</h1>

<p align="center">
  <strong>Community node for <a href="https://n8n.io">n8n</a> that integrates with the <a href="https://www.ploomes.com">Ploomes CRM</a> API</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-ploomes"><img src="https://img.shields.io/npm/v/n8n-nodes-ploomes?style=flat-square&color=ff6d5a" alt="npm version" /></a>
  <a href="https://github.com/Ploomes/n8n-nodes-ploomes/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Ploomes/n8n-nodes-ploomes?style=flat-square" alt="license" /></a>
  <a href="https://developers.ploomes.com/"><img src="https://img.shields.io/badge/API%20Docs-developers.ploomes.com-blue?style=flat-square" alt="API docs" /></a>
  <a href="https://n8n.io"><img src="https://img.shields.io/badge/n8n-community%20node-ff6d5a?style=flat-square&logo=n8n" alt="n8n community node" /></a>
</p>

---

## About

This node lets you automate and integrate **Ploomes CRM** with hundreds of other apps in n8n. It provides full REST API coverage with native OData v4 support and visual builders for complex filters and expansions.

---

## Features

| Feature | Description |
|---|---|
| **126 actions** | Full coverage of 50 API resources |
| **Secure credentials** | Authentication via `User-Key` header with connection test |
| **Optimized OData** | Smart defaults: `$top=1`, `$select=Id`, `$orderby=Id` |
| **Visual Filter Builder** | Build `$filter` queries through the UI without writing OData |
| **Visual Expand Builder** | Build `$expand` with nested `$select`, `$filter`, and `$expand` |
| **Custom property filters** | Support for `OtherProperties/any(...)` via the UI |
| **Raw mode** | Switch to free-text mode for advanced OData queries |
| **Special actions** | Deal Win/Lose/Reopen, Task Finish, Quote Review |
| **Custom API Call** | Generic resource for unmapped endpoints |

---

## Installation

### Via n8n (recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter `n8n-nodes-ploomes` and install

### Via npm

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-ploomes
```

### Local development

```bash
git clone https://github.com/Ploomes/n8n-nodes-ploomes.git
cd n8n-nodes-ploomes
npm install
npm run build
npm link

# In another terminal
cd ~/.n8n/nodes
npm link n8n-nodes-ploomes
```

---

## Credentials Setup

1. In n8n, add the **Ploomes CRM** node to your workflow
2. Click **Select Credential > Create new credential**
3. Enter your Ploomes API **User-Key**
4. Click **Save** — the connection will be tested automatically

> To obtain your User-Key, go to your Ploomes account under **Settings > Integration > API**.
> Documentation: [developers.ploomes.com](https://developers.ploomes.com/)

---

## Available Resources

### Core Entities

| Resource | Operations |
|---|---|
| **Contact** | Get Many, Create, Update, Delete |
| **Deal** | Get Many, Create, Update, Delete, Win, Lose, Reopen |
| **Quote** | Get Many, Create, Update, Delete, Review |
| **Task** | Get Many, Create, Update, Delete, Finish |
| **Order** | Get Many, Create, Update, Delete |
| **Product** | Get Many, Create, Update, Delete |
| **Document** | Get Many, Create, Update, Delete |
| **Interaction Record** | Get Many, Create, Update, Delete |

### Settings and Administration

| Resource | Operations |
|---|---|
| **Account** | Get Many, Update |
| **User** | Get Many, Create, Update |
| **Role** | Get Many, Create |
| **Team** | Get Many, Create, Update, Delete |
| **Department** | Get Many, Create, Update, Delete |
| **Field** | Get Many, Create, Update, Delete |
| **Webhook** | Get Many, Create, Update, Delete |

### Contact Sub-resources

| Resource | Operations |
|---|---|
| Contact Line of Business | CRUD |
| Contact Number of Employees | CRUD |
| Contact Origin | CRUD |
| Contact Product | CRUD |
| Contact Relationship | Get Many |
| Contact Status | Get Many |
| Contact Type | Get Many |

### Deal Sub-resources

| Resource | Operations |
|---|---|
| Deal Pipeline | CRUD |
| Deal Stage | Get Many |
| Deal Status | Get Many |
| Deal Loss Reason | Get Many |

### Product Sub-resources

| Resource | Operations |
|---|---|
| Product Family | CRUD |
| Product Group | CRUD |
| Product Part | CRUD |

### Other Resources

| Resource | Operations |
|---|---|
| City, Country, State | Get Many |
| Currency | Get Many |
| Document Template | Get Many |
| Field Entity, Field Type | Get Many |
| Field Options Table | Get Many, Create |
| Order Stage | CRUD |
| Phone Type | Get Many |
| Quote Approval Status | Get Many |
| Relative Date | Get Many |
| Tag | CRUD |
| Task Type, Task Email Reminder | Get Many |
| User Profile | Get Many |
| Webhook Action | Get Many |

---

## OData Filter Builder

The node includes a visual builder that lets you create complex `$filter` queries without writing OData manually.

### Simple filters

Add conditions with field, operator, and value:

```
Field: Name    Operator: contains    Value: Ploomes    Type: String
Field: Id      Operator: eq          Value: 12345      Type: Number
```

Generated result:
```
$filter=contains(Name,'Ploomes') and Id eq 12345
```

### Available operators

| Operator | Description | Example |
|---|---|---|
| `eq` | Equal | `Id eq 123` |
| `ne` | Not equal | `Status ne 'Closed'` |
| `gt` / `ge` | Greater than / Greater than or equal | `Amount gt 1000` |
| `lt` / `le` | Less than / Less than or equal | `Amount le 5000` |
| `contains` | Contains text | `contains(Name,'test')` |
| `startswith` | Starts with | `startswith(Name,'A')` |
| `endswith` | Ends with | `endswith(Email,'.com')` |

### Custom property filters

To filter by custom fields (`OtherProperties`), use the dedicated builder:

```
FieldKey: contact_cf_123    Operator: eq    Value: test    Type: String
```

Generated result:
```
$filter=OtherProperties/any(p: p/FieldKey eq 'contact_cf_123' and p/StringValue eq 'test')
```

---

## OData Expand Builder

Build complex `$expand` queries visually, with nesting support:

### Complex example via the UI

The following expand can be built entirely through the visual builder:

```
$expand=Stage($select=Id,Ordination,PipelineId,LastPipelineStage),
       Status,
       Owner($select=Id,Name),
       Creator($select=Id,Name),
       Pipeline($select=Id,ForbiddenStageReturn,MustPassAllStages,Stages;$expand=Stages),
       OtherProperties($expand=CurrencyValue;$filter=FieldId eq 40006914 or FieldId eq 40006915)
```

### How to configure

1. **Expand Relations**: Add each relation with its optional `$select`
2. **Expand Nested Filters**: Add filters inside expansions (e.g., filter `OtherProperties` by `FieldId`)

---

## OData Optimization Defaults

All GET requests are automatically optimized:

| Parameter | Default | Description |
|---|---|---|
| `$top` | `1` | Limit of returned records |
| `$skip` | `0` | Offset for pagination |
| `$select` | `Id` | Returned fields (reduces payload) |
| `$orderby` | `Id` | Sort order of results |

> All parameters are editable — adjust as needed for your automation.

---

## Usage Examples

### Fetch contacts with a filter

```
Resource: Contact
Operation: Get Many
$top: 10
$select: Id,Name,Email
$filter: contains(Name,'Silva')
```

### Create a deal

```
Resource: Deal
Operation: Create
Body: { "ContactId": 123, "Title": "New deal", "Amount": 5000 }
```

### Win a deal

```
Resource: Deal
Operation: Win
ID: 456
Body: { "WonAmount": 5000, "WonProductsAmount": 5000 }
```

### Fetch deals with a complex expand

```
Resource: Deal
Operation: Get Many
$top: 50
$select: Id,Title,Amount
$expand: Stage($select=Id,Ordination),Owner($select=Id,Name),Pipeline($select=Id;$expand=Stages)
```

---

## API Limits

| Limit | Value |
|---|---|
| Requests per minute | 120 per account |
| Maximum payload size | 10 MB |
| Records per page | 300 (Contacts, Deals, Cities, Tasks, Orders, Quotes) |

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Lint
npm run lint

# Format code
npm run format

# Watch mode
npm run dev
```

---

## License

[MIT](LICENSE)

---

<p align="center">
  Made with &#10084;&#65039; by <a href="https://www.ploomes.com">Ploomes</a>
</p>
