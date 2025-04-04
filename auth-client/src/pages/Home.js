import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <header>
        <h1>Welcome to Auth System</h1>
        <p>A complete authentication solution</p>
      </header>

      <main>
        {user ? (
          <div className="auth-buttons">
            <Link to="/dashboard" className="btn">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        )}

        <section className="features">
          <div className="feature-card">
            <h3>Secure Authentication</h3>
            <p>Protected routes and JWT token validation</p>
          </div>
          <div className="feature-card">
            <h3>Role Management</h3>
            <p>Different access levels for admin and members</p>
          </div>
          <div className="feature-card">
            <h3>Responsive Design</h3>
            <p>Works on all device sizes</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
