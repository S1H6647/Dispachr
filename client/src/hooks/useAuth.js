import { useEffect, useState } from "react";

// Cache auth state to prevent repeated API calls
let cachedAuth = null;
let cachedUser = null;

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(cachedAuth);
    const [user, setUser] = useState(cachedUser);

    useEffect(() => {
        // Skip if already cached
        if (cachedAuth !== null) {
            return;
        }

        const checkAuth = async () => {
            try {
                const response = await fetch("/api/users/me", {
                    credentials: "include",
                });

                const data = await response.json();

                if (response.ok) {
                    cachedUser = data.user;
                    cachedAuth = true;
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    cachedUser = null;
                    cachedAuth = false;
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                cachedUser = null;
                cachedAuth = false;
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Function to clear cache on logout
    const clearAuth = () => {
        cachedAuth = null;
        cachedUser = null;
        setIsAuthenticated(false);
        setUser(null);
    };

    // Function to set auth after login
    const setAuth = (userData) => {
        cachedAuth = true;
        cachedUser = userData;
        setIsAuthenticated(true);
        setUser(userData);
    };

    return { isAuthenticated, user, clearAuth, setAuth };
};
