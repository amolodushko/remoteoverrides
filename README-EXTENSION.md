# Remote Override Manager - Chrome Extension

A Chrome extension for managing remote overrides for Via applications.

## Features

- ✅ Manage app overrides with a clean interface
- ✅ Create and delete custom apps
- ✅ Persistent storage using Chrome's storage API
- ✅ Real-time validation for duplicate entries
- ✅ Responsive popup interface

## Installation

### Development Installation

1. **Build the extension:**
   ```bash
   npm run build:extension
   ```

2. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist/` directory from your project

3. **Use the extension:**
   - Click the extension icon in your Chrome toolbar
   - The popup will open with the Remote Override Manager interface

## Development

### Project Structure

```
├── public/
│   ├── manifest.json          # Extension manifest
│   ├── background.js          # Background service worker
│   ├── content.js             # Content script
│   └── icon*.png              # Extension icons
├── src/
│   ├── stores/                # Zustand stores
│   ├── components/            # React components
│   └── ...
├── scripts/
│   └── build-extension.js     # Build script
└── dist/                      # Built extension (generated)
```

### Building

```bash
# Build the extension
npm run build:extension

# This will:
# 1. Build the React app with Vite
# 2. Copy extension files to dist/
# 3. Package everything for Chrome
```

### Key Files

- **manifest.json**: Extension configuration and permissions
- **background.js**: Service worker for storage and messaging
- **content.js**: Script that runs on web pages
- **chromeStorage.ts**: Chrome storage adapter for Zustand

## Usage

1. **Open the extension** by clicking the icon in your Chrome toolbar
2. **Manage apps** in the Settings modal
3. **Create new apps** with the "Create New App" button
4. **Set overrides** for each app in the table
5. **Apply overrides** that will be used by the content script

## Storage

The extension uses Chrome's storage API to persist:
- App selection preferences
- Override values for each app
- Custom app definitions

## Permissions

- `storage`: For persisting app data and overrides
- `activeTab`: For accessing the current tab's content

## Development Notes

- The extension runs as a popup (800x600px)
- Content script can inject overrides into web pages
- Background script handles storage and messaging
- All state is managed with Zustand and persisted to Chrome storage

## Troubleshooting

1. **Extension not loading**: Check the console in `chrome://extensions/`
2. **Storage issues**: Verify permissions in manifest.json
3. **Build errors**: Run `npm install` and try building again

## Next Steps

- Add icons for the extension
- Implement actual override injection logic in content script
- Add keyboard shortcuts
- Create options page for advanced settings 