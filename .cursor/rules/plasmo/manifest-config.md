---
description: Manifest V3 configuration guidelines for Plasmo
globs: "package.json"
---

# Manifest V3 Configuration Guidelines

## Core Configuration

### Basic Setup

✅ Configure manifest in package.json:

```json
{
  "name": "my-extension",
  "displayName": "My Extension",
  "version": "0.0.1",
  "description": "A powerful browser extension",
  "author": "Your Name",
  "manifest": {
    "host_permissions": ["https://*/*"],
    "permissions": ["storage", "tabs"]
  }
}
```

### Version and Build Info

✅ Configure version and build settings:

```json
{
  "version": "1.0.0",
  "plasmo": {
    "manifest": {
      "manifest_version": 3,
      "minimum_chrome_version": "88",
      "browser_specific_settings": {
        "gecko": {
          "id": "{your-addon-id}",
          "strict_min_version": "109.0"
        }
      }
    }
  }
}
```

## Permissions Configuration

### Essential Permissions

✅ Define required permissions:

```json
{
  "manifest": {
    "permissions": [
      "storage", // For data persistence
      "tabs", // For tab management
      "activeTab", // For current tab access
      "scripting", // For content script injection
      "notifications" // For system notifications
    ],
    "optional_permissions": [
      "bookmarks", // Optional bookmark access
      "history" // Optional history access
    ]
  }
}
```

❌ Avoid unnecessary permissions:

```json
{
  "manifest": {
    "permissions": [
      "management", // Bad: Rarely needed
      "debugger", // Bad: Development only
      "proxy" // Bad: Unless specifically required
    ]
  }
}
```

### Host Permissions

✅ Define specific host permissions:

```json
{
  "manifest": {
    "host_permissions": [
      "https://*.example.com/*", // Specific domain
      "https://*.api.service.com/*" // API domain
    ],
    "optional_host_permissions": ["https://*.optional-domain.com/*"]
  }
}
```

## Content Security Policy

### CSP Configuration

✅ Configure secure CSP:

```json
{
  "plasmo": {
    "manifest": {
      "content_security_policy": {
        "extension_pages": "script-src 'self'; object-src 'self'",
        "sandbox": "sandbox allow-scripts allow-forms allow-popups allow-modals"
      }
    }
  }
}
```

## Web Accessible Resources

### Resource Configuration

✅ Configure accessible resources:

```json
{
  "manifest": {
    "web_accessible_resources": [
      {
        "resources": ["assets/*", "fonts/*"],
        "matches": ["https://*.example.com/*"]
      }
    ]
  }
}
```

## Background Service Worker

### Worker Configuration

✅ Configure background service worker:

```json
{
  "plasmo": {
    "manifest": {
      "background": {
        "service_worker": "background.js",
        "type": "module"
      }
    }
  }
}
```

## Content Scripts

### Script Configuration

✅ Configure content scripts:

```json
{
  "manifest": {
    "content_scripts": [
      {
        "matches": ["https://*.example.com/*"],
        "js": ["content.js"],
        "css": ["content.css"],
        "run_at": "document_end"
      }
    ]
  }
}
```

## Action Configuration

### Browser Action

✅ Configure browser action:

```json
{
  "plasmo": {
    "manifest": {
      "action": {
        "default_popup": "popup.html",
        "default_icon": {
          "16": "assets/icon16.png",
          "32": "assets/icon32.png",
          "48": "assets/icon48.png",
          "128": "assets/icon128.png"
        }
      }
    }
  }
}
```

## Development Configuration

### Development Settings

✅ Configure development options:

```json
{
  "plasmo": {
    "manifest": {
      "key": "development-key-for-consistent-id",
      "update_url": "https://example.com/updates.xml"
    }
  },
  "scripts": {
    "dev": "plasmo dev",
    "build": "plasmo build",
    "package": "plasmo package"
  }
}
```

## Cross-Browser Support

### Browser-Specific Settings

✅ Configure for multiple browsers:

```json
{
  "plasmo": {
    "manifest": {
      "browser_specific_settings": {
        "gecko": {
          "id": "{addon-id}",
          "strict_min_version": "109.0"
        },
        "edge": {
          "browser_action_next_to_address_bar": true
        }
      }
    }
  }
}
```

## Best Practices

### Version Management

✅ Use semantic versioning:

```json
{
  "version": "1.2.3",
  "private": false,
  "scripts": {
    "version": "plasmo version",
    "postversion": "plasmo package"
  }
}
```

### Development Dependencies

✅ Include necessary development dependencies:

```json
{
  "devDependencies": {
    "@plasmohq/prettier-plugin-sort-imports": "^4.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "@types/chrome": "^0.0.260",
    "@types/node": "^20.0.0"
  }
}
```

### Package Scripts

✅ Define useful package scripts:

```json
{
  "scripts": {
    "dev": "plasmo dev",
    "build": "plasmo build",
    "package": "plasmo package",
    "submit": "plasmo submit",
    "lint": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```
