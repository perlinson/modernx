## ADDED Requirements

### Requirement: React 18 Testing Framework Support
The dva framework SHALL provide testing utilities compatible with React 18 and modern testing frameworks.

#### Scenario: Jest React 18 compatibility
- **WHEN** running Jest tests with React 18
- **THEN** test environment shall properly support React 18 features
- **AND** concurrent rendering shall work in test environment
- **AND** act() utility shall handle async updates correctly

#### Scenario: React Testing Library v13+ integration
- **WHEN** using React Testing Library with dva components
- **THEN** testing utilities shall work with React 18 createRoot
- **AND** screen queries shall work with concurrent features
- **AND** user event simulation shall handle async updates

### Requirement: Concurrent Features Testing
The dva framework SHALL provide testing utilities for React 18 concurrent features.

#### Scenario: useTransition testing
- **WHEN** testing components using useTransition
- **THEN** test utilities shall properly handle transition states
- **AND** pending states shall be testable
- **AND** async updates shall be properly awaited

#### Scenario: Suspense testing
- **WHEN** testing components with Suspense boundaries
- **THEN** loading states shall be testable
- **AND** error boundaries shall be testable
- **AND** data fetching patterns shall work correctly

### Requirement: Performance Testing Framework
The dva framework SHALL provide performance testing utilities for React 18 optimizations.

#### Scenario: Automatic batching verification
- **WHEN** testing React 18 automatic batching
- **THEN** test utilities shall verify batching behavior
- **AND** render count assertions shall be available
- **AND** performance regression tests shall be possible

#### Scenario: Concurrent rendering performance
- **WHEN** testing concurrent rendering performance
- **THEN** timing utilities shall measure render performance
- **AND** memory usage tests shall be available
- **AND** concurrent feature impact shall be measurable

### Requirement: Mock and Stub Utilities
The dva framework SHALL provide updated mocking utilities for React 18 testing.

#### Scenario: Redux store mocking
- **WHEN** mocking Redux store in tests
- **THEN** mock store shall work with React 18 concurrent features
- **AND** state updates shall be properly batched
- **AND** async actions shall be testable

#### Scenario: Router mocking
- **WHEN** mocking React Router v6 in tests
- **THEN** navigation utilities shall work with v6 hooks
- **AND** route parameters shall be mockable
- **AND** navigation actions shall be testable

## MODIFIED Requirements

### Requirement: Test Configuration Updates
The dva framework's test configuration SHALL be updated for React 18 compatibility.

#### Scenario: Jest configuration
- **WHEN** configuring Jest for dva testing
- **THEN** setup files shall support React 18 test environment
- **AND** transform configurations shall handle new syntax
- **AND** module mocking shall work with updated dependencies

#### Scenario: Test scripts update
- **WHEN** running test scripts
- **THEN** npm test commands shall use updated Jest configuration
- **AND** coverage reporting shall work with new test structure
- **AND** watch mode shall handle React 18 features correctly

### Requirement: Example Test Updates
The dva framework's example tests SHALL be updated to demonstrate React 18 testing patterns.

#### Scenario: Component testing examples
- **WHEN** reviewing example component tests
- **THEN** tests shall demonstrate React 18 best practices
- **AND** concurrent features shall be properly tested
- **AND** async patterns shall be clearly shown

#### Scenario: Integration testing examples
- **WHEN** reviewing integration tests
- **THEN** tests shall show dva + React 18 integration patterns
- **AND** routing tests shall use React Router v6 patterns
- **AND** state management tests shall demonstrate batching

## REMOVED Requirements

### Requirement: Legacy React Testing Utilities
**Reason**: Old testing utilities are incompatible with React 18 concurrent features  
**Migration**: Use updated testing utilities and patterns

#### Scenario: Deprecated test utilities
- **WHEN** using legacy dva testing utilities
- **THEN** deprecation warnings shall guide migration
- **AND** migration documentation shall be provided
- **AND** compatibility shall be maintained for one major version

### Requirement: React 16 Specific Test Patterns
**Reason**: React 16 testing patterns don't leverage React 18 features  
**Migration**: Adopt React 18 testing patterns and utilities

#### Scenario: Outdated test patterns
- **WHEN** using React 16 specific test patterns
- **THEN** warnings shall suggest modern alternatives
- **AND** documentation shall provide React 18 patterns
- **AND** test refactoring guidance shall be available
