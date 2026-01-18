/**
 * React Router v6 Compatibility Layer
 * Provides backward compatibility for React Router v5 patterns while supporting v6
 */

import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  useMatch
} from 'react-router-dom';
import { createElement } from 'react';

/**
 * Compatibility wrapper for React Router v5 <Switch> component
 * Usage: <RouterSwitch><Route path="/home" component={Home} /></RouterSwitch>
 */
export function RouterSwitch({ children }) {
  return createElement(Routes, null, children);
}

/**
 * Enhanced Route component that supports both v5 and v6 patterns
 * - v5 pattern: <Route path="/home" component={Home} exact />
 * - v6 pattern: <Route path="/home" element={<Home />} />
 */
export function CompatRoute({ component, element, render, children, ...props }) {
  if (component) {
    // v5 pattern: convert component prop to element
    const Element = component;
    return createElement(Route, { ...props, element: createElement(Element) });
  } else if (render) {
    // v5 pattern: convert render prop to element
    return createElement(Route, { ...props, element: render() });
  } else if (children) {
    // v5 pattern: children as function
    if (typeof children === 'function') {
      return createElement(Route, { ...props, element: children() });
    }
    // v6 pattern: children as JSX
    return createElement(Route, { ...props }, children);
  } else {
    // v6 pattern: element prop
    return createElement(Route, { ...props, element });
  }
}

/**
 * Compatibility hook for v5 useHistory
 * Replaces: useHistory() -> useNavigate()
 */
export function useCompatHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return {
    push: (path, state) => {
      if (typeof path === 'string') {
        navigate(path, { state });
      } else {
        navigate(path);
      }
    },
    replace: (path, state) => {
      if (typeof path === 'string') {
        navigate(path, { replace: true, state });
      } else {
        navigate(path, { replace: true });
      }
    },
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    block: (handler) => {
      // Note: React Router v6 doesn't have built-in blocking
      // This would need custom implementation
      console.warn('History blocking is not fully supported in React Router v6');
      return () => {};
    },
    location,
    createHref: (to) => {
      // Simple implementation - would need full URL resolution
      return typeof to === 'string' ? to : to.pathname || '/';
    }
  };
}

/**
 * Compatibility hook for v5 useLocation
 * Replaces: useLocation() -> useLocation() (same in v6)
 */
export function useCompatLocation() {
  return useLocation();
}

/**
 * Compatibility hook for v5 useParams
 * Replaces: useParams() -> useParams() (same in v6)
 */
export function useCompatParams() {
  return useParams();
}

/**
 * Compatibility hook for v5 useRouteMatch
 * Replaces: useRouteMatch(path) -> useMatch(path)
 */
export function useCompatRouteMatch(path) {
  return useMatch(path);
}

/**
 * Compatibility hook for v5 useSearchParams
 * Replaces: useSearchParams() -> useSearchParams() (same in v6)
 */
export function useCompatSearchParams() {
  return useSearchParams();
}

/**
 * Compatibility component for v5 Redirect
 * Replaces: <Redirect to="/home" /> -> <Navigate to="/home" />
 */
export function CompatRedirect({ to, push = false, ...props }) {
  return createElement(Navigate, { to, replace: !push, ...props });
}

/**
 * Compatibility component for v5 Link
 * Provides similar API to v5 Link while supporting v6 navigation
 */
export function CompatLink({ to, replace = false, className, style, children, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to, { replace });
  };
  
  const finalClassName = className || '';
  const finalStyle = style || {};
  
  return createElement('a', {
    href: typeof to === 'string' ? to : to.pathname,
    onClick: handleClick,
    className: finalClassName,
    style: finalStyle,
    ...props
  }, children);
}

/**
 * Higher-order component for React Router v6 compatibility
 * Wraps a component to provide v5-style props
 */
export function withRouterV6Compat(Component) {
  return function RouterV6CompatWrapper(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    
    return createElement(Component, {
      ...props,
      location,
      navigate,
      params,
      history: useCompatHistory()
    });
  };
}

/**
 * Utility to create route configuration compatible with both v5 and v6
 * Supports both v5 and v6 route objects
 */
export function createRouteConfig(routes) {
  return routes.map(route => {
    if (route.component) {
      // v5 pattern
      return {
        ...route,
        element: createElement(route.component)
      };
    }
    // v6 pattern - already has element
    return route;
  });
}

/**
 * Utility to convert v5 routes to v6 format
 */
export const convertRoutes = (v5Routes) => {
  return v5Routes.map(route => {
    const v6Route = {
      path: route.path,
      element: route.component ? createElement(route.component) : route.element
    };
    
    // Copy other properties
    Object.keys(route).forEach(key => {
      if (key !== 'component' && key !== 'element') {
        v6Route[key] = route[key];
      }
    });
    
    return v6Route;
  });
};

/**
 * Migration utilities for React Router v5 to v6
 */
export const routerV6MigrationUtils = {
  /**
   * Convert v5 route config to v6
   */
  convertRoutes: (v5Routes) => {
    return v5Routes.map(route => {
      const v6Route = {
        path: route.path,
        element: route.component ? createElement(route.component) : route.element
      };
      
      Object.keys(route).forEach(key => {
        if (key !== 'component' && key !== 'element') {
          v6Route[key] = route[key];
        }
      });
      
      return v6Route;
    });
  },
  
  /**
   * Get migration tips for common patterns
   */
  getMigrationTips: () => [
    'Replace <Switch> with <Routes>',
    'Replace component prop with element prop',
    'Replace useHistory() with useNavigate()',
    'Replace <Redirect> with <Navigate>',
    'Replace <Link activeClassName with <NavLink>',
    'Use useSearchParams() for query parameters',
    'Route children are now JSX elements, not render props'
  ]
};

export default {
  RouterSwitch,
  CompatRoute,
  CompatRedirect,
  CompatLink,
  useCompatHistory,
  useCompatLocation,
  useCompatParams,
  useCompatRouteMatch,
  useCompatSearchParams,
  withRouterV6Compat,
  createRouteConfig,
  convertRoutes,
  routerV6MigrationUtils
};
