"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [tipo, setTipo] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear();
        return;
      }

      setIsAuth(true);
      setTipo(payload.tipo);
      setIsSuperuser(payload.is_superuser);

    } catch {
      localStorage.clear();
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("Token", token);

    const payload = JSON.parse(atob(token.split('.')[1]));

    setIsAuth(true);
    setTipo(payload.tipo);
    setIsSuperuser(payload.is_superuser);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
    setTipo(null);
    setIsSuperuser(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, tipo, isSuperuser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);