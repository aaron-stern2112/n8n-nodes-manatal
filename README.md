# n8n-nodes-manatal

An n8n community node for [Manatal](https://www.manatal.com) — a cloud-based ATS (Applicant Tracking System). Automate your recruiting workflows by connecting Manatal to 400+ services in n8n.

## Supported Resources & Operations

### Core Resources

| Resource         | Create | Get | Get Many | Update |
| ---------------- | :----: | :-: | :------: | :----: |
| **Candidate**    |   ✓    |  ✓  |    ✓     |   ✓    |
| **Contact**      |   ✓    |  ✓  |    ✓     |   ✓    |
| **Job**          |   ✓    |  ✓  |    ✓     |   ✓    |
| **Match**        |   ✓    |  ✓  |    ✓     |   ✓    |
| **Organization** |   ✓    |  ✓  |    ✓     |   ✓    |

### Notes

| Resource              | Create | Get | Get Many | Update |
| --------------------- | :----: | :-: | :------: | :----: |
| **Candidate Note**    |   ✓    |  ✓  |    ✓     |   ✓    |
| **Contact Note**      |   ✓    |  ✓  |    ✓     |   ✓    |
| **Job Note**          |   ✓    |  ✓  |    ✓     |   ✓    |
| **Match Note**        |   ✓    |  ✓  |    ✓     |   ✓    |
| **Organization Note** |   ✓    |  ✓  |    ✓     |   ✓    |

### Attachments

| Resource                    | Create | Get | Get Many | Update |
| --------------------------- | :----: | :-: | :------: | :----: |
| **Candidate Attachment**    |   ✓    |  ✓  |    ✓     |   ✓    |
| **Contact Attachment**      |   ✓    |  ✓  |    ✓     |   ✓    |
| **Job Attachment**          |   ✓    |  ✓  |    ✓     |   ✓    |
| **Match Attachment**        |   ✓    |  ✓  |    ✓     |   ✓    |
| **Organization Attachment** |   ✓    |  ✓  |    ✓     |   ✓    |

### Candidate Sub-resources

| Resource                   | Operations                 |
| -------------------------- | -------------------------- |
| **Candidate Match**        | Get, Get Many              |
| **Candidate Nationality**  | Add, Get, Get Many, Update |
| **Candidate Resume**       | Get, Upload                |
| **Candidate Social Media** | Create, Get, Get Many      |

### Job Sub-resources

| Resource      | Operations    |
| ------------- | ------------- |
| **Job Match** | Get, Get Many |

**Get Many** operations support:

- **Return All** toggle to auto-paginate through all results
- **Limit** to cap results when Return All is off
- **Filters** collection with date ranges and resource-specific search fields

## Trigger Node

| Model     | Events                        |
| --------- | ----------------------------- |
| Candidate | Created, Updated              |
| Contact   | Created, Updated              |
| Match     | Created, Moved (stage change) |
| Job       | Status Updated                |

## Installation

### n8n Cloud / self-hosted (once published)

In n8n go to **Settings → Community Nodes**, search for `@manatal/n8n-nodes-manatal`, and install.

### Local development

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Link for local testing
npm link

# In your n8n installation directory
cd ~/.n8n/custom
npm link @manatal/n8n-nodes-manatal

# Start n8n
n8n start
```

## Authentication

1. Log in to Manatal as an Admin
2. Go to **Settings → Integrations → Open API**
3. Generate or copy your API token
4. In n8n, create a **Manatal Open API** credential and paste the token

The token is sent as `Authorization: Token <your-token>` on every request. You can verify it by clicking **Test credential** — the node calls `GET /users/` to confirm access.

For more detail on generating your API key, see the [Manatal API Getting Started guide](https://developers.manatal.com/reference/getting-started).

## API Reference

| Property         | Value                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Base URL         | `https://api.manatal.com/open/v3`                                                         |
| Webhook Base URL | `https://manahook.api.manatal.com/v1`                                                     |
| Auth header      | `Authorization: Token <token>`                                                            |
| Rate limit       | 100 requests / 60 seconds per token                                                       |
| Pagination       | `page` / `page_size` query params; **Return All** handles this automatically              |
| Custom fields    | Require a **full JSON object** on every write — partial objects overwrite existing values |

- [Manatal API Reference](https://developers.manatal.com/reference/getting-started)
- [Manatal Support Documentation](https://support.manatal.com/)

## License

[MIT](LICENSE.md)
