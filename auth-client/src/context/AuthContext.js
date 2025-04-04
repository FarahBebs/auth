import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        formData
      );
      setAuthToken(res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        formData
      );
      setAuthToken(res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
