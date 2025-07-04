# Calendar Tools MCP Server

A powerful Model Context Protocol (MCP) server providing comprehensive calendar management capabilities.

## Features

### Calendar Management

- Create calendar events
- List calendar events
- Update existing events
- Delete events

### Manual Installation

```bash
npm install -g @cablate/mcp-google-calendar
```

## Usage

### Cli

```bash
mcp-google-calendar
```

### MCP Server

```json
{
  "mcpServers": {
    "calendar": {
      "command": "npx",
      "args": ["-y", "@zion.cloud/mcp-google-calendar"],
      "env": {
        "GOOGLE_CALENDAR_ID": "your_calendar_id",
        "GOOGLE_TIME_ZONE": "your_time_zone",
        "GOOGLE_CREDENTIALS_PATH": "your_credentials_path"
      },
      "enabled": true
    }
  }
}
```

## Google Service Account and Credentials

Here is the simple steps to create a google service account and credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Navigate to the "IAM & Admin" section
4. Click on "Service Accounts"
5. Click on "Create Service Account"
6. Enter a name for the service account (e.g., "MCP Google Calendar")
7. Click on "Create"
8. Click on "Create Key"
9. Select "JSON" as the key type
10. Click on "Create"
11. Download the JSON file and save it as `credentials.json`

if still got any question, google and find the answer.

## License

MIT

## Contributing

Welcome community participation and contributions! Here are ways to contribute:

- ⭐️ Star the project if you find it helpful
- 🐛 Submit Issues: Report problems or provide suggestions
- 🔧 Create Pull Requests: Submit code improvements
