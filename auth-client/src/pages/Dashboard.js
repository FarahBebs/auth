import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.username}!</h1>
      <p>Your role: {user?.role_id === 1 ? "Admin" : "Member"}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
