## Design: Integration of dva-logger and dva-gui into ModernX

### Context
ModernX is a React state management framework based on Redux and Redux-Saga. The DVA ecosystem provides valuable tools including dva-logger (Redux logging) and dva-gui (visual debugging). Integrating these tools will enhance ModernX's developer experience and provide migration path for DVA users.

### Goals / Non-Goals
**Goals:**
- Provide Redux logging capabilities for ModernX applications
- Offer visual debugging and state inspection tools
- Maintain compatibility with existing ModernX plugin system
- Enable smooth migration from DVA to ModernX
- Preserve the core functionality of original tools

**Non-Goals:**
- Full feature parity with advanced DVA GUI features
- Custom logging formats beyond redux-logger capabilities
- Real-time collaboration features
- Mobile app development support

### Decisions

#### Decision 1: Plugin Architecture
**What**: Implement both tools as ModernX plugins following existing patterns
**Why**: 
- Consistent with ModernX ecosystem (modernx-immer, modernx-loading)
- Allows optional installation and configuration
- Maintains separation of concerns

**Alternatives considered:**
- Built-in core functionality: Would increase bundle size unnecessarily
- Standalone tools: Would break integration with ModernX

#### Decision 2: Package Structure
**What**: Create separate packages (modernx-logger, modernx-gui)
**Why**:
- Follows established ModernX pattern
- Allows independent versioning and maintenance
- Enables users to install only needed tools

#### Decision 3: API Compatibility
**What**: Adapt DVA APIs to ModernX patterns while preserving functionality
**Why**:
- Maintains familiar usage patterns for DVA users
- Ensures proper integration with ModernX's plugin system
- Provides clear migration path

### Technical Architecture

#### modernx-logger
```javascript
// Plugin interface
export default {
  onAction: createLogger(options),
  onReducer: (reducer) => reducer, // Pass-through
  onEffect: (effect) => effect,     // Pass-through
};
```

#### modernx-gui
```javascript
// CLI tool usage
npx modernx-gui

// Integration API (when app runs with GUI plugin)
export default {
  onAction: (action) => gui.sendAction(action),
  onStateChange: (state) => gui.updateState(state),
  setup: (app) => gui.initialize(app),
};
```

### Decision 3: Project-Local GUI Implementation
**What**: Create a command-line tool that runs within ModernX projects
**Why**: Provides immediate access to debugging without complex setup

**Implementation Approach:**
- **CLI Tool**: `npx modernx-gui` command starts local server
- **Auto-detection**: Scans project for ModernX structure
- **Browser Integration**: Auto-opens default browser to GUI
- **Real-time Connection**: WebSocket communication with running app

**Technical Architecture:**
```javascript
// CLI entry point
// packages/modernx-gui/bin/modernx-gui
#!/usr/bin/env node
const { startServer } = require('../lib/server');
const { detectProject } = require('../lib/project-detector');
const { openBrowser } = require('../lib/browser');

async function main() {
  const projectInfo = await detectProject(process.cwd());
  const server = await startServer(projectInfo);
  await openBrowser(server.url);
}

main();
```

### Decision 3: GUI Framework Selection
**What**: Evaluate multiple GUI framework options beyond Electron
**Why**: Consider modern alternatives with better developer experience and maintenance

**Options Analysis:**

#### Option 1: Electron (Current DVA Approach)
**Pros:**
- Cross-platform desktop application
- Full native OS integration
- Established pattern from dva-gui

**Cons:**
- Large bundle size (~100MB+)
- High memory usage
- Complex build process
- Slower startup time

#### Option 2: Web-based GUI (Recommended)
**Pros:**
- Lightweight browser-based interface
- No installation required
- Fast development iteration
- Modern web technologies
- Easy integration with browser dev tools
- Smaller bundle size (~5MB)

**Cons:**
- Requires browser
- Limited OS integration
- Network dependency for localhost

#### Option 3: Tauri (Modern Alternative)
**Pros:**
- Rust-based backend (secure & fast)
- Much smaller bundle size (~10MB)
- Modern web frontend
- Better performance than Electron

**Cons:**
- Newer ecosystem
- Rust learning curve
- Smaller community

#### Option 4: VS Code Extension
**Pros:**
- Integrated into development environment
- Large existing user base
- Extension marketplace distribution

**Cons:**
- VS Code specific
- Limited UI flexibility
- Extension API constraints

**Recommended Decision: Web-based GUI**
- Best balance of functionality and maintainability
- Aligns with modern web development practices
- Easier for ModernX developers to contribute
- Can be served from development server
- Potential future migration to Tauri if needed

### Migration Plan

#### Phase 1: Core Integration
1. Port dva-logger functionality
2. Create ModernX plugin interface
3. Basic testing and validation

#### Phase 2: GUI Integration  
1. Adapt dva-gui for ModernX
2. Update Electron configuration
3. Create integration API

#### Phase 3: CLI and Documentation
1. Update CLI templates
2. Add documentation and examples
3. Final testing and release

#### Rollback Strategy
- Maintain separate package versions
- Provide clear deprecation paths if needed
- Preserve backward compatibility

### Risks and Mitigations

#### Risk 1: Dependency Conflicts
**Mitigation**: Use peer dependencies and version ranges

#### Risk 2: Performance Impact
**Mitigation**: Optional installation, lazy loading for GUI

#### Risk 3: Maintenance Burden
**Mitigation**: Clear separation of concerns, automated testing

### Open Questions

1. Should modernx-gui support remote debugging scenarios?
2. What level of customization should be exposed for logging formats?
3. Should we integrate with browser dev tools?

### Integration Points

#### ModernX Core Integration
- Plugin registration system
- Action and state change hooks
- Configuration management

#### CLI Integration
- Template generation options
- Development server commands
- Project scaffolding

#### Documentation Integration
- API documentation
- Usage examples
- Migration guides
