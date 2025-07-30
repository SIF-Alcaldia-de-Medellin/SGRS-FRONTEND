import { createContext, useContext, useState, ReactNode } from "react";

interface User {
    isAuthenticated: boolean;
    token: string | null;
    role: string | null;
    isFirstTime: boolean | null;
}

interface AuthContextType {
    user: User;
    login: (token: string, role: string, isFirstTime: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>({
        isAuthenticated: localStorage.getItem("token") ? true : false,
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        isFirstTime: localStorage.getItem('isFirstTime') === 'true',
    });

    const login = (token:string, role: string, isFirstTime: boolean) => {
        localStorage.setItem("token", token)
        localStorage.setItem("role", role)
        localStorage.setItem('isFirstTime', isFirstTime.toString())
        setUser({ isAuthenticated: true, role, token, isFirstTime })
    };
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("isFirstTime")
        setUser({ isAuthenticated: false, role: null, token: null, isFirstTime: null })
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};