"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiCall, apiPost, apiGet } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 On mount, check for existing token and validate it
  useEffect(() => {
    const initAuth = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("agrocare_token")
          : null;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await apiGet("/api/auth/me");
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          location: userData.location || "",
          farmSize: userData.farm_size || "",
          primaryCrops: userData.primary_crops || ["Wheat", "Rice", "Maize"],
          createdAt: userData.created_at,
        });
      } catch (err) {
        // Token is invalid or expired — clear it
        console.warn("⚠️ Token validation failed:", err.message);
        localStorage.removeItem("agrocare_token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const data = await apiPost("/api/auth/login", { email, password });

      // Store JWT token
      localStorage.setItem("agrocare_token", data.access_token);

      const u = data.user;
      setUser({
        id: u.id,
        email: u.email,
        name: u.name,
        location: u.location || "",
        farmSize: u.farm_size || "",
        primaryCrops: u.primary_crops || ["Wheat", "Rice", "Maize"],
        createdAt: u.created_at,
      });
      setError(null);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  };

  // 📝 SIGNUP
  const signup = async (name, email, password, location, farmSize) => {
    try {
      const data = await apiPost("/api/auth/signup", {
        name,
        email,
        password,
        location: location || "",
        farm_size: farmSize || "",
      });

      // Store JWT token
      localStorage.setItem("agrocare_token", data.access_token);

      const u = data.user;
      setUser({
        id: u.id,
        email: u.email,
        name: u.name,
        location: u.location || "",
        farmSize: u.farm_size || "",
        primaryCrops: u.primary_crops || ["Wheat", "Rice", "Maize"],
        createdAt: u.created_at,
      });
      setError(null);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Signup failed",
      };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    localStorage.removeItem("agrocare_token");
    setUser(null);
  };

  // 👤 UPDATE PROFILE
  const updateProfile = async (updatedData) => {
    try {
      const payload = {};
      if (updatedData.name !== undefined) payload.name = updatedData.name;
      if (updatedData.location !== undefined)
        payload.location = updatedData.location;
      if (updatedData.farmSize !== undefined)
        payload.farm_size = updatedData.farmSize;

      const result = await apiCall("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      setUser((prev) => ({
        ...prev,
        name: result.name || prev.name,
        location: result.location || prev.location,
        farmSize: result.farm_size || prev.farmSize,
      }));

      return { success: true };
    } catch (error) {
      console.error("Profile update failed:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  // Always render children, even with errors - prevent infinite loading
  return (
    <AuthContext.Provider value={value}>
      {error && (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            backgroundColor: "#fee",
            border: "2px solid #c33",
            borderRadius: "8px",
            color: "#c33",
          }}
        >
          <strong>⚠️ Authentication Error:</strong> {error}
          <br />
          <small>
            You can still browse the site, but authentication features may not
            work.
          </small>
        </div>
      )}
      {!loading ? (
        children
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div>Loading authentication...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
