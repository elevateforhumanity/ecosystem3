# Framework Settings Documentation

## Overview

The new framework settings system provides a comprehensive configuration management solution for the Elevate for Humanity ecosystem. This system centralizes all framework-related settings and provides a user-friendly interface for managing them.

## Key Features

### 🏗️ Centralized Configuration
- **Location**: `config/framework.config.json`
- **Management**: `src/lib/frameworkSettings.ts`
- **UI**: `src/components/FrameworkSettingsPanel.tsx`

### ⚙️ Framework Stack Configuration
Current framework settings include:

- **Build System**: Vite with TypeScript support
- **Frontend**: React 18.3.1 with modern features
- **Styling**: Tailwind CSS 3.4.10
- **Testing**: Vitest with jsdom environment
- **TypeScript**: ES2022 target with strict mode
- **Linting**: ESLint with React and TypeScript plugins

### 🌐 Multi-Site Ecosystem Support
- Sister site configuration management
- Shared component and service tracking
- Cross-site branding coordination

### 🔧 Configuration Sections

#### Build Configuration
```json
{
  "framework": "vite",
  "target": "ES2022", 
  "minify": true,
  "sourcemap": true,
  "outDir": "dist"
}
```

#### Frontend Configuration
```json
{
  "framework": "react",
  "version": "18.3.1",
  "features": ["hooks", "suspense", "error-boundaries"]
}
```

#### Testing Configuration
```json
{
  "framework": "vitest",
  "environment": "jsdom",
  "coverage": {
    "provider": "v8",
    "threshold": { "global": { "lines": 80 } }
  }
}
```

## Usage

### Accessing Framework Settings
```javascript
import { frameworkSettings } from './src/lib/frameworkSettings';

// Get complete configuration
const config = frameworkSettings.getConfig();

// Get specific sections
const buildConfig = frameworkSettings.getBuildConfig();
const frontendConfig = frameworkSettings.getFrontendConfig();

// Check features
const isTypeScriptEnabled = frameworkSettings.isTypescriptEnabled();
const isMultiSite = frameworkSettings.isMultiSiteEnabled();
```

### Settings UI
The framework settings can be accessed via:
- URL: `/settings` 
- Framework tab provides overview and detailed configuration
- Real-time validation and compatibility checking

### Validation
The system includes automatic validation:
- Framework version compatibility checks
- Configuration completeness validation
- Multi-site setup verification
- TypeScript configuration validation

## Configuration Management

### Adding New Settings
1. Update `config/framework.config.json`
2. Add corresponding interface in `frameworkSettings.ts`
3. Add getter methods in `FrameworkSettings` class
4. Update validation logic if needed

### Environment-Specific Settings
The system supports:
- Development configurations
- Performance settings
- Security configurations
- Deployment settings

## Benefits

### ✅ Centralized Management
- Single source of truth for all framework settings
- Consistent configuration across the ecosystem
- Easy maintenance and updates

### ✅ User-Friendly Interface
- Visual configuration overview
- Real-time validation feedback
- Organized by functional areas

### ✅ Developer Experience
- Type-safe configuration access
- Comprehensive validation
- Clear documentation and examples

### ✅ Multi-Site Support
- Sister site coordination
- Shared resource management
- Unified branding control

## Files Structure
```
config/
  └── framework.config.json         # Main configuration file
src/
  ├── lib/
  │   └── frameworkSettings.ts      # Configuration management
  ├── components/
  │   └── FrameworkSettingsPanel.tsx # Settings UI component
  ├── pages/
  │   └── Settings.jsx              # Settings page with tabs
  └── types/
      └── framework.d.ts            # Type definitions
```

## Future Enhancements
- Runtime configuration updates
- Configuration history and rollback
- Advanced validation rules
- Integration with CI/CD pipelines
- Performance monitoring integration