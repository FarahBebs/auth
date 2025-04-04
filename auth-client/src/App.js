import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          AuthSystem
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default App;
