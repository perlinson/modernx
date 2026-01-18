import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
  Routes, 
  Route, 
  Navigate, 
  Link, 
  NavLink,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { routerV6Compat } from 'dva';

// Components
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import UserDetail from './components/UserDetail';
import Posts from './components/Posts';
import PostDetail from './components/PostDetail';
import Profile from './components/Profile';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }) {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Navigation Component using v6 patterns
function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  
  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
    navigate('/login');
  };
  
  const isActivePath = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav style={{ 
      padding: '10px', 
      background: '#f0f0f0', 
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <NavLink 
          to="/" 
          style={{ marginRight: '15px', textDecoration: 'none' }}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Home
        </NavLink>
        
        {isAuthenticated && (
          <>
            <NavLink 
              to="/dashboard" 
              style={{ marginRight: '15px', textDecoration: 'none' }}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/users" 
              style={{ marginRight: '15px', textDecoration: 'none' }}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Users
            </NavLink>
            
            <NavLink 
              to="/posts" 
              style={{ marginRight: '15px', textDecoration: 'none' }}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Posts
            </NavLink>
            
            <NavLink 
              to="/profile" 
              style={{ marginRight: '15px', textDecoration: 'none' }}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Profile
            </NavLink>
          </>
        )}
      </div>
      
      <div>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

// Compatibility Example - Using v5-style components
function CompatibilityExample() {
  const history = routerV6Compat.useCompatHistory();
  const match = routerV6Compat.useCompatRouteMatch('/users/:id');
  const query = routerV6Compat.useCompatQuery();
  
  return (
    <div style={{ padding: '20px', background: '#f9f9f9', margin: '20px 0' }}>
      <h3>Compatibility Layer Example</h3>
      <p>Current path: {history.location.pathname}</p>
      <p>Query params: {JSON.stringify(query)}</p>
      <p>Route match: {match ? JSON.stringify(match.params) : 'No match'}</p>
      
      <button onClick={() => history.push('/users')}>
        Go to Users (v5-style)
      </button>
    </div>
  );
}

// Main App Component using React Router v6
function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Fetch initial data
    dispatch({ type: 'posts/fetchPosts' });
  }, [dispatch]);
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>DVA + React Router v6 Example</h1>
      
      <Navigation />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/users/:id" 
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/posts" 
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/posts/:id" 
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <CompatibilityExample />
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h3>React Router v6 Features Demonstrated:</h3>
        <ul>
          <li>New Routes component replacing Switch</li>
          <li>element prop replacing component prop</li>
          <li>useNavigate hook replacing useHistory</li>
          <li>useSearchParams for query parameters</li>
          <li>Navigate component replacing Redirect</li>
          <li>NavLink for active styling</li>
          <li>Protected route patterns</li>
          <li>Compatibility layer for v5 patterns</li>
        </ul>
      </div>
    </div>
  );
}

export default connect()(App);
