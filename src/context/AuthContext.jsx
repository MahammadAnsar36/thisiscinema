import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [selectedCity, setSelectedCity] = useState("Select City");

    // ✅ On app load, attempt to load from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedCity = localStorage.getItem("selectedCity");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        if (storedCity) {
            setSelectedCity(storedCity);
        }
    }, []);

    // ✅ Login function
    const login = (userData, userToken) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userToken);
        setUser(userData);
        setToken(userToken);
    };

    // ✅ Logout function
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    // ✅ Change selected city globally
    const changeCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem("selectedCity", city);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                selectedCity,
                changeCity,
                setUser, // optional if needed for manual user state updates
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
