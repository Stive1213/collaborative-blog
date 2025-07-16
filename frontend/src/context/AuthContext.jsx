import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            setUser(JSON.parse(localStorage.getItem('user')));
        }
    }, [token]);
    const login = (userData, jwt) => {
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setToken(jwt);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);