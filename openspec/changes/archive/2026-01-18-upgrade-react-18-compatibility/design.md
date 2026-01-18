## Context
The dva framework is a lightweight React and Redux-based framework that needs to be upgraded to fully support React 18+ features. The current implementation has partial React 18 compatibility but lacks comprehensive support for concurrent features, modern dependencies, and updated testing frameworks.

**Constraints:**
- Must maintain API backward compatibility
- Must support React 16.14+ through React 18+
- Cannot break existing user applications
- Must maintain ≥90% test coverage

**Stakeholders:**
- dva framework users (existing applications)
- Development team
- React ecosystem community

## Goals / Non-Goals
- **Goals:**
  - Full React 18+ compatibility including concurrent features
  - Modern dependency ecosystem (React Router v6, Redux updates)
  - Updated testing framework supporting React 18
  - Performance optimizations using React 18 features
  - Updated documentation and examples
  
- **Non-Goals:**
  - Breaking API changes
  - Removing existing features
  - Changing core dva architecture
  - Supporting React versions < 16.14

## Decisions

### Decision: React Router v6 Migration
- **What**: Upgrade from React Router v5 to v6
- **Why**: React Router v6 has better React 18 support and modern API
- **Impact**: Breaking change for routing configuration
- **Migration**: Provide migration guide and compatibility layer

### Decision: Concurrent Features Support
- **What**: Add support for React 18 concurrent features
- **Why**: Leverage performance improvements and new capabilities
- **Impact**: New optional features, no breaking changes
- **Implementation**: Add compatibility hooks and utilities

### Decision: Testing Framework Modernization
- **What**: Upgrade Jest and React Testing Library
- **Why**: Ensure proper React 18 testing support
- **Impact**: Updated test utilities, maintained compatibility
- **Migration**: Gradual upgrade with backwards compatibility

## Risks / Trade-offs

### High Risk: React Router v6 Breaking Changes
- **Risk**: Existing applications may break due to API changes
- **Mitigation**: 
  - Provide comprehensive migration guide
  - Create compatibility layer for common patterns
  - Update all examples with v6 patterns

### Medium Risk: Dependency Conflicts
- **Risk**: New dependencies may conflict with user projects
- **Mitigation**: 
  - Use peer dependencies appropriately
  - Test with common dependency combinations
  - Provide clear version requirements

### Low Risk: Performance Regression
- **Risk**: New features may impact performance
- **Mitigation**: 
  - Benchmark against current version
  - Optimize critical paths
  - Monitor performance metrics

## Migration Plan

### Phase 1: Foundation (Days 1-3)
1. Update build tools and ESLint configuration
2. Upgrade core dependencies (React, Redux)
3. Establish testing framework compatibility

### Phase 2: React 18 Features (Days 4-6)  
1. Implement concurrent features support
2. Add Strict Mode compatibility
3. Optimize for automatic batching

### Phase 3: Ecosystem Updates (Days 7-9)
1. Migrate to React Router v6
2. Update Redux ecosystem
3. Modernize remaining dependencies

### Phase 4: Validation (Days 10-12)
1. Comprehensive testing
2. Performance benchmarking
3. Documentation updates

### Phase 5: Release (Days 13-14)
1. Release candidate testing
2. Final validation
3. Official release

**Rollback Plan:**
- Maintain previous version branch
- Document rollback procedures
- Provide downgrade instructions

## Open Questions
- Should we provide automatic migration tools for React Router v6?
- What level of React 16.14 support is required (full vs partial)?
- Should we create compatibility packages for major breaking changes?

## Technical Architecture

### Current Architecture
```
dva (main package)
├── dva-core (Redux + Saga integration)
├── dva-loading (Loading state management)
├── dva-immer (Immutability helpers)
└── Examples and documentation
```

### Target Architecture
```
dva v3.0 (React 18 compatible)
├── dva-core (Enhanced with React 18 support)
├── dva-loading (Updated for concurrent features)
├── dva-immer (Optimized for React 18)
├── dva-router (React Router v6 integration)
└── Updated examples and documentation
```

### Key Integration Points
1. **Rendering Layer**: React 18 createRoot API
2. **State Management**: Redux + React 18 concurrent features
3. **Routing**: React Router v6 integration
4. **Testing**: Updated test utilities and fixtures
